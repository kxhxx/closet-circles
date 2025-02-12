
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import MenswearSection from "@/components/MenswearSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <CategorySection />
        <MenswearSection />
      </main>
    </div>
  );
};

export default Index;
