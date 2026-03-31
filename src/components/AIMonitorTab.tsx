import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  Play,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  StopCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";

interface AIMonitorTabProps {
  projectId: string;
  monitorKeywords: any[];
  onRefresh: () => void;
}

const ITEMS_PER_PAGE = 5;

const TIME_RANGES = [
  { label: "1M", value: 30 },
  { label: "3M", value: 90 },
  { label: "6M", value: 180 },
  { label: "1Y", value: 365 },
] as const;

const GRANULARITY = [
  { label: "1D", value: 1 },
  { label: "3D", value: 3 },
  { label: "5D", value: 5 },
  { label: "1W", value: 7 },
  { label: "1M", value: 30 },
] as const;

const AIMonitorTab = ({ projectId, monitorKeywords, onRefresh }: AIMonitorTabProps) => {
  const [historyMap, setHistoryMap] = useState<Record<string, any[]>>({});
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);
  const [runningMonitor, setRunningMonitor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedRange, setSelectedRange] = useState(90);
  const [selectedGranularity, setSelectedGranularity] = useState(5);

  useEffect(() => {
    if (monitorKeywords.length > 0) fetchAllHistory();
    else setLoadingHistory(false);
  }, [monitorKeywords]);

  const fetchAllHistory = async () => {
    setLoadingHistory(true);
    const ids = monitorKeywords.map((mk) => mk.id);
    
    const { data: history } = await supabase
      .from("monitor_history")
      .select("*, keyword_researches(*)")
      .in("monitor_keyword_id", ids)
      .order("recorded_at", { ascending: true });

    const map: Record<string, any[]> = {};
    (history || []).forEach((h) => {
      if (!map[h.monitor_keyword_id]) map[h.monitor_keyword_id] = [];
      map[h.monitor_keyword_id].push(h);
    });
    setHistoryMap(map);
    setLoadingHistory(false);
  };

  const deleteMonitorKeyword = async (monitorKeywordId: string) => {
    toast("Delete this monitored keyword?", {
      action: {
        label: "Delete",
        onClick: async () => {
          await supabase.from("ai_monitor_keywords").delete().eq("id", monitorKeywordId);
          if (expandedKeyword === monitorKeywordId) setExpandedKeyword(null);
          toast.success("Keyword deleted");
          onRefresh();
        },
      },
    });
  };

  const toggleMonitorKeyword = async (monitorKeywordId: string, currentActive: boolean) => {
    await supabase
      .from("ai_monitor_keywords")
      .update({ is_active: !currentActive })
      .eq("id", monitorKeywordId);
    toast.success(!currentActive ? "Monitoring resumed" : "Monitoring paused");
    onRefresh();
  };

  const runMonitorNow = async (monitorKeywordId: string, keyword: string) => {
    setRunningMonitor(monitorKeywordId);
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
          body: JSON.stringify({ project_id: projectId, keyword, monitor_keyword_id: monitorKeywordId }),
        }
      );
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Monitor check completed!");
        onRefresh();
        setTimeout(() => fetchAllHistory(), 1000);
      }
    } catch (err) {
      console.error("Monitor run failed:", err);
      toast.error("Monitor run failed. Please try again.");
    } finally {
      setRunningMonitor(null);
    }
  };

  // Aggregate trend chart data
  const aggregateTrendData = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selectedRange);

    const allEntries: { date: Date; quality: number; visibility: number }[] = [];
    Object.values(historyMap).forEach((entries) => {
      entries.forEach((e) => {
        if (!e.keyword_researches) return;
        const d = new Date(e.recorded_at);
        if (d < cutoff) return;
        allEntries.push({
          date: d,
          quality: e.keyword_researches.avg_quality_score || 0,
          visibility: e.keyword_researches.avg_visibility_score || 0,
        });
      });
    });

    if (allEntries.length === 0) return [];

    allEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Group by granularity buckets
    const buckets: Record<string, { quality: number[]; visibility: number[] }> = {};
    allEntries.forEach((e) => {
      const bucketStart = new Date(e.date);
      const dayOfYear = Math.floor(bucketStart.getTime() / (1000 * 60 * 60 * 24));
      const bucketKey = Math.floor(dayOfYear / selectedGranularity);
      const key = String(bucketKey);
      if (!buckets[key]) buckets[key] = { quality: [], visibility: [] };
      buckets[key].quality.push(e.quality);
      buckets[key].visibility.push(e.visibility);
    });

    // Convert to chart data with date labels
    const startDay = Math.floor(allEntries[0].date.getTime() / (1000 * 60 * 60 * 24));
    return Object.entries(buckets)
      .map(([key, val]) => {
        const bucketDay = parseInt(key) * selectedGranularity;
        const d = new Date(bucketDay * 1000 * 60 * 60 * 24);
        return {
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          quality: Math.round(val.quality.reduce((s, v) => s + v, 0) / val.quality.length),
          visibility: Math.round(val.visibility.reduce((s, v) => s + v, 0) / val.visibility.length),
          sortKey: parseInt(key),
        };
      })
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [historyMap, selectedRange, selectedGranularity]);

  // Filter and paginate
  const filtered = monitorKeywords.filter((mk) =>
    mk.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getKeywordStats = (mkId: string) => {
    const entries = historyMap[mkId] || [];
    if (entries.length === 0) return null;
    const researches = entries.map((e) => e.keyword_researches).filter(Boolean);
    if (researches.length === 0) return null;

    const latest = researches[researches.length - 1];
    const avgQuality = Math.round(
      researches.reduce((s: number, r: any) => s + (r.avg_quality_score || 0), 0) / researches.length
    );
    const avgVisibility = Math.round(
      researches.reduce((s: number, r: any) => s + (r.avg_visibility_score || 0), 0) / researches.length
    );

    let qualityTrend: "up" | "down" | "stable" = "stable";
    let visibilityTrend: "up" | "down" | "stable" = "stable";
    if (researches.length >= 2) {
      const prev = researches[researches.length - 2];
      qualityTrend = latest.avg_quality_score > prev.avg_quality_score ? "up" : latest.avg_quality_score < prev.avg_quality_score ? "down" : "stable";
      visibilityTrend = latest.avg_visibility_score > prev.avg_visibility_score ? "up" : latest.avg_visibility_score < prev.avg_visibility_score ? "down" : "stable";
    }

    return { avgQuality, avgVisibility, qualityTrend, visibilityTrend, latest, count: researches.length };
  };

  const getChartData = (mkId: string) => {
    const entries = historyMap[mkId] || [];
    return entries
      .filter((e) => e.keyword_researches)
      .map((e) => ({
        date: new Date(e.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        quality: e.keyword_researches.avg_quality_score || 0,
        visibility: e.keyword_researches.avg_visibility_score || 0,
      }));
  };

  const getDetailedChartData = (mkId: string) => {
    const entries = historyMap[mkId] || [];
    return entries
      .filter((e) => e.keyword_researches)
      .map((e) => {
        const r = e.keyword_researches;
        return {
          date: new Date(e.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          geminiQuality: r.gemini_quality_score || 0,
          geminiVisibility: r.gemini_visibility_score || 0,
          openaiQuality: r.openai_quality_score || 0,
          openaiVisibility: r.openai_visibility_score || 0,
          perplexityQuality: r.perplexity_quality_score || 0,
          perplexityVisibility: r.perplexity_visibility_score || 0,
        };
      });
  };

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-primary" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return null;
  };

  if (monitorKeywords.length === 0) {
    return (
      <div>
        <h2 className="font-display text-xl md:text-2xl font-bold mb-6">AI Monitor</h2>
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Radar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-display text-lg font-semibold">No monitored keywords</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add keywords from your research to monitor their AI visibility over time
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl md:text-2xl font-bold mb-6">AI Monitor</h2>

      {/* Aggregate Trend Chart */}
      {aggregateTrendData.length >= 2 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle className="text-sm">Overall Visibility & Quality Trend</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 border border-border rounded-md overflow-hidden">
                  {GRANULARITY.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setSelectedGranularity(g.value)}
                      className={`px-2 py-1 text-xs font-medium transition-colors ${
                        selectedGranularity === g.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 border border-border rounded-md overflow-hidden">
                  {TIME_RANGES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setSelectedRange(r.value)}
                      className={`px-2 py-1 text-xs font-medium transition-colors ${
                        selectedRange === r.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aggregateTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visibility"
                    name="Avg Visibility"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quality"
                    name="Avg Quality"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search monitored keywords..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {paginated.map((mk) => {
          const stats = getKeywordStats(mk.id);
          const isExpanded = expandedKeyword === mk.id;

          return (
            <Card
              key={mk.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isExpanded ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setExpandedKeyword(isExpanded ? null : mk.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm truncate">{mk.keyword}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Next: {new Date(mk.next_run_at).toLocaleDateString()} · {stats?.count || 0} checks
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      disabled={runningMonitor === mk.id}
                      onClick={(e) => { e.stopPropagation(); runMonitorNow(mk.id, mk.keyword); }}
                      title="Run now"
                    >
                      {runningMonitor === mk.id ? (
                        <div className="relative h-3.5 w-3.5">
                          <div className="absolute inset-0 rounded-full border-2 border-foreground/30" />
                          <div className="absolute inset-0 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
                        </div>
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={(e) => { e.stopPropagation(); toggleMonitorKeyword(mk.id, mk.is_active); }}
                      title={mk.is_active ? "Pause monitoring" : "Resume monitoring"}
                    >
                      <StopCircle className={`h-3.5 w-3.5 ${mk.is_active ? "text-muted-foreground" : "text-primary"}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteMonitorKeyword(mk.id); }}
                      title="Delete keyword"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>

                {!mk.is_active && (
                  <Badge variant="outline" className="text-xs mb-2">Paused</Badge>
                )}

                {stats ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Quality</span>
                      <span className="text-sm font-semibold">{stats.avgQuality}%</span>
                      <TrendIcon trend={stats.qualityTrend} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Visibility</span>
                      <span className="text-sm font-semibold">{stats.avgVisibility}%</span>
                      <TrendIcon trend={stats.visibilityTrend} />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No data yet — run a check</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Expanded keyword detail */}
      {expandedKeyword && (() => {
        const mk = monitorKeywords.find((m) => m.id === expandedKeyword);
        if (!mk) return null;
        const stats = getKeywordStats(mk.id);
        const chartData = getChartData(mk.id);
        const detailedData = getDetailedChartData(mk.id);
        const entries = historyMap[mk.id] || [];
        const latestResearch = entries.length > 0 ? entries[entries.length - 1]?.keyword_researches : null;

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-lg md:text-xl font-bold">{mk.keyword}</h3>
              <Badge variant={mk.is_active ? "default" : "outline"}>
                {mk.is_active ? "Active" : "Paused"}
              </Badge>
            </div>

            {chartData.length >= 2 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quality & Visibility Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56 md:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="quality" name="Quality" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="visibility" name="Visibility" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quality by AI Engine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56 md:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={detailedData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="geminiQuality" name="Gemini" stroke="#4285F4" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="openaiQuality" name="ChatGPT" stroke="#10A37F" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="perplexityQuality" name="Perplexity" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {chartData.length === 0
                      ? "No monitoring data yet. Click 'Run Now' to start tracking."
                      : "Need at least 2 data points for charts. Run another check."}
                  </p>
                </CardContent>
              </Card>
            )}

            {latestResearch && (
              <div>
                <h4 className="font-display font-semibold text-sm mb-3">Latest Check Results</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Gemini",
                      color: "#4285F4",
                      quality: latestResearch.gemini_quality_score,
                      visibility: latestResearch.gemini_visibility_score,
                      cited: latestResearch.gemini_is_cited,
                      response: latestResearch.gemini_response,
                      citations: latestResearch.gemini_citations,
                    },
                    {
                      name: "ChatGPT",
                      color: "#10A37F",
                      quality: latestResearch.openai_quality_score,
                      visibility: latestResearch.openai_visibility_score,
                      cited: latestResearch.openai_is_cited,
                      response: latestResearch.openai_response,
                      citations: latestResearch.openai_citations,
                    },
                    {
                      name: "Perplexity",
                      color: "#8B5CF6",
                      quality: latestResearch.perplexity_quality_score,
                      visibility: latestResearch.perplexity_visibility_score,
                      cited: latestResearch.perplexity_is_cited,
                      response: latestResearch.perplexity_response,
                      citations: latestResearch.perplexity_citations,
                    },
                  ].map((ai) => (
                    <Card key={ai.name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ai.color }} />
                          {ai.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-semibold">{ai.quality}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Visibility</span>
                          <span className="font-semibold">{ai.visibility}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Cited</span>
                          {ai.cited ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        {Array.isArray(ai.citations) && ai.citations.length > 0 && (
                          <div className="pt-2 border-t border-border">
                            <span className="text-xs text-muted-foreground">Citations:</span>
                            <div className="mt-1 space-y-0.5">
                              {(ai.citations as string[]).slice(0, 3).map((url, i) => (
                                <a
                                  key={i}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs text-primary truncate hover:underline"
                                >
                                  {url}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {detailedData.length >= 2 && (
                  <Card className="mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Visibility by AI Engine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-56 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={detailedData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                            <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="geminiVisibility" name="Gemini" stroke="#4285F4" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="openaiVisibility" name="ChatGPT" stroke="#10A37F" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="perplexityVisibility" name="Perplexity" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default AIMonitorTab;
