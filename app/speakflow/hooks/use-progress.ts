import { useState, useEffect, useCallback } from "react";

export interface SpeakflowProgressData {
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced";
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: string;
  totalSessions: number;
  totalSpeakingMinutes: number;
  pronunciationScore: number;
  grammarScore: number;
  vocabularyCount: number;
  dailyGoalMinutesToday: number;
  weeklyHistory: Array<{ date: string; sessionsCount: number; speakingMinutes: number }>;
  earnedBadges: Array<{ badgeId: string; earnedAt: string }>;
  recentWords: string[];
}

export function useProgress() {
  const [progress, setProgress] = useState<SpeakflowProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch("/api/speakflow/progress", { credentials: "include" });
      const json = await res.json();
      if (json.success) setProgress(json.data);
      else setError(json.message ?? "Failed to load progress");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { progress, loading, error, refetch: fetch };
}
