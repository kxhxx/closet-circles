
import MenswearSection from "./MenswearSection";

const categories = [
  { name: "Menswear", image: "/lovable-uploads/7c2bb23a-97b9-4fb8-8aea-3d640a643233.png" },
  { name: "Womenswear", image: "/lovable-uploads/7c2bb23a-97b9-4fb8-8aea-3d640a643233.png" },
];

const CategorySection = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenswearSection />
          {categories.slice(1).map((category) => (
            <div key={category.name} className="relative h-[400px] overflow-hidden rounded-lg">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
                <h2 className="text-white text-4xl font-bold mb-4">{category.name}</h2>
                <button className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded">
                  Shop now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
