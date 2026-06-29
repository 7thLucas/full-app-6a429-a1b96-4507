import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/speakflow/components/app-layout";
import { useProgress } from "~/speakflow/hooks/use-progress";
import { ScoreRing } from "~/speakflow/components/score-ring";
import { StreakBadge } from "~/speakflow/components/streak-badge";
import { WeeklyChart } from "~/speakflow/components/weekly-chart";
import { AchievementsPanel } from "~/speakflow/components/achievements-panel";
import { useConfigurables } from "~/modules/configurables";
import type { TAchievementBadge } from "~/modules/configurables/src/constants/configurables.default";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function ProgressPage() {
  const { progress, loading } = useProgress();
  const { config } = useConfigurables();
  const badges = (config?.achievementBadges ?? []) as TAchievementBadge[];
  const enableBadges = config?.enableAchievementBadges !== false;

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12 text-muted-foreground">Loading progress...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
          <p className="text-muted-foreground mt-1">Track your English speaking journey.</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Sessions", value: String(progress?.totalSessions ?? 0), icon: "🎙️" },
            { label: "Speaking Time", value: `${progress?.totalSpeakingMinutes ?? 0}m`, icon: "⏱️" },
            { label: "Words Learned", value: String(progress?.vocabularyCount ?? 0), icon: "📖" },
            { label: "Proficiency", value: progress?.proficiencyLevel ?? "Beginner", icon: "⭐" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-bold text-foreground text-xl">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Streak */}
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="font-semibold text-foreground">Speaking Streak</h2>
            <p className="text-sm text-muted-foreground">Longest: {progress?.longestStreak ?? 0} days</p>
          </div>
          <StreakBadge streak={progress?.currentStreak ?? 0} />
        </div>

        {/* Score Rings */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Skill Scores</h2>
          <div className="grid grid-cols-3 gap-4">
            <ScoreRing label="Pronunciation" score={progress?.pronunciationScore ?? 50} color="primary" />
            <ScoreRing label="Grammar" score={progress?.grammarScore ?? 50} color="accent" />
            <ScoreRing
              label="Vocabulary"
              score={Math.min(100, Math.round(((progress?.vocabularyCount ?? 0) / 500) * 100))}
              label2={`${progress?.vocabularyCount ?? 0} words`}
              color="secondary"
            />
          </div>
        </div>

        {/* Weekly Chart */}
        <WeeklyChart history={progress?.weeklyHistory ?? []} />

        {/* Recently Learned Words */}
        {(progress?.recentWords ?? []).length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-3">Recently Learned Words</h2>
            <div className="flex flex-wrap gap-2">
              {(progress?.recentWords ?? []).map((word) => (
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

        {/* Achievements */}
        {enableBadges && badges.length > 0 && (
          <AchievementsPanel
            badges={badges}
            earnedBadgeIds={(progress?.earnedBadges ?? []).map((b) => b.badgeId)}
          />
        )}
      </div>
    </AppLayout>
  );
}
