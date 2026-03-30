import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Search,
  BarChart3,
  ListChecks,
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Radar,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";

type Tab = "research" | "monitor" | "todo";

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("research");
  const [keywords, setKeywords] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [monitorKeywords, setMonitorKeywords] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    if (user && projectId) fetchProjectData();
  }, [user, projectId]);

  const fetchProjectData = async () => {
    setLoading(true);
    const [projectRes, keywordsRes, todosRes, monitorRes] = await Promise.all([
      supabase.from("projects").select("*").eq("id", projectId!).single(),
      supabase.from("keyword_researches").select("*").eq("project_id", projectId!).order("created_at", { ascending: false }),
      supabase.from("todo_items").select("*").eq("project_id", projectId!).order("created_at", { ascending: false }),
      supabase.from("ai_monitor_keywords").select("*").eq("project_id", projectId!).order("created_at", { ascending: false }),
    ]);
    setProject(projectRes.data);
    setKeywords(keywordsRes.data || []);
    setTodos(todosRes.data || []);
    setMonitorKeywords(monitorRes.data || []);
    setLoading(false);
  };

  const [researching, setResearching] = useState(false);
  const [deepAuditLoading, setDeepAuditLoading] = useState<string | null>(null);
  const [deepAuditResult, setDeepAuditResult] = useState<any>(null);
  const [deepAuditOpen, setDeepAuditOpen] = useState(false);

  const handleKeywordResearch = async () => {
    if (!newKeyword || researching) return;
    setResearching(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/keyword-research`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ project_id: projectId, keyword: newKeyword }),
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setNewKeyword("");
        fetchProjectData();
      }
    } catch (err) {
      console.error("Keyword research failed:", err);
      alert("Research failed. Please try again.");
    } finally {
      setResearching(false);
    }
  };

  const handleDeepAudit = async (keywordResearchId: string) => {
    setDeepAuditLoading(keywordResearchId);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/deep-audit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ keyword_research_id: keywordResearchId, project_id: projectId }),
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setDeepAuditResult(data);
        setDeepAuditOpen(true);
      }
    } catch (err) {
      console.error("Deep audit failed:", err);
      alert("Deep audit failed. Please try again.");
    } finally {
      setDeepAuditLoading(null);
    }
  };

  const addSuggestionToTodo = async (suggestion: any) => {
    // Check if this suggestion was already added
    const alreadyExists = todos.some(
      (t) => t.title === suggestion.action && t.source_audit_id === deepAuditResult?.id
    );
    if (alreadyExists) {
      return;
    }
    await supabase.from("todo_items").insert({
      project_id: projectId!,
      user_id: user!.id,
      title: suggestion.action,
      description: `[${suggestion.category}] Priority: ${suggestion.priority} — ${suggestion.impact}`,
      source_audit_id: deepAuditResult?.id,
    });
    fetchProjectData();
  };

  const addToMonitor = async (keyword: string) => {
    const existing = monitorKeywords.find((mk) => mk.keyword === keyword);
    if (existing) {
      alert("This keyword is already being monitored.");
      return;
    }
    await supabase.from("ai_monitor_keywords").insert({
      project_id: projectId!,
      keyword,
    });
    fetchProjectData();
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    await supabase.from("todo_items").update({ is_completed: !currentStatus }).eq("id", id);
    fetchProjectData();
  };

  const addTodo = async () => {
    if (!newTodoTitle) return;
    await supabase.from("todo_items").insert({
      project_id: projectId!,
      user_id: user!.id,
      title: newTodoTitle,
    });
    setNewTodoTitle("");
    fetchProjectData();
  };

  const filteredKeywords = keywords.filter((k) =>
    k.keyword.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const sidebarItems = [
    { id: "research" as Tab, label: "Keyword Research", icon: Search },
    { id: "monitor" as Tab, label: "AI Monitor", icon: Radar },
    { id: "todo" as Tab, label: "To-Do List", icon: ListChecks },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground hidden md:block">
        <div className="flex items-center gap-2 border-b border-sidebar-border p-4">
          <Eye className="h-6 w-6 text-sidebar-primary" />
          <span className="font-display text-lg font-bold">Visible</span>
        </div>
        <div className="p-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="mb-4">
            <h3 className="font-display text-sm font-semibold truncate">{project?.name}</h3>
            <p className="text-xs text-sidebar-foreground/50 truncate">{project?.domain}</p>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="border-b border-border bg-card p-4 md:hidden">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="font-display text-lg font-bold mt-2">{project?.name}</h2>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={activeTab === item.id ? "default" : "outline"}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4 mr-1" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Keyword Research Tab */}
          {activeTab === "research" && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Keyword Research</h2>
              <div className="flex gap-3 mb-6">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Enter a keyword to research..."
                  className="max-w-md"
                  onKeyDown={(e) => e.key === "Enter" && handleKeywordResearch()}
                />
                <Button onClick={handleKeywordResearch} disabled={!newKeyword || researching}>
                  {researching ? (
                    <span className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <><Search className="h-4 w-4 mr-1" /> Research</>
                  )}
                </Button>
              </div>

              {/* Filter */}
              <div className="mb-4">
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search keywords..."
                  className="max-w-xs"
                />
              </div>

              {/* Results Table */}
              {filteredKeywords.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-display text-lg font-semibold">No keyword research yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">Enter a keyword above to start your first AI visibility check</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Visible</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKeywords.map((kw) => (
                        <>
                          <TableRow
                            key={kw.id}
                            className="cursor-pointer hover:bg-muted/30"
                            onClick={() => setExpandedRow(expandedRow === kw.id ? null : kw.id)}
                          >
                            <TableCell>
                              {expandedRow === kw.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{kw.keyword}</TableCell>
                            <TableCell>
                              {kw.is_cited ? (
                                <Badge className="bg-primary/20 text-primary border-0">Yes</Badge>
                              ) : (
                                <Badge variant="destructive" className="border-0">No</Badge>
                              )}
                            </TableCell>
                            <TableCell>{kw.avg_quality_score}%</TableCell>
                            <TableCell>{kw.avg_visibility_score}%</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">{kw.sentiment}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={deepAuditLoading === kw.id}
                                onClick={(e) => { e.stopPropagation(); handleDeepAudit(kw.id); }}
                              >
                                {deepAuditLoading === kw.id ? (
                                  <span className="flex items-center gap-1">
                                    <div className="h-3 w-3 border-2 border-foreground border-t-transparent animate-spin" />
                                    Auditing...
                                  </span>
                                ) : (
                                  <><BarChart3 className="h-3.5 w-3.5 mr-1" /> Deep Research</>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedRow === kw.id && (
                            <TableRow key={`${kw.id}-expanded`}>
                              <TableCell colSpan={7} className="bg-muted/20 p-4">
                                <div className="grid grid-cols-3 gap-4">
                                  {[
                                    { name: "Gemini", quality: kw.gemini_quality_score, visibility: kw.gemini_visibility_score, cited: kw.gemini_is_cited },
                                    { name: "ChatGPT", quality: kw.openai_quality_score, visibility: kw.openai_visibility_score, cited: kw.openai_is_cited },
                                    { name: "Perplexity", quality: kw.perplexity_quality_score, visibility: kw.perplexity_visibility_score, cited: kw.perplexity_is_cited },
                                  ].map((ai) => (
                                    <div key={ai.name} className="border border-border bg-card p-4">
                                      <h4 className="font-display font-semibold text-sm mb-2">{ai.name}</h4>
                                      <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Quality</span>
                                          <span className="font-medium">{ai.quality}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Visibility</span>
                                          <span className="font-medium">{ai.visibility}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-muted-foreground">Cited</span>
                                          {ai.cited ? (
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                          ) : (
                                            <XCircle className="h-4 w-4 text-destructive" />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 flex justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => { e.stopPropagation(); addToMonitor(kw.keyword); }}
                                  >
                                    <Radar className="h-3.5 w-3.5 mr-1" /> Add to Monitor
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* AI Monitor Tab */}
          {activeTab === "monitor" && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">AI Monitor</h2>
              {monitorKeywords.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <Radar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-display text-lg font-semibold">No monitored keywords</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add keywords from your research to monitor their AI visibility over time</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {monitorKeywords.map((mk) => (
                    <Card key={mk.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <span className="font-medium">{mk.keyword}</span>
                          <p className="text-xs text-muted-foreground mt-1">
                            Next run: {new Date(mk.next_run_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={mk.is_active ? "default" : "outline"}>
                          {mk.is_active ? "Active" : "Paused"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* To-Do Tab */}
          {activeTab === "todo" && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">To-Do List</h2>
              <div className="flex gap-3 mb-6">
                <Input
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="Add a new to-do item..."
                  className="max-w-md"
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <Button onClick={addTodo} disabled={!newTodoTitle}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {todos.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-display text-lg font-semibold">No to-do items</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add items manually or from Deep Research suggestions</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-3 border border-border p-4 transition-all ${
                        todo.is_completed ? "opacity-50" : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleTodo(todo.id, todo.is_completed)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                          todo.is_completed ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {todo.is_completed && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                      </button>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${todo.is_completed ? "line-through" : ""}`}>
                          {todo.title}
                        </span>
                        {todo.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{todo.description}</p>
                        )}
                      </div>
                      {todo.source_audit_id && (
                        <Badge variant="outline" className="text-xs">From Audit</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Deep Audit Modal */}
      <Dialog open={deepAuditOpen} onOpenChange={setDeepAuditOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="font-display">Deep Audit Results</DialogTitle>
          </DialogHeader>
          {deepAuditResult && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-primary">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {(deepAuditResult.pros_cons?.pros || []).map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-destructive">Weaknesses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {(deepAuditResult.pros_cons?.cons || []).map((c: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Competitor Analysis */}
                {deepAuditResult.competitor_analysis?.summary && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Competitor Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {deepAuditResult.competitor_analysis.summary}
                    </CardContent>
                  </Card>
                )}

                {/* Top Competitors */}
                {(deepAuditResult.top_competitors || []).length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Top Competitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {deepAuditResult.top_competitors.map((c: any, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm border-b border-border pb-2 last:border-0">
                            <span className="font-medium text-foreground">{c.name}</span>
                            <span className="text-muted-foreground">— {c.why_mentioned}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Improvement Suggestions */}
                {(deepAuditResult.improvement_suggestions || []).length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {deepAuditResult.improvement_suggestions.map((s: any, i: number) => (
                          <div key={i} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">{s.category}</Badge>
                                <Badge
                                  className={`text-xs border-0 ${
                                    s.priority === "high"
                                      ? "bg-destructive/20 text-destructive"
                                      : s.priority === "medium"
                                      ? "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {s.priority}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">{s.action}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{s.impact}</p>
                            </div>
                            {todos.some(
                              (t) => t.title === s.action && t.source_audit_id === deepAuditResult?.id
                            ) ? (
                              <Button size="sm" variant="outline" disabled className="opacity-50">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Added
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addSuggestionToTodo(s)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" /> To-Do
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDashboard;
