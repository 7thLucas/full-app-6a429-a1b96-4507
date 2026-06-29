import { useState, useEffect } from "react";
import { useSession } from "~/speakflow/hooks/use-session";
import type { SessionData } from "~/speakflow/hooks/use-session";

export function HistoryList() {
  const { loadHistory } = useSession();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SessionData | null>(null);

  useEffect(() => {
    setLoading(true);
    loadHistory(20).then((h) => {
      setSessions(h);
      setLoading(false);
    });
  }, [loadHistory]);

  if (loading) {
    return <div className="text-muted-foreground py-12 text-center">Loading history...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">📋</p>
        <h2 className="font-semibold text-foreground mb-2">No sessions yet</h2>
        <p className="text-muted-foreground text-sm">Complete your first practice session to see it here.</p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          ← Back to history
        </button>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-semibold text-foreground text-lg">{selected.scenarioTitle}</h2>
          </div>
          {selected.pronunciationFeedback?.score != null && (
            <div className="flex gap-6 mb-4 text-sm">
              <div><span className="text-muted-foreground">Pronunciation</span> <strong className="text-foreground">{selected.pronunciationFeedback.score}</strong></div>
              {selected.grammarFeedback?.score != null && (
                <div><span className="text-muted-foreground">Grammar</span> <strong className="text-foreground">{selected.grammarFeedback.score}</strong></div>
              )}
              {selected.durationSeconds && (
                <div><span className="text-muted-foreground">Duration</span> <strong className="text-foreground">{Math.round(selected.durationSeconds / 60)}m</strong></div>
              )}
            </div>
          )}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selected.turns.map((turn, i) => (
              <div key={i} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                  turn.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  {turn.content}
                </div>
              </div>
            ))}
          </div>
          {(selected.learnedWords ?? []).length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">Words learned</h3>
              <div className="flex flex-wrap gap-2">
                {selected.learnedWords?.map((w, i) => (
                  <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                    {w.word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold text-foreground mb-6">Conversation History</h1>
      {sessions.map((s) => (
        <button
          key={s._id}
          onClick={() => setSelected(s)}
          className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:border-primary transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {s.scenarioTitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {s.turns.length} turns
                {s.durationSeconds ? ` · ${Math.round(s.durationSeconds / 60)}m` : ""}
                {(s.learnedWords?.length ?? 0) > 0 ? ` · ${s.learnedWords?.length} words learned` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {s.pronunciationFeedback?.score != null && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                  {s.pronunciationFeedback.score}
                </span>
              )}
              <span className="text-muted-foreground">→</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
