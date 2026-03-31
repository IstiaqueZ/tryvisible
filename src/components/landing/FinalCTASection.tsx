import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTASection = () => {
  const [ref, controls] = useScrollAnimation();
  const navigate = useNavigate();

  return (
    <section className="border-t-2 border-secondary bg-secondary py-20 md:py-28">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-6 text-center"
      >
        <motion.h2
          variants={fadeUpVariants}
          className="mx-auto max-w-3xl font-display text-3xl font-bold text-secondary-foreground md:text-5xl"
        >
          Don't let your business become obsolete in the AI era.
        </motion.h2>
        <motion.p
          variants={fadeUpVariants}
          className="mx-auto mt-6 max-w-xl text-lg text-secondary-foreground/70"
        >
          Every day you wait, your competitors are locking in their position in
          the AI answer layer.
        </motion.p>
        <motion.div variants={fadeUpVariants}>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="mt-10 h-14 border-2 border-primary bg-primary px-10 text-lg font-bold text-secondary transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(146_75%_51%/0.4)]"
          >
            Lock in your AEO Rank
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FinalCTASection;
