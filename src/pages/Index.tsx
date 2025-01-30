import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <CategorySection />
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;