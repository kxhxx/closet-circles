import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const ProductDetail = () => {
  const { id } = useParams();
  const numericId = id ? parseInt(id) : 0;

  console.log("Fetching product with ID:", numericId); // Debug log

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["item", numericId],
    queryFn: async () => {
      console.log("Executing query for ID:", numericId); // Debug log
      const { data, error } = await supabase
        .from("items")
        .select(`
          *,
          profiles:user_id (
            username,
            profile_picture
          )
        `)
        .eq("id", numericId)
        .maybeSingle();

      console.log("Query result:", { data, error }); // Debug log

      if (error) {
        console.error("Supabase error:", error); // Debug log
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Query error:", error); // Debug log
    return <div>Error loading product</div>;
  }

  if (!item) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src="/lovable-uploads/bd4bead3-ca1c-4e4f-883b-fffa05c64b81.png"
              alt={item.title}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{item.title}</h1>
                <p className="text-xl font-medium mt-2">${item.price}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">Category: {item.category}</p>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {item.profiles?.profile_picture ? (
                      <img
                        src={item.profiles.profile_picture}
                        alt={item.profiles.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {item.profiles?.username || "Unknown Seller"}
                    </h3>
                    <p className="text-sm text-gray-500">Seller</p>
                  </div>
                  <Button className="ml-auto">Message</Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1">Buy Now</Button>
              <Button variant="outline" className="flex-1">
                Make Offer
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;