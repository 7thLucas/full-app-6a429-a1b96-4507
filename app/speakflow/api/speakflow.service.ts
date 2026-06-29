import { SpeakflowSessionModel } from "./session.model";
import { SpeakflowProgressModel } from "./progress.model";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export class SpeakflowService {
  // ── Progress ─────────────────────────────────────────────────────────────
  static async getOrCreateProgress(userId: string) {
    let progress = await SpeakflowProgressModel.findOne({ userId });
    if (!progress) {
      progress = await SpeakflowProgressModel.create({ userId });
    }
    return progress;
  }

  static async getProgress(userId: string) {
    return this.getOrCreateProgress(userId);
  }

  // ── Sessions ─────────────────────────────────────────────────────────────
  static async startSession(userId: string, scenarioId: string, scenarioTitle: string) {
    const session = await SpeakflowSessionModel.create({
      userId,
      scenarioId,
      scenarioTitle,
    });
    return session;
  }

  static async getSession(sessionId: string, userId: string) {
    return SpeakflowSessionModel.findOne({ _id: sessionId, userId });
  }

  static async addTurn(sessionId: string, userId: string, role: string, content: string) {
    return SpeakflowSessionModel.findOneAndUpdate(
      { _id: sessionId, userId },
      { $push: { turns: { role, content, timestamp: new Date() } } },
      { new: true }
    );
  }

  static async completeSession(
    sessionId: string,
    userId: string,
    data: {
      pronunciationScore?: number;
      pronunciationTip?: string;
      grammarScore?: number;
      grammarCorrections?: string[];
      learnedWords?: Array<{ word: string; definition?: string; usedInContext?: string }>;
      durationSeconds?: number;
    }
  ) {
    const session = await SpeakflowSessionModel.findOneAndUpdate(
      { _id: sessionId, userId },
      {
        $set: {
          status: "completed",
          durationSeconds: data.durationSeconds ?? 0,
          pronunciationFeedback: {
            score: data.pronunciationScore,
            tip: data.pronunciationTip,
          },
          grammarFeedback: {
            score: data.grammarScore,
            corrections: data.grammarCorrections ?? [],
          },
          learnedWords: data.learnedWords ?? [],
        },
      },
      { new: true }
    );

    if (session) {
      await this.updateProgressAfterSession(userId, data);
    }

    return session;
  }

  private static async updateProgressAfterSession(
    userId: string,
    data: {
      pronunciationScore?: number;
      grammarScore?: number;
      learnedWords?: Array<{ word: string }>;
      durationSeconds?: number;
    }
  ) {
    const progress = await this.getOrCreateProgress(userId);
    const today = todayStr();
    const mins = Math.round((data.durationSeconds ?? 0) / 60);
    const newWords = (data.learnedWords ?? []).map((w) => w.word);

    // Streak logic
    let newStreak = progress.currentStreak;
    if (progress.lastPracticeDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      if (progress.lastPracticeDate === yStr) {
        newStreak = progress.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    // Weekly history
    const weeklyHistory = [...(progress.weeklyHistory ?? [])];
    const todayEntry = weeklyHistory.find((e) => e.date === today);
    if (todayEntry) {
      todayEntry.sessionsCount += 1;
      todayEntry.speakingMinutes += mins;
    } else {
      weeklyHistory.push({ date: today, sessionsCount: 1, speakingMinutes: mins });
      if (weeklyHistory.length > 14) weeklyHistory.shift();
    }

    // Running average for scores
    const pScore =
      data.pronunciationScore != null
        ? Math.round(progress.pronunciationScore * 0.7 + data.pronunciationScore * 0.3)
        : progress.pronunciationScore;
    const gScore =
      data.grammarScore != null
        ? Math.round(progress.grammarScore * 0.7 + data.grammarScore * 0.3)
        : progress.grammarScore;

    // Recent words (deduplicate, keep last 20)
    const recentWords = [...new Set([...newWords, ...(progress.recentWords ?? [])])].slice(0, 20);

    await SpeakflowProgressModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          lastPracticeDate: today,
          currentStreak: newStreak,
          longestStreak: Math.max(progress.longestStreak, newStreak),
          pronunciationScore: pScore,
          grammarScore: gScore,
          weeklyHistory,
          recentWords,
          dailyGoalMinutesToday: progress.dailyGoalMinutesToday + mins,
        },
        $inc: {
          totalSessions: 1,
          totalSpeakingMinutes: mins,
          vocabularyCount: newWords.length,
        },
      }
    );
  }

  static async getSessionHistory(userId: string, limit = 10) {
    return SpeakflowSessionModel.find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async earnBadge(userId: string, badgeId: string) {
    const progress = await this.getOrCreateProgress(userId);
    const already = (progress.earnedBadges ?? []).some((b) => b.badgeId === badgeId);
    if (already) return progress;
    return SpeakflowProgressModel.findOneAndUpdate(
      { userId },
      { $push: { earnedBadges: { badgeId, earnedAt: new Date() } } },
      { new: true }
    );
  }
}
