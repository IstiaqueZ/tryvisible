import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Search, FileSearch, Activity } from "lucide-react";

const pillars = [
  {
    icon: Search,
    title: "Keyword Analysis",
    subtitle: "The API",
    description:
      "Weekly automated monitoring of your profitable terms across LLMs. Historical trendline charts. Share of Model visibility score.",
    features: ["Multi-LLM querying", "Historical trends", "Visibility scoring"],
  },
  {
    icon: FileSearch,
    title: "Deep Research",
    subtitle: "The Autopsy",
    description:
      "We reverse-engineer the citation feed. See exactly which Reddit posts, directories, or PR articles your competitor used to hijack the AI's recommendation.",
    features: ["Citation analysis", "Competitor intel", "Source mapping"],
  },
  {
    icon: Activity,
    title: "AI Monitoring",
    subtitle: "The Radar",
    description:
      "Continuous automated tracking of your brand presence across all major LLMs. Get alerted when your visibility changes or competitors overtake you.",
    features: ["Real-time alerts", "Multi-model tracking", "Anomaly detection"],
  },
];

const PillarsSection = () => {
  const [ref, controls] = useScrollAnimation();

  return (
    <section id="features" className="bg-muted/30 py-20 md:py-28">
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
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={fadeUpVariants}
              className="group border-2 border-secondary bg-background p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_hsl(146_75%_51%/0.15)]"
            >
              <pillar.icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
                {pillar.subtitle}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-secondary">
                {pillar.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
              <ul className="mt-5 space-y-2">
                {pillar.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-secondary">
                    <span className="h-1.5 w-1.5 bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PillarsSection;
