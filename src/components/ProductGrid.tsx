import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "Adidas Track Pants",
    price: 11.99,
    originalPrice: 14.99,
    size: "L",
    image: "/lovable-uploads/bd4bead3-ca1c-4e4f-883b-fffa05c64b81.png"
  },
  {
    id: 2,
    title: "Puma Running Shoes",
    price: 27.00,
    size: "US 8",
    image: "/lovable-uploads/bd4bead3-ca1c-4e4f-883b-fffa05c64b81.png"
  },
  {
    id: 3,
    title: "Black Flare Pants",
    price: 22.00,
    size: "20",
    image: "/lovable-uploads/bd4bead3-ca1c-4e4f-883b-fffa05c64b81.png"
  },
  {
    id: 4,
    title: "Teddy Bear Sweater",
    price: 40.00,
    originalPrice: 50.00,
    size: "L",
    image: "/lovable-uploads/bd4bead3-ca1c-4e4f-883b-fffa05c64b81.png"
  }
];

const ProductGrid = () => {
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
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.image}
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
                    {product.originalPrice ? (
                      <div className="flex gap-2">
                        <span className="text-lg font-medium">${product.price}</span>
                        <span className="text-lg text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-medium">${product.price}</span>
                    )}
                    <span className="text-sm text-gray-500">{product.size}</span>
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