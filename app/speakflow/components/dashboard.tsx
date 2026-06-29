import { useNavigate } from "react-router";
import { useProgress } from "~/speakflow/hooks/use-progress";
import { useConfigurables } from "~/modules/configurables";
import type { TPracticeScenario, TAchievementBadge } from "~/modules/configurables/src/constants/configurables.default";
import { ScoreRing } from "./score-ring";
import { StreakBadge } from "./streak-badge";
import { WeeklyChart } from "./weekly-chart";
import { ScenarioCard } from "./scenario-card";
import { AchievementsPanel } from "./achievements-panel";

export function Dashboard() {
  const { progress, loading } = useProgress();
  const { config } = useConfigurables();
  const navigate = useNavigate();

  const appName = config?.appName ?? "SpeakFlow";
  const dailyGoal = config?.dailySpeakingGoalMinutes ?? 15;
  const coachName = config?.aiCoachName ?? "Aria";
  const scenarios = (config?.practiceScenarios ?? []) as TPracticeScenario[];
  const badges = (config?.achievementBadges ?? []) as TAchievementBadge[];
  const enableBadges = config?.enableAchievementBadges !== false;
  const enableProgress = config?.enableProgressTracking !== false;

  const todayMins = progress?.dailyGoalMinutesToday ?? 0;
  const goalPct = Math.min(100, Math.round((todayMins / dailyGoal) * 100));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground text-lg">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good day! Ready to speak?
          </h1>
          <p className="text-muted-foreground mt-1">
            {coachName} is here — let&apos;s practice together.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge streak={progress?.currentStreak ?? 0} />
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {progress?.proficiencyLevel ?? "Beginner"}
          </span>
        </div>
      </div>

      {/* Daily Goal Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-foreground">Daily Speaking Goal</h2>
            <p className="text-sm text-muted-foreground">{todayMins} / {dailyGoal} minutes today</p>
          </div>
          <span className="text-2xl font-bold text-primary">{goalPct}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${goalPct}%` }}
          />
        </div>
        {goalPct >= 100 && (
          <p className="text-sm text-green-600 mt-2 font-medium">Goal complete! Amazing work today.</p>
        )}
      </div>

      {/* Score Cards */}
      {enableProgress && (
        <div>
          <h2 className="font-semibold text-foreground mb-4">Your Scores</h2>
          <div className="grid grid-cols-3 gap-4">
            <ScoreRing
              label="Pronunciation"
              score={progress?.pronunciationScore ?? 50}
              color="primary"
            />
            <ScoreRing
              label="Grammar"
              score={progress?.grammarScore ?? 50}
              color="accent"
            />
            <ScoreRing
              label="Vocabulary"
              score={Math.min(100, Math.round(((progress?.vocabularyCount ?? 0) / 500) * 100))}
              label2={`${progress?.vocabularyCount ?? 0} words`}
              color="secondary"
            />
          </div>
        </div>
      )}

      {/* Weekly Chart */}
      <WeeklyChart history={progress?.weeklyHistory ?? []} />

      {/* Practice Scenarios */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Practice Scenarios</h2>
          <button
            onClick={() => navigate("/practice")}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {scenarios.slice(0, 6).map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              onClick={() => navigate(`/practice/${s.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Recently Learned Words */}
      {(progress?.recentWords ?? []).length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-foreground mb-3">Recently Learned Words</h2>
          <div className="flex flex-wrap gap-2">
            {(progress?.recentWords ?? []).slice(0, 10).map((word) => (
              <span
                key={word}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
            {coachName[0]}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{coachName}&apos;s Tip for You</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {progress && progress.currentStreak > 0
                ? `You're on a ${progress.currentStreak}-day streak! Consistency is your superpower. Keep it up!`
                : "Start your first session today — even 5 minutes of speaking practice makes a real difference!"}
            </p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {enableBadges && badges.length > 0 && (
        <AchievementsPanel
          badges={badges}
          earnedBadgeIds={(progress?.earnedBadges ?? []).map((b) => b.badgeId)}
        />
      )}
    </div>
  );
}
