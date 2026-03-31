import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", path: "/#features" },
      { label: "Use Cases", path: "/use-cases" },
      { label: "Pricing", path: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Contact Us", path: "/contact" },
      { label: "Request Demo", path: "/request-demo" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "DPA", path: "/dpa" },
      { label: "Acceptable Use", path: "/acceptable-use" },
    ],
  },
];

const socials = [
  { name: "Twitter (X)", url: "https://x.com" },
  { name: "LinkedIn", url: "https://linkedin.com" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "YouTube", url: "https://youtube.com" },
];

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t-2 border-secondary bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="p-6">
              <h4 className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Socials */}
          <div className="p-6">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
              Socials
            </h4>
            <ul className="mt-4 space-y-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-secondary/10 py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate("/")}><Logo variant="light" className="h-5" /></button>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Visible. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
