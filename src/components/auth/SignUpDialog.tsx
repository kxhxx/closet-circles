import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function SignUpDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate email
    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: emailError,
      });
      return;
    }

    // Validate password
    const passwordError = validatePassword(trimmedPassword);
    if (!isLogin && passwordError) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: passwordError,
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (authError) {
          console.error('Auth error:', authError);
          if (authError.message.includes("Email not confirmed")) {
            toast({
              variant: "destructive",
              title: "Email Not Confirmed",
              description: "Please check your email and click the confirmation link before logging in. If you can't find the email, check your spam folder.",
            });
          } else if (authError.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: "Invalid email or password. Please try again.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: authError.message,
            });
          }
        } else if (authData.user) {
          // Fetch the user's profile to get their username for redirection
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', authData.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to fetch user profile",
            });
          } else {
            toast({
              title: "Success!",
              description: "You have been logged in.",
            });
            setOpen(false);
            navigate(`/profile/${profileData.username}`);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (error) {
          console.error('Signup error:', error);
          if (error.message.includes("User already registered")) {
            toast({
              variant: "destructive",
              title: "Sign Up Failed",
              description: "This email is already registered. Please try logging in instead.",
            });
            setIsLogin(true);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          }
        } else if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                username: trimmedEmail.split('@')[0],
                user_id: data.user.id,
                bio: null,
                profile_picture: null,
                followers_count: 0,
                following_count: 0,
                ratings_count: 0
              }
            ]);

          if (profileError) {
            console.error('Error creating profile:', profileError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to create user profile",
            });
          } else {
            toast({
              title: "Success!",
              description: "Please check your email to confirm your account. The confirmation email might take a few minutes to arrive. Check your spam folder if you don't see it.",
            });
            setOpen(false);
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800">
          {isLogin ? "Log in" : "Sign up"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Log in to your account" : "Create an account"}</DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Enter your email and password to log in. Make sure you've confirmed your email address."
              : "Enter your email and password to create your account. You'll need to confirm your email address before logging in."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            {loading 
              ? (isLogin ? "Logging in..." : "Creating account...") 
              : (isLogin ? "Log in" : "Create account")
            }
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"
              }
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}