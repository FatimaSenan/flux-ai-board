import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app, validate credentials
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/projects");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background animate-gradient bg-[length:200%_200%]" />
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      
      <Card className="w-full max-w-md glass-card shadow-[var(--shadow-card)] relative z-10 border-border/50 backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary bg-[length:200%_200%] flex items-center justify-center animate-gradient shadow-[var(--shadow-glow)]">
            <Bot className="w-10 h-10 text-primary-foreground animate-pulse" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold gradient-text">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Enter your credentials to access your dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/30 border-border/50 focus:border-primary transition-all h-12 text-base backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted/30 border-border/50 focus:border-primary transition-all h-12 text-base backdrop-blur-sm"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-[1.02] transition-all text-primary-foreground font-semibold text-base shadow-[var(--shadow-glow)]"
            >
              Sign In to Dashboard
            </Button>

            <div className="text-center">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to home
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
