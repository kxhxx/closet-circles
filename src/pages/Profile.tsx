import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { MessageDialog } from "@/components/messages/MessageDialog";

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // Get username from URL
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [session, setSession] = useState<any>(null);

  // Fetch profile data based on username parameter
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        toast({
          title: "Error",
          description: "Profile not found",
          variant: "destructive",
        });
        navigate("/");
        throw new Error("Profile not found");
      }

      return data;
    },
    enabled: !!username,
  });

  // Fetch items for the profile
  const { data: userItems, isLoading: itemsLoading } = useQuery({
    queryKey: ["userItems", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", profile?.id)
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
    enabled: !!profile?.id,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (profileLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Profile not found</div>
        </main>
      </div>
    );
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

  const isOwnProfile = session?.user?.id === profile.id;

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
                {isOwnProfile ? (
                  <Button variant="outline" onClick={() => navigate("/profile/edit")}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="outline">
                      Follow
                    </Button>
                    <MessageDialog 
                      recipientId={profile.id} 
                      recipientName={profile.username}
                    />
                  </>
                )}
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
