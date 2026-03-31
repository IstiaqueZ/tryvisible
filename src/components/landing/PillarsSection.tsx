import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Search, FileSearch, Activity, Radar, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import featureKeywordResearch from "@/assets/feature-keyword-research.png";
import featureDeepAudit from "@/assets/feature-deep-audit.png";
import featureAiMonitor from "@/assets/feature-ai-monitor.png";
import featureTodoList from "@/assets/feature-todo-list.png";

const PillarsSection = () => {
  const [ref, controls] = useScrollAnimation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  const deepResearchPoints = [
    "Top citations & source breakdown",
    "Pros / Cons analysis of your brand",
    "Competitor strategy reverse-engineering",
    "Actionable to-do list for improvements",
    "Reddit, directories & PR article tracking",
  ];

  return (
    <section id="features" className="bg-muted/30 py-20 md:py-28" ref={scrollRef}>
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6"
      >
        <motion.div variants={fadeUpVariants} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            The Solution
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-secondary md:text-5xl">
            Google Search Console for AI.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Four powerful tools working together to dominate the AI answer layer.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="mt-16 grid gap-4 md:grid-cols-12 md:auto-rows-auto">
          {/* Card 1 — Keyword Research (top-left, 7 cols) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative flex flex-col overflow-hidden border-2 border-secondary bg-background md:col-span-7 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">The API</p>
                  <h3 className="font-display text-xl font-bold text-secondary">Keyword Analysis</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Multi-LLM querying across ChatGPT, Gemini & Perplexity. Historical trendlines.
                Share of Model visibility scoring. All from a single search.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="group/btn mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Get Started <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
            <motion.div
              style={{ y: parallaxY }}
              className="px-4 pb-4"
            >
              <img
                src={featureKeywordResearch}
                alt="Keyword Research interface showing multi-LLM results"
                className="w-full rounded-sm border border-border transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Card 2 — Deep Research (tall right, 5 cols, spans 2 rows) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative flex flex-col overflow-hidden border-2 border-secondary bg-background md:col-span-5 md:row-span-2 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                  <FileSearch className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">The Autopsy</p>
                  <h3 className="font-display text-xl font-bold text-secondary">Deep Research</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Reverse-engineer the citation feed. See exactly how AI models
                form their recommendations about your brand.
              </p>
              <ul className="space-y-2 mb-4">
                {deepResearchPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/auth")}
                className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Get Started <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
            <div className="mt-auto px-4 pb-4">
              <img
                src={featureDeepAudit}
                alt="Deep Audit results with strengths and weaknesses"
                className="w-full rounded-sm border border-border transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Card 3 — AI Monitor (bottom-left, 3.5 cols) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative flex flex-col overflow-hidden border-2 border-secondary bg-background md:col-span-4 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">The Radar</p>
                  <h3 className="font-display text-lg font-bold text-secondary">AI Monitoring</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automated weekly tracking across all major LLMs with real-time alerts.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="group/btn mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Get Started <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
            <div className="mt-auto px-4 pb-4">
              <img
                src={featureAiMonitor}
                alt="AI Monitor with trend charts"
                className="w-full rounded-sm border border-border transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Card 4 — Action Items (bottom-right, 3.5 cols — equal to card 3) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative flex flex-col overflow-hidden border-2 border-secondary bg-background md:col-span-3 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                  <Radar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">The Playbook</p>
                  <h3 className="font-display text-lg font-bold text-secondary">Action Items</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-generated improvement suggestions auto-populate your to-do list with prioritized actions.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="group/btn mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Get Started <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
            <div className="mt-auto px-4 pb-4">
              <img
                src={featureTodoList}
                alt="AI-generated to-do list"
                className="w-full rounded-sm border border-border transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PillarsSection;
