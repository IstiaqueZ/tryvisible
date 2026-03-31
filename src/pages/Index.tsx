import { Eye, Search, Globe, ArrowRight, Zap, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !keyword) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/teaser-check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain, keyword }),
        }
      );
      const data = await res.json();
      if (data.error === "limit_reached") {
        navigate("/auth");
        return;
      }
      if (data.error) throw new Error(data.error);
      setResult({
        visible: data.visible,
        competitor: data.competitors?.[0] || "your competitors",
        improvements: data.improvements_count || 10,
        summary: data.summary,
        remaining: data.remaining_checks,
      });
    } catch (err) {
      console.error("Teaser check failed:", err);
      setResult({
        visible: false,
        competitor: "your competitors",
        improvements: 10,
        summary: "We couldn't complete the check. Try again or sign up for full access.",
        remaining: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartNow = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground">
      {/* Navigation */}
      <nav className="border-b border-sidebar-border">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Eye className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold tracking-tight">Visible</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/pricing")} className="text-secondary-foreground hover:text-primary">
              Pricing
            </Button>
            <Button variant="ghost" onClick={() => navigate("/contact")} className="text-secondary-foreground hover:text-primary">
              Contact
            </Button>
            {user ? (
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-background opacity-50" />
        <div className="container relative mx-auto px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              AI Engine Optimization Platform
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Are you visible on{" "}
              <span className="text-primary">ChatGPT</span>?{" "}
              <span className="text-primary">Gemini</span>?{" "}
              <span className="text-primary">Perplexity</span>?
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Enter your domain and your #1 keyword to find out if AI search engines are recommending you — or your competitors.
            </p>
          </div>

          {/* Teaser Form */}
          <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-2xl">
            <div className="border-2 border-primary/30 bg-card p-6 shadow-lg transition-all focus-within:border-primary focus-within:shadow-[0_0_30px_hsl(146_75%_51%/0.15)]">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-card-foreground">Your Domain</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="example.com"
                      className="h-12 border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-card-foreground">Your #1 Keyword</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g., best CRM software"
                      className="h-12 border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="mt-4 w-full h-12 text-base font-semibold"
                disabled={loading || !domain || !keyword}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Analyzing with AI...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Check My Visibility <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Teaser Result */}
          {result && (
            <div className="mx-auto mt-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-2 border-destructive/50 bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-destructive/10">
                    <Shield className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-card-foreground">
                      AI is recommending {result.competitor} instead of you
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      When users search for "<span className="font-medium text-card-foreground">{keyword}</span>", AI engines are suggesting your competitors. Your business is not visible in AI-powered search results.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary font-semibold">
                      <BarChart3 className="h-5 w-5" />
                      We found {result.improvements}+ improvements to beat your competitors
                    </div>
                    <Button onClick={handleStartNow} size="lg" className="mt-4 font-semibold">
                      Start Now to Unlock All <ArrowRight className="h-5 w-5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-background py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">
            How Visible Works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Keyword Research",
                description: "Query ChatGPT, Gemini, and Perplexity simultaneously. See if your brand is cited, named, or missing entirely.",
              },
              {
                icon: BarChart3,
                title: "Deep Audit",
                description: "Analyze top competitors and citations. Get actionable improvement suggestions to boost your AI visibility.",
              },
              {
                icon: Eye,
                title: "AI Monitor",
                description: "Track your keyword performance over time. Get alerts when your visibility changes across AI engines.",
              },
            ].map((feature) => (
              <div key={feature.title} className="border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-xl font-bold text-card-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Visible. AI Engine Optimization Platform.
        </div>
      </footer>
    </div>
  );
};

export default Index;
