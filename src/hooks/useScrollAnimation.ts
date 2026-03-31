import { useEffect, useRef } from "react";
import { useInView, useAnimation, type Variants } from "framer-motion";

export function useScrollAnimation(threshold = 0.15): [React.RefObject<HTMLDivElement>, AnimationControls] {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return [ref, controls];
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
