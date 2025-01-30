import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const { data: profile } = useQuery({
    queryKey: ["testProfile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", "kshitij")
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {profile && (
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div 
              className="mb-8 flex items-center space-x-4 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate('/profile')}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.profile_picture} alt={profile.username} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            </div>
          </div>
        )}
        <CategorySection />
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;