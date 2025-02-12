
import Navbar from "@/components/Navbar";
import { 
  Dress, 
  Scroll,
  Watch, 
  Snowflake, 
  Footprints
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductGrid from "@/components/ProductGrid";

const categories = [
  { name: "Dresses", icon: Dress },
  { name: "Bottom-wear", icon: Scroll },
  { name: "Accessories", icon: Watch },
  { name: "Winter Wear", icon: Snowflake },
  { name: "Footwear", icon: Footprints },
];

const WomenswearPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
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
          <h3 className="text-2xl font-bold mb-6">Browse Women's Collection</h3>
          <ProductGrid />
        </div>
      </main>
    </div>
  );
};

export default WomenswearPage;
