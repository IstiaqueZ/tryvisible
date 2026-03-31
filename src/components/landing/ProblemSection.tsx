import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingDown, AlertTriangle } from "lucide-react";

const ProblemSection = () => {
  const [ref, controls] = useScrollAnimation();

  return (
    <section className="border-t-2 border-secondary bg-background py-20 md:py-28">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6"
      >
        <motion.h2
          variants={fadeUpVariants}
          className="text-center font-display text-3xl font-bold text-secondary md:text-5xl"
        >
          Traditional SEO is Dead.
        </motion.h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Left: Visual */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col items-center justify-center border-2 border-secondary bg-secondary/[0.03] p-10"
          >
            <TrendingDown className="h-20 w-20 text-destructive/70" strokeWidth={1.5} />
            <div className="mt-6 space-y-2 text-center">
              <p className="font-display text-2xl font-bold text-secondary">Google Traffic</p>
              <div className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-semibold">-40% organic clicks since AI Overviews</span>
              </div>
              <div className="mx-auto mt-4 h-1 w-48 bg-secondary/10">
                <div className="h-full w-[60%] bg-destructive/60" />
              </div>
              <div className="mx-auto h-1 w-48 bg-secondary/10">
                <div className="h-full w-[35%] bg-destructive/40" />
              </div>
              <div className="mx-auto h-1 w-48 bg-secondary/10">
                <div className="h-full w-[15%] bg-destructive/30" />
              </div>
            </div>
          </motion.div>

          {/* Right: Copy */}
          <motion.div variants={fadeUpVariants} className="flex flex-col justify-center">
            <h3 className="font-display text-2xl font-bold text-secondary">
              AI Summaries Are Replacing Search Results
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              When a user asks ChatGPT or Perplexity for a recommendation, they get a direct answer — not ten blue links. If your business isn't cited in that AI-generated response, <span className="font-semibold text-secondary">you are invisible to the customer</span>.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              The brands winning today aren't just ranking on Google — they're getting <span className="font-semibold text-secondary">named, cited, and recommended</span> by the AI models that 500M+ people rely on daily.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              This isn't a future trend. It's happening now. And every day you wait, your competitors are locking in their position in the AI answer layer.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
