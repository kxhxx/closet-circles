import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
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
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
          <a href="/" className="text-depop-red font-bold text-2xl">
            repop
          </a>
        </div>
        
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-depop-red"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-6 w-6" />
          </Button>
          {profile ? (
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => navigate('/profile')}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.profile_picture} alt={profile.username} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{profile.username}</span>
            </Button>
          ) : (
            <Button className="bg-black text-white hover:bg-gray-800">
              Sign up
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;