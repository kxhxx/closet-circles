import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import SearchBar from "./product/SearchBar";
import ProductFilters from "./product/ProductFilters";
import ProductCard from "./product/ProductCard";

const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch, priceRange, selectedCategory, sortBy],
    queryFn: async () => {
      let query = supabase.from("items").select("*");

      if (debouncedSearch) {
        query = query.ilike("title", `%${debouncedSearch}%`);
      }

      if (priceRange !== "all") {
        switch (priceRange) {
          case "0-50":
            query = query.lte("price", 50);
            break;
          case "51-100":
            query = query.gt("price", 50).lte("price", 100);
            break;
          case "101-200":
            query = query.gt("price", 100).lte("price", 200);
            break;
          case "200+":
            query = query.gt("price", 200);
            break;
        }
      }

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      switch (sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "price-high":
          query = query.order("price", { ascending: false });
          break;
        case "price-low":
          query = query.order("price", { ascending: true });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold">Browse Repop</h2>
            <div className="w-full md:w-auto">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
          
          <ProductFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;