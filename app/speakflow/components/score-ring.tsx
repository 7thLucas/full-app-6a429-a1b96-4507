interface ScoreRingProps {
  label: string;
  score: number;
  label2?: string;
  color?: "primary" | "accent" | "secondary";
}

const colorMap = {
  primary: "stroke-primary",
  accent: "stroke-accent",
  secondary: "stroke-secondary-foreground",
};

const textColorMap = {
  primary: "text-primary",
  accent: "text-accent",
  secondary: "text-secondary-foreground",
};

export function ScoreRing({ label, score, label2, color = "primary" }: ScoreRingProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted opacity-30"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            className={colorMap[color]}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${textColorMap[color]}`}>{score}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {label2 && <p className="text-xs text-muted-foreground">{label2}</p>}
      </div>
    </div>
  );
}
