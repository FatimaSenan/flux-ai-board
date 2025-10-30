import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bot, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background animate-gradient bg-[length:200%_200%]" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">AI Monitor</span>
          </div>
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
          >
            Sign In
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">AI-Powered</span>
            <br />
            Project Intelligence
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Monitor your projects in real-time with advanced AI analytics, instant notifications, and intelligent insights
          </p>
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold text-lg px-8 py-6 animate-fade-in group"
            style={{ animationDelay: '0.4s' }}
          >
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-card p-8 rounded-2xl hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Real-Time Updates</h3>
            <p className="text-muted-foreground">
              Get instant notifications about project changes, ticket updates, and team activities
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:shadow-[var(--shadow-glow-secondary)] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
              <Bot className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">AI Assistant</h3>
            <p className="text-muted-foreground">
              Chat with an intelligent assistant that understands your projects and provides insights
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Smart Analytics</h3>
            <p className="text-muted-foreground">
              Track metrics, monitor progress, and make data-driven decisions with AI-powered analytics
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-32 text-center glass-card p-12 rounded-3xl animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <Shield className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-glow" />
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join teams using AI-powered project monitoring to stay ahead
          </p>
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold text-lg px-12 py-6"
          >
            Start Monitoring Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
