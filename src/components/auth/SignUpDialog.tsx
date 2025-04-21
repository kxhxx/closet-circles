
import { useState, useEffect } from "react";
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
import { dialogTransitionVariants } from "@/utils/animation";
import { supabase } from "@/integrations/supabase/client";

interface SignUpDialogProps {
  initialMode?: 'login' | 'signup';
}

export function SignUpDialog({ initialMode = 'login' }: SignUpDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState(initialMode);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCurrentMode(initialMode);
      setEmail("");
      setPassword("");
    }
  };

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
    if (currentMode === 'signup' && passwordError) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: passwordError,
      });
      return;
    }

    setLoading(true);

    try {
      if (currentMode === 'login') {
        console.log("Attempting login with:", { email: trimmedEmail });
        const { data, error } = await authService.signIn(trimmedEmail, trimmedPassword);

        if (error) {
          console.error('Login error:', error);
          handleAuthError(error);
        } else if (data?.user) {
          console.log("Login successful:", data.user);
          await handleSuccessfulLogin(data.user.id);
        } else {
          console.error('Login response missing user data');
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "An unexpected error occurred. Please try again.",
          });
        }
      } else {
        const { data, error } = await authService.signUp(trimmedEmail, trimmedPassword);

        if (error) {
          handleSignUpError(error);
        } else if (data?.user) {
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
      setCurrentMode('login');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSuccessfulLogin = async (userId: string) => {
    try {
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
    } catch (error) {
      console.error('Error in handleSuccessfulLogin:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while logging in.",
      });
    }
  };

  const handleSuccessfulSignUp = async (user: any, email: string) => {
    try {
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
    } catch (error) {
      console.error('Error in handleSuccessfulSignUp:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during sign up.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800 transition-transform hover:scale-105">
          {initialMode === 'login' ? "Log in" : "Sign up"}
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] perspective-1000 transform-preserve-3d ${
        open ? dialogTransitionVariants.animate : dialogTransitionVariants.initial
      }`}>
        <DialogHeader className="transform-preserve-3d">
          <DialogTitle className="transition-transform duration-300">
            {currentMode === 'login' ? "Log in to your account" : "Create an account"}
          </DialogTitle>
          <DialogDescription className="transition-transform duration-300">
            {currentMode === 'login' 
              ? "Enter your email and password to log in. Make sure you've confirmed your email address."
              : "Enter your email and password to create your account. You'll need to confirm your email address before logging in."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="transform-preserve-3d transition-transform duration-300">
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleAuth}
            isLogin={currentMode === 'login'}
            loading={loading}
            onToggleMode={() => {
              const newMode = currentMode === 'login' ? 'signup' : 'login';
              setCurrentMode(newMode);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
