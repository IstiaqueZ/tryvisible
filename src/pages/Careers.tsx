import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const Careers = () => (
  <div className="min-h-screen bg-background text-secondary">
    <LandingNavbar />
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h1 className="font-display text-4xl font-bold text-secondary md:text-5xl">Careers</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          We're building the future of AI visibility. Join a fast-moving team working at the intersection of AI, search, and competitive intelligence.
        </p>
        <div className="mt-12 border-2 border-secondary bg-muted/20 p-8">
          <h3 className="font-display text-xl font-bold text-secondary">No Open Positions</h3>
          <p className="mt-3 text-muted-foreground">
            We don't have any open roles right now, but we're always looking for exceptional people. Send your CV to <span className="font-semibold text-primary">careers@tryvisible.com</span> and we'll keep you in mind.
          </p>
        </div>
      </div>
    </section>
    <LandingFooter />
  </div>
);

export default Careers;
