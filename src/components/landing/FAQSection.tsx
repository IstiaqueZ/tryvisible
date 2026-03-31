import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer, useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is Answer Engine Optimization (AEO)?",
    a: "AEO is the practice of optimizing your brand's visibility in AI-generated answers from platforms like ChatGPT, Gemini, Perplexity, and Claude. Instead of ranking on a search results page, AEO ensures your business is cited and recommended when users ask AI assistants questions.",
  },
  {
    q: "How is AEO different from traditional SEO?",
    a: "Traditional SEO focuses on ranking in Google's link-based results. AEO focuses on being cited in AI-generated summaries and answers. AI models pull from different sources — Reddit posts, directories, PR articles — and Visible helps you understand and influence those citations.",
  },
  {
    q: "What LLMs does Visible track?",
    a: "We currently track citations across ChatGPT (OpenAI), Gemini (Google), and Perplexity AI, with DeepSeek and Claude coming soon. Each keyword search checks all supported models simultaneously.",
  },
  {
    q: "How does the AI Monitoring feature work?",
    a: "AI Monitoring lets you set up automated weekly checks on your most important keywords. We'll track your visibility score over time and alert you when there are significant changes or when competitors overtake your citations.",
  },
  {
    q: "Can I use Visible for client work?",
    a: "Absolutely. Our Agency plan is built for marketing agencies managing multiple clients. You get 1,000 keyword searches, 200 deep audits, API access, and white-label reporting capabilities.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! You can run a free AI audit directly from our homepage — no account required. Just enter your website and a keyword to see your current AI visibility score across major LLMs.",
  },
];

const FAQSection = () => {
  const [ref, controls] = useScrollAnimation();

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="container mx-auto max-w-3xl px-6"
      >
        <motion.h2
          variants={fadeUpVariants}
          className="text-center font-display text-3xl font-bold text-secondary md:text-5xl"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          variants={fadeUpVariants}
          className="mx-auto mt-4 max-w-lg text-center text-muted-foreground"
        >
          Everything you need to know about Visible and AEO.
        </motion.p>

        <motion.div variants={fadeUpVariants} className="mt-12">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-2 border-secondary bg-background px-6"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-secondary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FAQSection;
