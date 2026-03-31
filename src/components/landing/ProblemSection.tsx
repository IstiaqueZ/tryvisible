import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingDown, Bot } from "lucide-react";
import { useRef } from "react";

const stats = [
  { value: "60%", label: "of clicks replaced by AI summaries" },
  { value: "40%", label: "zero-click search rate" },
  { value: "3x", label: "faster growth in AI-based discovery" },
];

const ProblemSection = () => {
  const [ref, controls] = useScrollAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section className="relative bg-secondary py-20 md:py-28 overflow-hidden" ref={sectionRef}>
      {/* Parallax background pattern */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
      >
        <div className="h-full w-full" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, hsl(var(--primary)) 60px, hsl(var(--primary)) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, hsl(var(--primary)) 60px, hsl(var(--primary)) 61px)`,
        }} />
      </motion.div>

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container relative mx-auto px-6"
      >
        <motion.h2
          variants={fadeUpVariants}
          className="text-center font-display text-3xl font-bold text-secondary-foreground md:text-5xl"
        >
          Traditional SEO is Dead.
        </motion.h2>
        <motion.p
          variants={fadeUpVariants}
          className="mx-auto mt-4 max-w-xl text-center text-secondary-foreground/60"
        >
          The rules have changed. AI is answering your customers before Google can.
        </motion.p>

        {/* Stats row */}
        <motion.div
          variants={fadeUpVariants}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="font-display text-3xl font-bold text-primary md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs text-secondary-foreground/60 md:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <motion.div
            variants={fadeUpVariants}
            className="group relative border border-secondary-foreground/10 bg-secondary p-10 transition-all duration-500 hover:border-destructive/30"
          >
            <div className="absolute -top-px left-0 h-[2px] w-0 bg-destructive transition-all duration-500 group-hover:w-full" />
            <TrendingDown className="h-10 w-10 text-destructive" strokeWidth={1.5} />
            <h3 className="mt-6 font-display text-2xl font-bold text-secondary-foreground">
              Google Traffic is Falling
            </h3>
            <div className="mt-6 space-y-3">
              {[
                "AI summaries replace 60% of clicks",
                "Zero-click searches at all-time high",
                "Organic traffic declining quarter over quarter",
                "Traditional SEO tools can't track AI citations",
              ].map((line) => (
                <p key={line} className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-destructive" />
                  {line}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="group relative border border-primary/20 bg-secondary p-10 transition-all duration-500 hover:border-primary/50"
          >
            <div className="absolute -top-px left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            <Bot className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <h3 className="mt-6 font-display text-2xl font-bold text-secondary-foreground">
              AI Is the New Search
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/70">
              When a customer asks ChatGPT, Perplexity, or Gemini for a
              recommendation, the AI pulls from a citation feed — not from
              Google's index.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/70">
              If you are not in that feed,{" "}
              <span className="font-semibold text-primary">
                you are invisible
              </span>{" "}
              to the next generation of buyers.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
