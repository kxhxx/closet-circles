import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchQuery, priceRange, selectedCategory, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("items")
        .select("*");

      // Apply search filter
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      // Apply price range filter
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

      // Apply category filter
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      // Apply sorting
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
      console.log("Fetched products:", data);
      return data;
    },
  });

  const categories = [
    "all",
    "clothes",
    "jewelry",
    "accessories",
    "electronics",
    "books",
    "home",
  ];

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
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="51-100">$51 - $100</SelectItem>
                <SelectItem value="101-200">$101 - $200</SelectItem>
                <SelectItem value="200+">$200+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src="/lovable-uploads/bd4bead3-ca1c-4e4f-883b-fffa05c64b81.png"
                    alt={product.title}
                    className="h-full w-full object-cover object-center"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <span className="text-lg font-medium">${product.price}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-700">{product.title}</h3>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Add to Cart
                    </Button>
                    <Button variant="default" size="sm" className="w-full">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;