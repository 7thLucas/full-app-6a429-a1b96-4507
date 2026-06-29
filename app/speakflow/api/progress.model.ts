import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";

export class WeeklyEntry {
  @prop({ required: true, type: String })
  date!: string; // YYYY-MM-DD

  @prop({ default: 0, type: Number })
  sessionsCount!: number;

  @prop({ default: 0, type: Number })
  speakingMinutes!: number;
}

export class EarnedBadge {
  @prop({ required: true, type: String })
  badgeId!: string;

  @prop({ required: true, type: Date })
  earnedAt!: Date;
}

@modelOptions({ schemaOptions: { collection: "speakflow_progress", timestamps: true } })
@index({ userId: 1 }, { unique: true })
export class SpeakflowProgress {
  @prop({ required: true, type: String, unique: true, index: true })
  userId!: string;

  @prop({ default: "Beginner", type: String })
  proficiencyLevel!: string;

  @prop({ default: 0, type: Number })
  currentStreak!: number;

  @prop({ default: 0, type: Number })
  longestStreak!: number;

  @prop({ type: String })
  lastPracticeDate?: string; // YYYY-MM-DD

  @prop({ default: 0, type: Number })
  totalSessions!: number;

  @prop({ default: 0, type: Number })
  totalSpeakingMinutes!: number;

  @prop({ default: 50, type: Number })
  pronunciationScore!: number;

  @prop({ default: 50, type: Number })
  grammarScore!: number;

  @prop({ default: 0, type: Number })
  vocabularyCount!: number;

  @prop({ default: 0, type: Number })
  dailyGoalMinutesToday!: number;

  @prop({ type: () => [WeeklyEntry], default: [] })
  weeklyHistory!: WeeklyEntry[];

  @prop({ type: () => [EarnedBadge], default: [] })
  earnedBadges!: EarnedBadge[];

  @prop({ type: () => [String], default: [] })
  recentWords!: string[];
}

export const SpeakflowProgressModel = getModelForClass(SpeakflowProgress);
