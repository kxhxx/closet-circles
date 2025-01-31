import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: userItems, isLoading: itemsLoading } = useQuery({
    queryKey: ["userItems", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load items",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (profileLoading || itemsLoading) {
    return <div>Loading...</div>;
  }

  const filteredItems = userItems?.filter((item) => {
    switch (activeTab) {
      case "selling":
        return !item.is_sold;
      case "sold":
        return item.is_sold;
      case "likes":
        return false; // Implement likes functionality later
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-8">
          <Avatar className="h-24 w-24">
            {profile?.profile_picture ? (
              <AvatarImage src={profile.profile_picture} alt={profile.username} />
            ) : (
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{profile?.username}</h1>
                <p className="text-muted-foreground">Active today</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/profile/edit")}>
                  Edit Profile
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <div className="font-bold">{profile?.followers_count || 0}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profile?.following_count || 0}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
            
            <p className="text-muted-foreground">{profile?.bio || "No bio yet"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex gap-8">
            {["all", "selling", "sold", "likes"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 px-1 capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-black font-semibold"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredItems?.map((item) => (
            <div
              key={item.id}
              className="aspect-square relative group cursor-pointer"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img
                src={"/lovable-uploads/bd4bead3-ca1c-4e4f-883b-fffa05c64b81.png"}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-4">
                <div className="text-white">
                  <div className="font-semibold">{item.title}</div>
                  <div>${item.price}</div>
                </div>
              </div>
            </div>
          ))}
          {filteredItems?.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No items to display
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;