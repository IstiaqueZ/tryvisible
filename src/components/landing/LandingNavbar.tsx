import { useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "Pricing", id: "pricing" },
    { label: "Use Cases", id: "use-cases" },
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (window.location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-secondary bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate("/")}>
          <Logo variant="light" className="h-7" />
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary"
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://blog.tryvisible.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary"
          >
            Blog
          </a>
          <button
            onClick={() => navigate("/contact")}
            className="text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="font-semibold">
              Dashboard
            </Button>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="hidden text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary sm:block"
              >
                Log In
              </button>
              <Button
                onClick={() => navigate("/auth")}
                className="group h-10 border-2 border-primary bg-primary font-semibold text-secondary hover:bg-primary/90"
              >
                <span className="hidden sm:inline">Get AEO Access</span>
                <span className="sm:hidden">Sign Up</span>
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-1 md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6 text-secondary" /> : <Menu className="h-6 w-6 text-secondary" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.id)}
                className="py-2 text-left text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://blog.tryvisible.app"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              Blog
            </a>
            <button
              onClick={() => { navigate("/contact"); setMenuOpen(false); }}
              className="py-2 text-left text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              Contact
            </button>
            {!user && (
              <button
                onClick={() => { navigate("/auth"); setMenuOpen(false); }}
                className="py-2 text-left text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
