import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    highlight: false,
    features: [
      "50 Keyword Searches",
      "10 Deep Audits",
      "Global To-Do List",
      "3 LLM Coverage",
      "Email Support",
    ],
  },
  {
    name: "Growth",
    price: "$99",
    period: "/mo",
    highlight: true,
    features: [
      "250 Keyword Searches",
      "50 Deep Audits",
      "Automated Weekly Monitoring",
      "Anomalies Alert",
      "Priority Support",
    ],
  },
  {
    name: "Agency",
    price: "$299",
    period: "/mo",
    highlight: false,
    features: [
      "1,000 Searches",
      "200 Deep Audits",
      "Priority Cron Jobs",
      "API Access",
      "White-label Reports",
    ],
  },
];

const PricingSection = () => {
  const [ref, controls] = useScrollAnimation();
  const navigate = useNavigate();

  return (
    <section id="pricing" className="border-t-2 border-secondary bg-background py-20 md:py-28">
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
          Simple, Outcome-Focused Pricing.
        </motion.h2>
        <motion.p
          variants={fadeUpVariants}
          className="mx-auto mt-4 max-w-lg text-center text-muted-foreground"
        >
          No hidden fees. No per-seat pricing. Just results.
        </motion.p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUpVariants}
              className={`group relative border-2 border-secondary bg-background p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_hsl(146_75%_51%/0.15)] ${
                plan.highlight ? "border-t-4 border-t-primary" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-bold text-secondary">
                  MOST POPULAR
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-secondary">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-secondary">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-secondary">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/auth")}
                className={`mt-8 w-full border-2 font-semibold transition-all duration-200 ${
                  plan.highlight
                    ? "border-primary bg-primary text-secondary hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(146_75%_51%/0.3)]"
                    : "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90"
                }`}
              >
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PricingSection;
