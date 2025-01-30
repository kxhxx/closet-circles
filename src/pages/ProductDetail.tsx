import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Validate ID parameter
  const numericId = id ? Number(id) : null;
  const isValidId = numericId && !isNaN(numericId) && Number.isInteger(numericId);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["item", numericId],
    queryFn: async () => {
      // Don't make the API call if ID is invalid
      if (!isValidId) {
        throw new Error("Invalid product ID");
      }

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

      if (error) throw error;
      if (!data) throw new Error("Product not found");
      return data;
    },
    retry: false, // Don't retry on invalid IDs
  });

  const { data: profile } = useQuery({
    queryKey: ["testProfile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", "kshitij")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  // Handle errors
  if (error || !isValidId) {
    const errorMessage = !isValidId ? "Invalid product ID" : "Product not found";
    
    // Show error toast
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    // Redirect to home after a short delay
    setTimeout(() => navigate("/"), 2000);

    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{errorMessage}</div>
        </main>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Product not found</div>
        </main>
      </div>
    );
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
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-4 flex-1"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profile?.profile_picture ? (
                        <img
                          src={profile.profile_picture}
                          alt={profile.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">
                        {profile?.username || "Unknown Seller"}
                      </h3>
                      <p className="text-sm text-gray-500">Seller</p>
                    </div>
                  </Button>
                  <Button>Message</Button>
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