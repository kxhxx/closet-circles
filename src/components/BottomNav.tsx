import { Home, MessageCircle, Heart, User, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BottomNav = () => {
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (uid: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', uid)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (profile) {
      setUsername(profile.username);
    }
  };

  const navigationItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageCircle,
    },
    {
      title: "Sell",
      url: "/sell",
      icon: PlusCircle,
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
    },
    {
      title: "Profile",
      url: userId && username ? `/profile/${username}` : "/auth",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 px-4 md:hidden">
      <div className="h-full max-w-lg mx-auto flex items-center justify-between">
        {navigationItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs",
              location.pathname === item.url
                ? "text-black"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;