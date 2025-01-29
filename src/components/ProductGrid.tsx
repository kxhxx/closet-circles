import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductGrid = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Repop</h2>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              Filter (1)
            </Button>
            <Button variant="outline" className="gap-2">
              Sort
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product) => (
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
                    <span className="text-lg font-medium">${product.price}</span>
                    <span className="text-sm text-gray-500">
                      {/* Size field doesn't exist in our schema yet */}
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-700">{product.title}</h3>
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