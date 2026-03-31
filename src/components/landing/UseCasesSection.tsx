import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Building2 } from "lucide-react";

const UseCasesSection = () => {
  const [ref, controls] = useScrollAnimation();

  return (
    <section id="use-cases" className="border-t-2 border-secondary bg-background py-20 md:py-28">
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
          Who Uses Visible?
        </motion.h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <motion.div
            variants={fadeUpVariants}
            className="group border-2 border-secondary bg-background p-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_hsl(146_75%_51%/0.15)]"
          >
            <MapPin className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <h3 className="mt-6 font-display text-2xl font-bold text-secondary">
              For Local Businesses
            </h3>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
              Dominate local AI searches and capture high-intent customers before your competitors do. When someone asks "best dentist near me" to ChatGPT, make sure <span className="font-semibold text-secondary">you</span> are the answer.
            </p>
            <ul className="mt-6 space-y-3">
              {["Local citation tracking", "High-intent keyword monitoring", "Competitor displacement alerts"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-secondary">
                  <span className="h-2 w-2 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="group border-2 border-secondary bg-background p-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_hsl(146_75%_51%/0.15)]"
          >
            <Building2 className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <h3 className="mt-6 font-display text-2xl font-bold text-secondary">
              For Marketing Agencies
            </h3>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
              Offer AEO as a premium service to your clients. White-label PDF reporting, multi-client dashboards, and the data to prove ROI on AI visibility.
            </p>
            <ul className="mt-6 space-y-3">
              {["White-label reporting", "Multi-client management", "AEO as a premium service line"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-secondary">
                  <span className="h-2 w-2 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default UseCasesSection;
