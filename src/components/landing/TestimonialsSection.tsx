import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mohammed Abdul Aowal",
    role: "Owner",
    company: "SPCH Handyman Service",
    quote:
      "Before Visible, we had no idea if AI was recommending us to potential customers. Within a week, we found out our competitors were dominating ChatGPT results for 'handyman service near me.' Now we're the top citation.",
    stars: 5,
  },
  {
    name: "Tahmidur Rahman",
    role: "Partner",
    company: "TRW Law Firm",
    quote:
      "As a law firm, trust and authority matter. Visible showed us exactly how AI models were describing our practice — and more importantly, where we were invisible. The deep audit insights were game-changing for our digital strategy.",
    stars: 5,
  },
  {
    name: "Al Shohab Tamjid",
    role: "CMO",
    company: "Olio - AI Product Photography",
    quote:
      "We're a SaaS in a competitive space. Visible's monitoring alerts us the moment a competitor steals our citation. The keyword research across three LLMs simultaneously saves us hours every week. Essential tool for any SaaS marketer.",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  const [ref, controls] = useScrollAnimation();

  return (
    <section className="bg-secondary py-20 md:py-28 overflow-hidden">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6"
      >
        <motion.div variants={fadeUpVariants} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-secondary-foreground md:text-5xl">
            Trusted by businesses worldwide.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUpVariants}
              className="group relative border border-secondary-foreground/10 bg-secondary p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.1)]"
            >
              {/* Glow accent */}
              <div className="absolute -top-px left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />

              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-secondary-foreground/80 italic">
                "{t.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-primary/20 font-display text-sm font-bold text-primary">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-secondary-foreground/50">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
