
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const MenswearSection = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] overflow-hidden rounded-lg mb-8">
          <img
            src="https://img.freepik.com/premium-photo/portrait-handsome-male-model_379823-21946.jpg"
            alt="Menswear"
            className="w-full h-full object-cover transform scale-[1.1]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
            <h2 className="text-white text-4xl font-bold mb-4">Menswear</h2>
            <Button asChild className="bg-white text-black hover:bg-gray-100">
              <Link to="/menswear">Shop now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenswearSection;
