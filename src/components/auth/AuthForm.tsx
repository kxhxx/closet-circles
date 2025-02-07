import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLogin: boolean;
  loading: boolean;
  onToggleMode: () => void;
}

export function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isLogin,
  loading,
  onToggleMode,
}: AuthFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          onClick={onToggleMode}
          className="text-sm text-gray-600 hover:underline"
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Log in"
          }
        </button>
      </div>
    </form>
  );
}