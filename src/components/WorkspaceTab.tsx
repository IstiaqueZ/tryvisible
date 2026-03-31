import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  BarChart3,
  ListChecks,
} from "lucide-react";

interface WorkspaceTabProps {
  projectId: string;
  keywords: any[];
  todos: any[];
  onToggleTodo?: (id: string, currentStatus: boolean) => void;
}

const WorkspaceTab = ({ projectId, keywords, todos, onToggleTodo }: WorkspaceTabProps) => {
  const avgVisibility = keywords.length
    ? Math.round(keywords.reduce((s, k) => s + (k.avg_visibility_score || 0), 0) / keywords.length)
    : 0;
  const avgQuality = keywords.length
    ? Math.round(keywords.reduce((s, k) => s + (k.avg_quality_score || 0), 0) / keywords.length)
    : 0;

  const sortedByVisibility = [...keywords].sort((a, b) => (b.avg_visibility_score || 0) - (a.avg_visibility_score || 0));
  const sortedByQuality = [...keywords].sort((a, b) => (b.avg_quality_score || 0) - (a.avg_quality_score || 0));

  const top5Visibility = sortedByVisibility.slice(0, 5);
  const worst5Visibility = sortedByVisibility.slice(-5).reverse();
  const top5Quality = sortedByQuality.slice(0, 5);
  const worst5Quality = sortedByQuality.slice(-5).reverse();

  const recentTodos = todos.filter((t) => !t.is_completed).slice(0, 5);

  const KeywordList = ({ items, scoreKey, variant }: { items: any[]; scoreKey: string; variant: "good" | "bad" }) => (
    items.length === 0 ? (
      <p className="text-sm text-muted-foreground">No keywords yet</p>
    ) : (
      <div className="divide-y divide-border">
        {items.map((kw, i) => (
          <div key={kw.id} className="flex items-center justify-between py-2.5 px-1">
            <span className="truncate flex-1 mr-2 text-sm">
              <span className="text-muted-foreground mr-2 font-mono text-xs">{i + 1}.</span>
              {kw.keyword}
            </span>
            <Badge
              variant={variant === "good" ? "outline" : "destructive"}
              className={`shrink-0 font-mono ${variant === "good" ? "" : "border-0"}`}
            >
              {kw[scoreKey]}%
            </Badge>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Workspace Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center p-4 text-center">
            <Eye className="h-6 w-6 text-primary" />
            <span className="mt-2 font-display text-2xl font-bold">{avgVisibility}%</span>
            <span className="text-xs text-muted-foreground">Avg Visibility</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4 text-center">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="mt-2 font-display text-2xl font-bold">{avgQuality}%</span>
            <span className="text-xs text-muted-foreground">Avg Quality</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="mt-2 font-display text-2xl font-bold">{keywords.length}</span>
            <span className="text-xs text-muted-foreground">Keywords Tracked</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4 text-center">
            <ListChecks className="h-6 w-6 text-primary" />
            <span className="mt-2 font-display text-2xl font-bold">{todos.filter((t) => !t.is_completed).length}</span>
            <span className="text-xs text-muted-foreground">Pending To-Dos</span>
          </CardContent>
        </Card>
      </div>

      {/* Top/Worst Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Top 5 by Visibility
            </CardTitle>
          </CardHeader>
          <CardContent><KeywordList items={top5Visibility} scoreKey="avg_visibility_score" variant="good" /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Top 5 by Quality
            </CardTitle>
          </CardHeader>
          <CardContent><KeywordList items={top5Quality} scoreKey="avg_quality_score" variant="good" /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" /> Worst 5 by Visibility
            </CardTitle>
          </CardHeader>
          <CardContent><KeywordList items={worst5Visibility} scoreKey="avg_visibility_score" variant="bad" /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" /> Worst 5 by Quality
            </CardTitle>
          </CardHeader>
          <CardContent><KeywordList items={worst5Quality} scoreKey="avg_quality_score" variant="bad" /></CardContent>
        </Card>
      </div>

      {/* Recent To-Dos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" /> Recent Pending To-Dos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTodos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending to-dos</p>
          ) : (
            <div className="divide-y divide-border">
              {recentTodos.map((todo) => (
                <div key={todo.id} className="flex items-start gap-3 py-3 px-1">
                  <Checkbox
                    checked={todo.is_completed}
                    onCheckedChange={() => onToggleTodo?.(todo.id, todo.is_completed)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{todo.title}</span>
                    {todo.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{todo.description}</p>
                    )}
                  </div>
                  {todo.source_audit_id && (
                    <Badge variant="outline" className="text-xs shrink-0">Audit</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceTab;
