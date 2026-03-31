import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

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
    <div className="min-h-screen bg-background text-secondary">
      <LandingNavbar />

      <div className="container mx-auto px-6 py-16 max-w-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-display text-3xl font-bold mb-2 text-secondary">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question or feedback? We'd love to hear from you.
        </p>

        <Card className="border-2 border-secondary">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-secondary">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-secondary">Email</label>
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
                <label className="block text-sm font-medium mb-1 text-secondary">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                  maxLength={2000}
                />
              </div>
              <Button type="submit" className="w-full border-2 border-primary bg-primary text-secondary font-semibold hover:bg-primary/90" disabled={sending || !name || !email || !message}>
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

      <LandingFooter />
    </div>
  );
};

export default Contact;
