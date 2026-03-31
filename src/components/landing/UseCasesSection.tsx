import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Building2, Rocket, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const useCases = [
  {
    id: "local",
    icon: MapPin,
    title: "Local Businesses",
    tagline: "Own your neighbourhood in AI.",
    description:
      'Dominate local AI searches and capture high-intent customers before your competitors. When someone asks "best dentist near me" to ChatGPT, make sure you are the answer.',
    features: [
      "Local citation tracking",
      "High-intent keyword monitoring",
      "Competitor displacement alerts",
    ],
  },
  {
    id: "agency",
    icon: Building2,
    title: "Marketing Agencies",
    tagline: "AEO as a premium service line.",
    description:
      "Offer AEO as a premium service to your clients. White-label PDF reporting, multi-client dashboards, and the data to prove ROI on AI visibility.",
    features: [
      "White-label reporting",
      "Multi-client management",
      "Prove AI visibility ROI",
    ],
  },
  {
    id: "saas",
    icon: Rocket,
    title: "SaaS & Startups",
    tagline: "Win the AI recommendation layer.",
    description:
      "Own the AI recommendation layer for your category. When prospects ask AI which tool to use, make sure your product is cited with authority and credibility.",
    features: [
      "Category keyword dominance",
      "Competitor citation analysis",
      "Product positioning insights",
    ],
  },
];

const UseCasesSection = () => {
  const [ref, controls] = useScrollAnimation();
  const [active, setActive] = useState("local");
  const navigate = useNavigate();
  const current = useCases.find((u) => u.id === active)!;

  return (
    <section id="use-cases" className="bg-muted/30 py-20 md:py-28">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6"
      >
        <motion.div variants={fadeUpVariants} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Use Cases
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-secondary md:text-5xl">
            Built for every business type.
          </h2>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          variants={fadeUpVariants}
          className="mx-auto mt-12 flex max-w-xl flex-col gap-2 sm:flex-row sm:gap-0 sm:border-2 sm:border-secondary"
        >
          {useCases.map((uc) => (
            <button
              key={uc.id}
              onClick={() => setActive(uc.id)}
              className={`flex flex-1 items-center justify-center gap-2 border-2 sm:border-0 px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                active === uc.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-background text-secondary hover:bg-muted"
              }`}
            >
              <uc.icon className="h-4 w-4" />
              {uc.title}
            </button>
          ))}
        </motion.div>

        {/* Active panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
            className="mx-auto mt-10 max-w-4xl border-2 border-secondary bg-background p-8 md:p-12"
          >
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <div className="flex-1">
                <div className="mb-2 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <current.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-secondary">
                  {current.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">{current.tagline}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{current.description}</p>

                <button
                  onClick={() => navigate("/auth")}
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="shrink-0 md:w-64">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Key Features
                </p>
                <ul className="space-y-3">
                  {current.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-secondary">
                      <span className="h-1.5 w-1.5 bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default UseCasesSection;
