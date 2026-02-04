import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/services/aiService";
import { mockUsers } from "@/data/mockUsers";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try real API first
      const data = await loginUser({ email, password });

      localStorage.setItem("userId", data.id.toString());
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", `${data.firstname} ${data.lastname}`);

      toast({
        title: `Welcome back, ${data.firstname}!`,
        description: "You've successfully logged in.",
      });

      navigate("/projects");
    } catch (err) {
      // Fallback to mock authentication for preview/demo
      const mockUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (mockUser) {
        localStorage.setItem("userId", mockUser.email);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", mockUser.email);
        localStorage.setItem("userName", mockUser.name);

        toast({
          title: `Welcome back, ${mockUser.name}!`,
          description: "You've successfully logged in (demo mode).",
        });

        navigate("/projects");
      } else {
        console.error("Login failed:", err);
        setError("Invalid email or password");
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card p-8 rounded-2xl space-y-6 animate-scale-in">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-6">
              <img 
              src="/m.png"
              alt="MindTrace Logo" 
              className="w-16 h-16 animate-logo-glow"
            />
            </div>
            <h1 className="text-3xl font-bold glow-text">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-primary/30 focus:border-primary focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50 border-primary/30 focus:border-primary focus:ring-primary/20 transition-all"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-border hover-glow"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="text-center text-xs text-muted-foreground border-t border-border/50 pt-4">
            <p>Demo: demo@test.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
