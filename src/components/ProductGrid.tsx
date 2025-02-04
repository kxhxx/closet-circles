import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import FilterSection from "./product/FilterSection";
import ProductList from "./product/ProductList";

const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleSearch = (query: string) => {
    setActiveSearch(query);
  };

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", activeSearch, priceRange, selectedCategory, sortBy],
    queryFn: async () => {
      let query = supabase.from("items").select("*");

      if (activeSearch) {
        query = query.ilike("title", `%${activeSearch}%`);
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

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <ProductList products={products || []} />
      </div>
    </section>
  );
};

export default ProductGrid;