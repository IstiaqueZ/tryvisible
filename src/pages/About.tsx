import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const About = () => (
  <div className="min-h-screen bg-background text-secondary">
    <LandingNavbar />
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h1 className="font-display text-4xl font-bold text-secondary md:text-5xl">About Us</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Visible is the first Answer Engine Optimization (AEO) platform built for a world where AI models — not search engines — drive buying decisions. We help businesses track, analyze, and improve their visibility across ChatGPT, Perplexity, Gemini, Claude, and more.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Founded in 2025, our mission is to ensure no business becomes invisible in the AI era. Our team combines deep expertise in SEO, natural language processing, and competitive intelligence to deliver actionable insights that drive real results.
        </p>
        <h2 className="mt-12 font-display text-2xl font-bold text-secondary">Our Vision</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          We believe the next decade of digital marketing belongs to brands that master the AI recommendation layer. Visible is building the infrastructure to make that possible for every business, from local shops to global enterprises.
        </p>
      </div>
    </section>
    <LandingFooter />
  </div>
);

export default About;
