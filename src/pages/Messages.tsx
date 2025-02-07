import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  content: string;
  sent_at: string;
  sender: {
    username: string;
    profile_picture: string | null;
  };
  receiver: {
    username: string;
    profile_picture: string | null;
  };
}

const Messages = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      if (!session?.user) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          sent_at,
          sender:profiles!messages_sender_id_fkey(username, profile_picture),
          receiver:profiles!messages_receiver_id_fkey(username, profile_picture)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("sent_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      return data as Message[];
    },
    enabled: !!userId,
  });

  const getOtherUser = (message: Message) => {
    if (!userId) return null;
    return message.sender.username === userId ? message.receiver : message.sender;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading messages...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="space-y-4">
          {messages?.map((message) => {
            const otherUser = getOtherUser(message);
            if (!otherUser) return null;

            return (
              <div
                key={message.id}
                className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/profile/${otherUser.username}`)}
              >
                <Avatar className="h-12 w-12">
                  {otherUser.profile_picture ? (
                    <AvatarImage
                      src={otherUser.profile_picture}
                      alt={otherUser.username}
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{otherUser.username}</h3>
                  <p className="text-sm text-gray-500 truncate">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(message.sent_at).toLocaleDateString()}
                </span>
              </div>
            );
          })}
          {messages?.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No messages yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;