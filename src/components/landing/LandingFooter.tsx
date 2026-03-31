import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Product",
    links: ["Features", "Integrations", "Pricing", "Status", "Download Pixel"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Contact Us", "Request Demo", "Help Center"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "DPA", "Acceptable Use"],
  },
];

const socials = [
  { name: "Twitter (X)", url: "#" },
  { name: "LinkedIn", url: "#" },
  { name: "Reddit", url: "#" },
  { name: "YouTube", url: "#" },
];

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t-2 border-secondary bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="border-2 border-secondary/10 p-6">
              <h4 className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (link === "Pricing") navigate("/pricing");
                        else if (link === "Contact Us") navigate("/contact");
                      }}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Socials */}
          <div className="border-2 border-secondary/10 p-6">
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
          <Logo variant="light" className="h-5" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Visible. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
