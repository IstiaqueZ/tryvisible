import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingDown, Bot } from "lucide-react";

const ProblemSection = () => {
  const [ref, controls] = useScrollAnimation();

  return (
    <section className="bg-secondary py-20 md:py-28">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6"
      >
        <motion.h2
          variants={fadeUpVariants}
          className="text-center font-display text-3xl font-bold text-secondary-foreground md:text-5xl"
        >
          Traditional SEO is Dead.
        </motion.h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <motion.div
            variants={fadeUpVariants}
            className="border-2 border-secondary-foreground/20 bg-secondary p-10"
          >
            <TrendingDown className="h-12 w-12 text-destructive" strokeWidth={1.5} />
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
                <p key={line} className="flex items-start gap-3 text-secondary-foreground/70">
                  <span className="mt-1.5 h-2 w-2 shrink-0 bg-destructive" />
                  {line}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="border-2 border-primary/30 bg-secondary p-10"
          >
            <Bot className="h-12 w-12 text-primary" strokeWidth={1.5} />
            <h3 className="mt-6 font-display text-2xl font-bold text-secondary-foreground">
              AI Is the New Search
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-secondary-foreground/70">
              When a customer asks ChatGPT, Perplexity, or Gemini for a
              recommendation, the AI pulls from a citation feed — not from
              Google's index.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-secondary-foreground/70">
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
