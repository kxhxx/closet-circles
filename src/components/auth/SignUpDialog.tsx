import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword } from "@/utils/authValidation";
import { authService } from "@/services/authService";
import { AuthForm } from "./AuthForm";

export function SignUpDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: emailError,
      });
      return;
    }

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
        const { data: authData, error: authError } = await authService.signIn(trimmedEmail, trimmedPassword);

        if (authError) {
          handleAuthError(authError);
        } else if (authData.user) {
          await handleSuccessfulLogin(authData.user.id);
        }
      } else {
        const { data, error } = await authService.signUp(trimmedEmail, trimmedPassword);

        if (error) {
          handleSignUpError(error);
        } else if (data.user) {
          await handleSuccessfulSignUp(data.user, trimmedEmail);
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

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    if (error.message.includes("Email not confirmed")) {
      toast({
        variant: "destructive",
        title: "Email Not Confirmed",
        description: "Please check your email and click the confirmation link before logging in. If you can't find the email, check your spam folder.",
      });
    } else if (error.message.includes("Invalid login credentials")) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSignUpError = (error: any) => {
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
  };

  const handleSuccessfulLogin = async (userId: string) => {
    const { data: profileData, error: profileError } = await authService.fetchUserProfile(userId);

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
  };

  const handleSuccessfulSignUp = async (user: any, email: string) => {
    const { error: profileError } = await authService.createProfile(
      user.id,
      email.split('@')[0]
    );

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
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleAuth}
          isLogin={isLogin}
          loading={loading}
          onToggleMode={() => setIsLogin(!isLogin)}
        />
      </DialogContent>
    </Dialog>
  );
}