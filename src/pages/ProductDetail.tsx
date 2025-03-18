
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  
  // Validate ID parameter
  const numericId = id ? Number(id) : null;
  const isValidId = numericId && !isNaN(numericId) && Number.isInteger(numericId);

  // Get buy intent from URL query params
  const buyIntent = new URLSearchParams(location.search).get('intent') === 'buy';

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      
      // Check if item is liked
      if (data.session?.user && numericId) {
        const liked = authService.checkIfLiked(data.session.user.id, numericId);
        setIsLiked(liked);
      }
    };
    
    checkAuth();
    
    // If buyIntent is true, scroll to buy section
    if (buyIntent) {
      setTimeout(() => {
        document.getElementById('buy-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [numericId, buyIntent]);

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
  
  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like this item",
        variant: "destructive",
      });
      return;
    }
    
    if (!numericId) return;
    
    const { action, isLiked: newLikedState } = await authService.toggleLike(
      user.id,
      numericId
    );
    
    setIsLiked(newLikedState);
    
    toast({
      title: action === 'liked' ? "Added to favorites" : "Removed from favorites",
      description: action === 'liked' ? "This item has been added to your favorites" : "This item has been removed from your favorites",
    });
  };
  
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }
    
    if (!numericId) return;
    
    await authService.addToCart(user.id, numericId);
    
    toast({
      title: "Added to cart",
      description: `${item?.title} has been added to your cart`,
    });
  };
  
  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase items",
        variant: "destructive",
      });
      return;
    }
    
    if (!item || !numericId) return;
    
    toast({
      title: "Processing purchase",
      description: "Redirecting to payment gateway...",
    });
    
    // Simulate payment process
    setTimeout(() => {
      // In a real app this would be handled via a payment gateway
      authService.buyNow(numericId, user.id, item.user_id, item.price)
        .then(() => {
          toast({
            title: "Purchase successful",
            description: `You have successfully purchased ${item.title}`,
          });
        })
        .catch((err) => {
          toast({
            title: "Purchase failed",
            description: err.message || "An error occurred during purchase",
            variant: "destructive",
          });
        });
    }, 2000);
  };
  
  const handleMakeOffer = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make an offer",
        variant: "destructive",
      });
      return;
    }
    
    if (!item) return;
    
    // Show offer dialog or navigate to offer page
    toast({
      title: "Offers coming soon",
      description: "This feature will be available soon",
    });
  };

  // Handle errors and navigation with useEffect
  useEffect(() => {
    if (error || !isValidId) {
      const errorMessage = !isValidId ? "Invalid product ID" : "Product not found";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Redirect to home after a short delay
      const timeout = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [error, isValidId, toast, navigate]);

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

  // Show error state
  if (error || !isValidId) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            {!isValidId ? "Invalid product ID" : "Product not found"}
          </div>
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
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${isLiked ? 'bg-red-100 text-red-500' : ''}`}
                onClick={handleLikeToggle}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
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
                    onClick={() => navigate(`/profile/${profile?.username}`)}
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

            <div id="buy-section" className="flex gap-4">
              <Button 
                className="flex-1"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleMakeOffer}
              >
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
