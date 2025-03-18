
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    category: string;
    user_id?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      
      // Check if item is liked
      if (data.session?.user) {
        const liked = authService.checkIfLiked(data.session.user.id, product.id);
        setIsLiked(liked);
      }
    };
    
    checkAuth();
  }, [product.id]);

  const convertToINR = (usdPrice: number) => {
    return Math.round(usdPrice * 83);
  };
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like items",
        variant: "destructive",
      });
      return;
    }
    
    const { action, isLiked: newLikedState } = await authService.toggleLike(
      user.id,
      product.id
    );
    
    setIsLiked(newLikedState);
    
    toast({
      title: action === 'liked' ? "Added to favorites" : "Removed from favorites",
      description: action === 'liked' ? "Item has been added to your favorites" : "Item has been removed from your favorites",
    });
  };
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }
    
    await authService.addToCart(user.id, product.id);
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };
  
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase items",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to product page with buy intent
    navigate(`/product/${product.id}?intent=buy`);
  };

  return (
    <Link to={`/product/${product.id}`}>
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
            className={`absolute top-2 right-2 ${isLiked ? 'bg-red-100 text-red-500' : 'bg-white/80'} backdrop-blur-sm hover:bg-white`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <div className="mt-2">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <span className="text-lg font-medium">
                ₹{convertToINR(product.price).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>
          <h3 className="text-sm text-gray-700">{product.title}</h3>
          <div className="mt-2 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
