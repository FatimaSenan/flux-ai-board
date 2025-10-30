import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BarChart3, Users, Wallet, CheckCheckIcon, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold glow-text">MindTrace</span>
          </div>
          <Button 
            variant="outline" 
            className="border-primary/50 hover:bg-primary/10 hover:border-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="px-4 py-2 rounded-full border border-primary/50 text-sm text-primary bg-primary/5 backdrop-blur-sm">
              Next-Gen Project Management
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Smart {" "}
            <span className="glow-text neon-gradient bg-clip-text text-transparent">
              Starts...
            </span>
             {" "} Smarter
            {" "}<span className="glow-text neon-gradient bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MindTrace connects your projects, teams, and data through intelligent dashboards — giving you real-time insights, 
            change tracking, and an AI assistant that truly understands your work.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-border hover-glow group"
              onClick={() => navigate('/login')}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="glass-card p-6 rounded-xl hover-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track project performance with live dashboards and insights
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl hover-glow transition-all duration-300" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Task Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor progress, deadlines, and team performance — all in one intuitive dashboard.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl hover-glow transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Financial Clarity</h3>
              <p className="text-sm text-muted-foreground">
                Gain full control over costs and billing with real-time dashboards and automated reports.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
