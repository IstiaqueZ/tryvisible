import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const Blog = () => (
  <div className="min-h-screen bg-background text-secondary">
    <LandingNavbar />
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h1 className="font-display text-4xl font-bold text-secondary md:text-5xl">Blog</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Insights, guides, and updates on Answer Engine Optimization.
        </p>
        <div className="mt-12 border-2 border-secondary bg-muted/20 p-8 text-center">
          <p className="font-display text-xl font-bold text-secondary">Coming Soon</p>
          <p className="mt-2 text-muted-foreground">
            We're working on in-depth articles about AEO strategy, AI visibility trends, and competitive intelligence. Check back soon.
          </p>
        </div>
      </div>
    </section>
    <LandingFooter />
  </div>
);

export default Blog;
