interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
      <span className="text-lg" aria-hidden="true">🔥</span>
      <span className="font-bold text-amber-700 text-sm">{streak}</span>
      <span className="text-xs text-amber-600 hidden sm:inline">day streak</span>
    </div>
  );
}
