import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pencil, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Info */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  {profile?.profile_picture ? (
                    <AvatarImage src={profile.profile_picture} alt={profile.username} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{profile?.username}</h2>
                  <p className="text-muted-foreground">{profile?.bio || "No bio yet"}</p>
                </div>
                <div className="flex gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{profile?.followers_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile?.following_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/profile/edit")}
                  variant="outline"
                  className="w-full"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Items */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-xl font-bold">Listed Items</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userItems?.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <img
                        src="/placeholder.svg"
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h4 className="mt-2 font-semibold">{item.title}</h4>
                    <p className="text-lg font-bold">${item.price}</p>
                  </CardContent>
                </Card>
              ))}
              {userItems?.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground">
                  No items listed yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;