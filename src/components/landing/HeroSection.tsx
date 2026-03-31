import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";

import logoChatGPT from "@/assets/logo-chatgpt.png";
import logoClaude from "@/assets/logo-claude.png";
import logoDeepSeek from "@/assets/logo-deepseek.png";
import logoGemini from "@/assets/logo-gemini.png";
import logoPerplexity from "@/assets/logo-perplexity.png";

const ROTATING_KEYWORDS = [
  "best real estate CRM",
  "dubai lawyer",
  "local plumber",
  "SaaS analytics tool",
  "organic skincare brand",
];

const LLM_LOGOS = [
  { name: "ChatGPT", src: logoChatGPT },
  { name: "Perplexity", src: logoPerplexity },
  { name: "Gemini", src: logoGemini },
  { name: "Claude", src: logoClaude },
  { name: "DeepSeek", src: logoDeepSeek },
  { name: "ChatGPT", src: logoChatGPT },
  { name: "Perplexity", src: logoPerplexity },
  { name: "Gemini", src: logoGemini },
  { name: "Claude", src: logoClaude },
  { name: "DeepSeek", src: logoDeepSeek },
];

const HeroSection = () => {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ref, controls] = useScrollAnimation(0.1);

  useEffect(() => {
    const currentWord = ROTATING_KEYWORDS[placeholderIdx];
    let charIdx = 0;
    setTypedText("");

    const typeInterval = setInterval(() => {
      if (charIdx <= currentWord.length) {
        setTypedText(currentWord.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setPlaceholderIdx((prev) => (prev + 1) % ROTATING_KEYWORDS.length);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [placeholderIdx]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !keyword) return;

    setLoading(true);
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
      if (user) navigate("/dashboard");
      else navigate("/auth");
    } catch {
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            variants={fadeUpVariants}
            className="mb-6 inline-flex items-center gap-2 border-2 border-secondary bg-secondary/5 px-5 py-2 text-sm font-semibold text-secondary"
          >
            Answer Engine Optimization Platform
          </motion.div>

          <motion.h1
            variants={fadeUpVariants}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-secondary md:text-6xl lg:text-7xl"
          >
            Are you visible on{" "}
            <span className="text-primary">ChatGPT</span>?
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Track your AI Share of Model, steal competitors' citations, and
            dominate the Answer Engine Optimization (AEO) era.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.form
          variants={fadeUpVariants}
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-3xl"
        >
          <div className="border-2 border-secondary bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-semibold text-secondary">
                  Your Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="h-12 border-2 border-secondary/20 bg-background pl-10 text-secondary placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-sm font-semibold text-secondary">
                  Your #1 Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={typedText || "best real estate CRM"}
                    className="h-12 border-2 border-secondary/20 bg-background pl-10 text-secondary placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-4 h-12 w-full border-2 border-primary bg-primary text-base font-bold text-secondary transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(146_75%_51%/0.3)]"
              disabled={loading || !domain || !keyword}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-secondary border-t-transparent animate-spin" />
                  Analyzing with AI...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isHovered ? "Check Your Score" : "Run Free AI Audit"}
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </motion.form>

        {/* LLM Logo Scroller */}
        <motion.div variants={fadeUpVariants} className="mt-16">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            Tracking citations across major LLMs:
          </p>
          <div className="relative mx-auto max-w-3xl overflow-hidden">
            <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
            <div className="flex animate-[scroll_25s_linear_infinite] items-center gap-16">
              {LLM_LOGOS.map((logo, i) => (
                <img
                  key={i}
                  src={logo.src}
                  alt={logo.name}
                  className="h-8 w-auto shrink-0 object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
