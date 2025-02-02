import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    category: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const convertToINR = (usdPrice: number) => {
    return Math.round(usdPrice * 83);
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
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Heart className="h-5 w-5" />
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
  );
};

export default ProductCard;