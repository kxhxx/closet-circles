
import MenswearSection from "./MenswearSection";
import WomenswearSection from "./WomenswearSection";

const CategorySection = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenswearSection />
          <WomenswearSection />
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
