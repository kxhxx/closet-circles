import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface MessageDialogProps {
  recipientId: string;
  recipientName: string;
}

export function MessageDialog({ recipientId, recipientName }: MessageDialogProps) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const session = await supabase.auth.getSession();
    const senderId = session.data.session?.user?.id;

    if (!senderId) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: senderId,
      receiver_id: recipientId,
      content: message.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Message sent successfully",
    });
    setMessage("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send message to {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSendMessage}>Send Message</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}