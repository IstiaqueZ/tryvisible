import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-secondary bg-background">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Logo variant="light" className="h-7" />

        <div className="hidden items-center gap-8 md:flex">
          {["Features", "Pricing", "Use Cases"].map((label) => (
            <button
              key={label}
              onClick={() => scrollTo(label.toLowerCase().replace(" ", "-"))}
              className="text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => navigate("/contact")}
            className="text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="font-semibold">
              Dashboard
            </Button>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary"
              >
                Log In
              </button>
              <Button
                onClick={() => navigate("/auth")}
                className="group h-10 border-2 border-primary bg-primary font-semibold text-secondary hover:bg-primary/90"
              >
                Get AEO Access
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
