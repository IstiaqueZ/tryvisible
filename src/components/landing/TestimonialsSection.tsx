import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, Quote } from "lucide-react";

import reviewerAowal from "@/assets/reviewer-aowal.jpg";
import reviewerTahmidur from "@/assets/reviewer-tahmidur.jpg";
import reviewerTamjid from "@/assets/reviewer-tamjid.jpg";

const testimonials = [
  {
    name: "Mohammed Abdul Aowal",
    role: "Owner",
    company: "SPCH Handyman Service",
    image: reviewerAowal,
    quote:
      "Before Visible, we had no idea if AI was recommending us to potential customers. Within a week, we found out our competitors were dominating ChatGPT results for 'handyman service near me.' Now we're the top citation.",
    stars: 5,
  },
  {
    name: "Tahmidur Rahman",
    role: "Partner",
    company: "TRW Law Firm",
    image: reviewerTahmidur,
    quote:
      "As a law firm, trust and authority matter. Visible showed us exactly how AI models were describing our practice — and more importantly, where we were invisible. The deep audit insights were game-changing for our digital strategy.",
    stars: 5,
  },
  {
    name: "Al Shohab Tamjid",
    role: "CMO",
    company: "Olio - AI Product Photography",
    image: reviewerTamjid,
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
          <p className="mx-auto mt-4 max-w-lg text-secondary-foreground/60">
            See how companies are winning the AI recommendation layer with Visible.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUpVariants}
              className="group relative flex flex-col border-2 border-secondary-foreground/10 bg-secondary p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_8px_40px_hsl(146_75%_51%/0.15)]"
            >
              {/* Glow accent top */}
              <div className="absolute -top-px left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />

              {/* Quote icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <p className="flex-1 text-sm leading-relaxed text-secondary-foreground/80">
                "{t.quote}"
              </p>

              {/* Reviewer with photo */}
              <div className="mt-8 flex items-center gap-4 border-t border-secondary-foreground/10 pt-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 object-cover border-2 border-primary/30"
                />
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
