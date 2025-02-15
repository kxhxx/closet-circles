
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white perspective-1000">
      <div className="transform-preserve-3d transition-transform duration-500 animate-in fade-in slide-in-from-right-52 rotate-y-0">
        <Navbar />
        <main>
          <CategorySection />
        </main>
      </div>
    </div>
  );
};

export default Index;
