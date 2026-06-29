interface TurnFeedback {
  pronunciationTip?: string;
  grammarCorrections?: string[];
  learnedWords?: Array<{ word: string; definition?: string }>;
}

interface FeedbackCardProps {
  feedback: TurnFeedback;
  onDismiss: () => void;
}

export function FeedbackCard({ feedback, onDismiss }: FeedbackCardProps) {
  const hasPronunciation = !!feedback.pronunciationTip;
  const hasGrammar = (feedback.grammarCorrections?.length ?? 0) > 0;
  const hasWords = (feedback.learnedWords?.length ?? 0) > 0;

  if (!hasPronunciation && !hasGrammar && !hasWords) return null;

  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-4 mb-3 shadow-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">Quick Feedback</h4>
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Dismiss
        </button>
      </div>

      <div className="space-y-2">
        {hasPronunciation && (
          <div className="flex gap-2 items-start">
            <span className="text-sm">🗣️</span>
            <div>
              <p className="text-xs font-medium text-foreground">Pronunciation tip</p>
              <p className="text-xs text-muted-foreground">{feedback.pronunciationTip}</p>
            </div>
          </div>
        )}

        {hasGrammar && (
          <div className="flex gap-2 items-start">
            <span className="text-sm">✅</span>
            <div>
              <p className="text-xs font-medium text-foreground">Grammar notes</p>
              {feedback.grammarCorrections?.map((c, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {c}</p>
              ))}
            </div>
          </div>
        )}

        {hasWords && (
          <div className="flex gap-2 items-start">
            <span className="text-sm">📖</span>
            <div>
              <p className="text-xs font-medium text-foreground">New vocabulary</p>
              {feedback.learnedWords?.map((w, i) => (
                <p key={i} className="text-xs text-muted-foreground">
                  <strong>{w.word}</strong>{w.definition ? ` — ${w.definition}` : ""}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
