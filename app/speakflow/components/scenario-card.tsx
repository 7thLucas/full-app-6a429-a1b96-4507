import type { TPracticeScenario } from "~/modules/configurables/src/constants/configurables.default";

interface ScenarioCardProps {
  scenario: TPracticeScenario;
  onClick: () => void;
}

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

export function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-2xl p-4 text-left hover:border-primary hover:shadow-md transition-all duration-200 group w-full"
    >
      <div className="text-3xl mb-2">{scenario.icon ?? "💬"}</div>
      <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
        {scenario.title}
      </p>
      {scenario.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{scenario.description}</p>
      )}
      {scenario.difficulty && (
        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[scenario.difficulty] ?? "bg-muted text-muted-foreground"}`}>
          {scenario.difficulty}
        </span>
      )}
    </button>
  );
}
