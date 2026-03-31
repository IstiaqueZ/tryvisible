import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSending(true);
    try {
      const res = await fetch(`mailto:hello@tryvisible.app`, { mode: "no-cors" }).catch(() => null);
      // Use mailto as fallback — open mail client
      window.location.href = `mailto:hello@tryvisible.app?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      toast({
        title: "Opening your email client",
        description: "Your message will be sent via your default email app.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not open email client. Please email us at hello@tryvisible.app",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Eye className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold">Visible</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/pricing")}>Pricing</Button>
            {user ? (
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16 max-w-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question or feedback? We'd love to hear from you.
        </p>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  maxLength={255}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                  maxLength={2000}
                />
              </div>
              <Button type="submit" className="w-full" disabled={sending || !name || !email || !message}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Or email us directly at{" "}
                <a href="mailto:hello@tryvisible.app" className="text-primary hover:underline">
                  hello@tryvisible.app
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Visible. AI Engine Optimization Platform.
        </div>
      </footer>
    </div>
  );
};

export default Contact;
