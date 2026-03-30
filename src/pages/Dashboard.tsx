import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  Search,
  BarChart3,
  ListChecks,
  Plus,
  FolderOpen,
  AlertTriangle,
  LogOut,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [todoCount, setTodoCount] = useState(0);
  const [monitorCount, setMonitorCount] = useState(0);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [projectsRes, subRes, todoRes, monitorRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("todo_items").select("id", { count: "exact" }).eq("is_completed", false),
      supabase.from("ai_monitor_keywords").select("id", { count: "exact" }).eq("is_active", true),
    ]);
    setProjects(projectsRes.data || []);
    setSubscription(subRes.data);
    setTodoCount(todoRes.count || 0);
    setMonitorCount(monitorRes.count || 0);
    setLoading(false);
  };

  const handleAddProject = async () => {
    if (!newProjectName || !newProjectDomain) return;
    await supabase.from("projects").insert({
      user_id: user!.id,
      name: newProjectName,
      domain: newProjectDomain,
    });
    setNewProjectName("");
    setNewProjectDomain("");
    setDialogOpen(false);
    fetchData();
  };

  const stats = [
    {
      label: "Keyword Credits",
      value: subscription?.keyword_credits ?? "—",
      icon: Search,
      alert: subscription && subscription.keyword_credits === 0,
    },
    {
      label: "Deep Audit Credits",
      value: subscription?.deep_audit_credits ?? "—",
      icon: BarChart3,
      alert: subscription && subscription.deep_audit_credits === 0,
    },
    { label: "Total Projects", value: projects.length, icon: FolderOpen },
    { label: "Monitored Keywords", value: monitorCount, icon: Eye },
    { label: "Pending To-Do", value: todoCount, icon: ListChecks },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Eye className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold">Visible</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:inline">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* No subscription alert */}
        {!subscription && (
          <div className="mb-6 flex items-center gap-3 border border-primary/50 bg-primary/10 p-4">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">You don't have an active subscription.</span>
            <Button size="sm" onClick={() => navigate("/pricing")} className="ml-auto">
              Choose a Plan
            </Button>
          </div>
        )}

        {/* Zero credits alert */}
        {subscription && (subscription.keyword_credits === 0 || subscription.deep_audit_credits === 0) && (
          <div className="mb-6 flex items-center gap-3 border border-destructive/50 bg-destructive/10 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-medium">
              You have 0 {subscription.keyword_credits === 0 ? "keyword" : "deep audit"} credits remaining. Upgrade to continue.
            </span>
            <Button size="sm" variant="destructive" onClick={() => navigate("/pricing")} className="ml-auto">
              Upgrade
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.label} className={`${stat.alert ? "border-destructive" : ""}`}>
              <CardContent className="flex flex-col items-center p-4 text-center">
                <stat.icon className={`h-6 w-6 ${stat.alert ? "text-destructive" : "text-primary"}`} />
                <span className="mt-2 font-display text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Your Projects</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> Add Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Name</label>
                    <Input
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="My Website"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Domain</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={newProjectDomain}
                        onChange={(e) => setNewProjectDomain(e.target.value)}
                        placeholder="example.com"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddProject} className="w-full" disabled={!newProjectName || !newProjectDomain}>
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-display text-lg font-semibold">No projects yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Add your first project to start tracking AI visibility</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" /> {project.domain}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
