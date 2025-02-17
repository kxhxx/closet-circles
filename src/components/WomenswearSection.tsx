import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const WomenswearSection = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] overflow-hidden rounded-lg mb-8">
          <img
            src="/lovable-uploads/7c2bb23a-97b9-4fb8-8aea-3d640a643233.png"
            alt="Womenswear"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
            <h2 className="text-white text-4xl font-bold mb-4">Womenswear</h2>
            <Button asChild className="bg-white text-black hover:bg-gray-100">
              <Link to="/womenswear">Shop now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WomenswearSection;
