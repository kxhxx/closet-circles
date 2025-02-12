
import { Button } from "./ui/button";
import ProductGrid from "./ProductGrid";
import { Link } from "react-router-dom";
import { 
  Shirt, 
  Scroll,
  Watch, 
  Snowflake, 
  Footprints
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const categories = [
  { name: "T-Shirts", icon: Shirt },
  { name: "Bottom-wear", icon: Scroll },
  { name: "Accessories", icon: Watch },
  { name: "Winter Wear", icon: Snowflake },
  { name: "Footwear", icon: Footprints },
];

const MenswearSection = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] overflow-hidden rounded-lg mb-8">
          <img
            src="/lovable-uploads/7c2bb23a-97b9-4fb8-8aea-3d640a643233.png"
            alt="Menswear"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
            <h2 className="text-white text-4xl font-bold mb-4">Menswear</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-gray-100">
                  Shop now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
                <div className="py-4">
                  {/* Category Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant="outline"
                        className="w-full flex items-center gap-2 h-12"
                        asChild
                      >
                        <Link to={`/category/${category.name.toLowerCase().replace(" ", "-")}`}>
                          <category.icon className="h-5 w-5" />
                          {category.name}
                        </Link>
                      </Button>
                    ))}
                  </div>

                  {/* Browse Section */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6">Browse Men's Collection</h3>
                    <ProductGrid />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenswearSection;
