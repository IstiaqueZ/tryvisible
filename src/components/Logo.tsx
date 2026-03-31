import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

const Logo = ({ variant = "light", className = "h-8" }: LogoProps) => {
  return (
    <img
      src={variant === "dark" ? logoDark : logoLight}
      alt="Visible"
      className={className}
    />
  );
};

export default Logo;
