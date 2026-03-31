import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-6">
        <h1 className="font-display text-7xl font-bold text-secondary">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
        <Button
          onClick={() => navigate("/")}
          className="mt-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
