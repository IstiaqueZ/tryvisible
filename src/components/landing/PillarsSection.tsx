import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Search, FileSearch, Activity, Radar } from "lucide-react";
import { useRef } from "react";

import featureKeywordResearch from "@/assets/feature-keyword-research.png";
import featureDeepAudit from "@/assets/feature-deep-audit.png";
import featureAiMonitor from "@/assets/feature-ai-monitor.png";
import featureTodoList from "@/assets/feature-todo-list.png";

const PillarsSection = () => {
  const [ref, controls] = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

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
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">The Solution</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-secondary md:text-5xl">
            Google Search Console for AI.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Four powerful tools working together to dominate the AI answer layer.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-2">
          {/* Card 1 — Keyword Research (large) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative flex flex-col overflow-hidden border-2 border-secondary bg-background p-8 md:col-span-7 md:row-span-1 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">The API</p>
                  <h3 className="font-display text-xl font-bold text-secondary">Keyword Analysis</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md">
                    Multi-LLM querying across ChatGPT, Gemini & Perplexity. Historical trendlines. Share of Model
                    visibility scoring. All from a single search.
                  </p>
                </div>
              </div>

              {/* Top Right Actions/Stats (The new "Buttons/Icons" area) */}
              <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                <span className="inline-flex items-center rounded-full bg-secondary/5 px-2.5 py-0.5 text-xs font-medium text-secondary border border-secondary/20">
                  Live Tracking
                </span>
                <div className="flex -space-x-2 overflow-hidden">
                  {/* Placeholder for small icons representing models */}
                  <div className="inline-block h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                    GPT
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                    GEM
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                    PPLX
                  </div>
                </div>
              </div>
            </div>

            {/* Extra details or features list */}
            <div className="mb-8 grid grid-cols-2 gap-4 border-t border-border pt-6 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Accuracy</p>
                <p className="text-sm font-semibold">99.2%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Update Frequency</p>
                <p className="text-sm font-semibold">Real-time</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Data Sources</p>
                <p className="text-sm font-semibold">50+ Engines</p>
              </div>
            </div>

            {/* Image at bottom */}
            <motion.div
              style={{ y: parallaxY }}
              className="mt-auto relative overflow-hidden border border-border shadow-lg"
            >
              <img
                src={featureKeywordResearch}
                alt="Keyword Research interface showing multi-LLM results"
                className="w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
            </motion.div>
          </motion.div>

          {/* Card 2 — Deep Research (tall right) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative overflow-hidden border-2 border-secondary bg-background p-8 md:col-span-5 md:row-span-2 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <FileSearch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">The Autopsy</p>
                <h3 className="font-display text-xl font-bold text-secondary">Deep Research</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Reverse-engineer the citation feed. See exactly which Reddit posts, directories, or PR articles your
              competitor used to hijack the AI's recommendation. Get actionable to-do items.
            </p>
            <div className="relative overflow-hidden border border-border shadow-lg">
              <img
                src={featureDeepAudit}
                alt="Deep Audit results with strengths and weaknesses"
                className="w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>
          </motion.div>

          {/* Card 3 — AI Monitor (bottom-left) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative overflow-hidden border-2 border-secondary bg-background p-8 md:col-span-4 md:row-span-1 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">The Radar</p>
                <h3 className="font-display text-xl font-bold text-secondary">AI Monitoring</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Automated weekly tracking across all major LLMs. Real-time alerts on visibility changes and competitor
              movements.
            </p>
            <div className="relative overflow-hidden border border-border shadow-lg">
              <img
                src={featureAiMonitor}
                alt="AI Monitor with trend charts"
                className="w-full object-cover object-top max-h-48 transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
            </div>
          </motion.div>

          {/* Card 4 — Actionable To-Dos (bottom-middle) */}
          <motion.div
            variants={fadeUpVariants}
            className="group relative overflow-hidden border-2 border-secondary bg-background p-8 md:col-span-3 md:row-span-1 transition-all duration-500 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.12)]"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Radar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">The Playbook</p>
                <h3 className="font-display text-xl font-bold text-secondary">Action Items</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              AI-generated improvement suggestions auto-populate your to-do list with prioritized, category-tagged
              actions.
            </p>
            <div className="relative overflow-hidden border border-border shadow-lg">
              <img
                src={featureTodoList}
                alt="AI-generated to-do list"
                className="w-full object-cover object-top max-h-36 transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PillarsSection;
