import type { TAchievementBadge } from "~/modules/configurables/src/constants/configurables.default";

interface AchievementsPanelProps {
  badges: TAchievementBadge[];
  earnedBadgeIds: string[];
}

const categoryColors: Record<string, string> = {
  streak: "bg-amber-100 border-amber-200",
  vocabulary: "bg-blue-100 border-blue-200",
  pronunciation: "bg-purple-100 border-purple-200",
  grammar: "bg-green-100 border-green-200",
  milestone: "bg-primary/10 border-primary/20",
};

export function AchievementsPanel({ badges, earnedBadgeIds }: AchievementsPanelProps) {
  const earned = badges.filter((b) => earnedBadgeIds.includes(b.id));
  const locked = badges.filter((b) => !earnedBadgeIds.includes(b.id));

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Achievements</h2>
        <span className="text-sm text-muted-foreground">{earned.length}/{badges.length}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {badges.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const colorClass = categoryColors[badge.category ?? "milestone"] ?? "bg-muted border-border";
          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                isEarned ? colorClass : "bg-muted/50 border-border opacity-40"
              }`}
              title={badge.description ?? badge.title}
            >
              <span className="text-2xl">{badge.icon ?? "🏅"}</span>
              <p className="text-xs font-medium text-foreground leading-tight">{badge.title}</p>
              {!isEarned && (
                <span className="absolute top-1 right-1 text-xs">🔒</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
