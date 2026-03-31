import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  CreditCard,
  FolderOpen,
  Search,
  Radar,
  Crown,
  Shield,
} from "lucide-react";

const tierLabels: Record<string, string> = {
  tier_1: "Starter",
  tier_2: "Growth",
  tier_3: "Scale",
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!session) return;
    fetchAdminData();
  }, [session]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase.functions.invoke("admin-data", {
        headers: { Authorization: `Bearer ${session!.access_token}` },
      });
      if (err) throw err;
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Shield className="h-12 w-12 text-destructive mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeSubscriptions = (data?.subscriptions || []).filter(
    (s: any) => s.status === "active"
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo variant="light" className="h-7" />
            <Badge className="bg-destructive/20 text-destructive border-0 text-xs">
              Admin
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Users className="h-6 w-6 text-primary" />
              <span className="mt-2 font-display text-2xl font-bold">{data?.users?.length || 0}</span>
              <span className="text-xs text-muted-foreground">Total Users</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Crown className="h-6 w-6 text-primary" />
              <span className="mt-2 font-display text-2xl font-bold">{activeSubscriptions.length}</span>
              <span className="text-xs text-muted-foreground">Active Subscriptions</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <FolderOpen className="h-6 w-6 text-primary" />
              <span className="mt-2 font-display text-2xl font-bold">{data?.projects?.length || 0}</span>
              <span className="text-xs text-muted-foreground">Total Projects</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <CreditCard className="h-6 w-6 text-primary" />
              <span className="mt-2 font-display text-2xl font-bold">
                {(data?.subscriptions || []).reduce((sum: number, s: any) => sum + (s.keyword_credits || 0), 0)}
              </span>
              <span className="text-xs text-muted-foreground">Total KW Credits</span>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-1.5" /> Users
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              <CreditCard className="h-4 w-4 mr-1.5" /> Subscriptions
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderOpen className="h-4 w-4 mr-1.5" /> Projects
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Users ({data?.users?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Sign In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.users || []).map((u: any) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt="" className="h-7 w-7 rounded-full" />
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                {(u.full_name || u.email || "?")[0].toUpperCase()}
                              </div>
                            )}
                            <span className="text-sm font-medium">{u.full_name || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{u.email}</TableCell>
                        <TableCell>
                          {u.subscription?.status === "active" ? (
                            <Badge className="bg-primary/20 text-primary border-0 text-xs">
                              {tierLabels[u.subscription.plan_tier] || u.subscription.plan_tier}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Free</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{u.project_count}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Subscriptions ({data?.subscriptions?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>KW Credits</TableHead>
                      <TableHead>Audit Credits</TableHead>
                      <TableHead>Period End</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.subscriptions || []).map((s: any) => {
                      const u = (data?.users || []).find((u: any) => u.id === s.user_id);
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="text-sm">{u?.email || s.user_id}</TableCell>
                          <TableCell>
                            <Badge className="bg-primary/20 text-primary border-0 text-xs">
                              {tierLabels[s.plan_tier] || s.plan_tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`border-0 text-xs ${
                                s.status === "active"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-destructive/20 text-destructive"
                              }`}
                            >
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{s.keyword_credits}</TableCell>
                          <TableCell className="text-sm">{s.deep_audit_credits}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {s.current_period_end
                              ? new Date(s.current_period_end).toLocaleDateString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Projects ({data?.projects?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Search className="h-3.5 w-3.5" /> KW Research
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Radar className="h-3.5 w-3.5" /> Monitor KWs
                        </div>
                      </TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.projects || []).map((p: any) => {
                      const owner = (data?.users || []).find((u: any) => u.id === p.user_id);
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="text-sm font-medium">{p.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{p.domain}</TableCell>
                          <TableCell className="text-sm">{owner?.email || p.user_id}</TableCell>
                          <TableCell className="text-sm text-center">{p.keyword_research_count}</TableCell>
                          <TableCell className="text-sm text-center">{p.monitor_keyword_count}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
