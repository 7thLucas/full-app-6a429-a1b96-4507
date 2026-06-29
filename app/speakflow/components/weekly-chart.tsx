interface WeeklyEntry {
  date: string;
  sessionsCount: number;
  speakingMinutes: number;
}

interface WeeklyChartProps {
  history: WeeklyEntry[];
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyChart({ history }: WeeklyChartProps) {
  const days = getLast7Days();
  const maxMins = Math.max(...days.map((d) => history.find((h) => h.date === d)?.speakingMinutes ?? 0), 1);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="font-semibold text-foreground mb-4">Weekly Activity</h2>
      <div className="flex items-end gap-2 h-24">
        {days.map((date) => {
          const entry = history.find((h) => h.date === date);
          const mins = entry?.speakingMinutes ?? 0;
          const pct = Math.round((mins / maxMins) * 100);
          const dayLabel = DAY_LABELS[new Date(date + "T12:00:00").getDay()];
          const isToday = date === new Date().toISOString().slice(0, 10);

          return (
            <div key={date} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full rounded-t-md bg-muted overflow-hidden" style={{ height: "80px" }}>
                <div
                  className={`w-full rounded-t-md transition-all duration-700 ease-out ${isToday ? "bg-primary" : "bg-accent"}`}
                  style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                  title={`${mins} min`}
                />
              </div>
              <span className={`text-xs ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
