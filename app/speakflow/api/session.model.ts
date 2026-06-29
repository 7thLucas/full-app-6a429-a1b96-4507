import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";

export class ConversationTurn {
  @prop({ required: true, type: String })
  role!: string;

  @prop({ required: true, type: String })
  content!: string;

  @prop({ type: Date })
  timestamp?: Date;
}

export class PronunciationFeedback {
  @prop({ type: Number })
  score?: number;

  @prop({ type: String })
  tip?: string;

  @prop({ type: () => [String] })
  highlightedWords?: string[];
}

export class GrammarFeedback {
  @prop({ type: Number })
  score?: number;

  @prop({ type: () => [String] })
  corrections?: string[];

  @prop({ type: String })
  explanation?: string;
}

export class VocabWord {
  @prop({ required: true, type: String })
  word!: string;

  @prop({ type: String })
  definition?: string;

  @prop({ type: String })
  usedInContext?: string;
}

@modelOptions({ schemaOptions: { collection: "speakflow_sessions", timestamps: true } })
@index({ userId: 1, createdAt: -1 })
export class SpeakflowSession {
  @prop({ required: true, type: String, index: true })
  userId!: string;

  @prop({ required: true, type: String })
  scenarioId!: string;

  @prop({ required: true, type: String })
  scenarioTitle!: string;

  @prop({ type: () => [ConversationTurn], default: [] })
  turns!: ConversationTurn[];

  @prop({ type: () => PronunciationFeedback })
  pronunciationFeedback?: PronunciationFeedback;

  @prop({ type: () => GrammarFeedback })
  grammarFeedback?: GrammarFeedback;

  @prop({ type: () => [VocabWord], default: [] })
  learnedWords!: VocabWord[];

  @prop({ default: 0, type: Number })
  durationSeconds!: number;

  @prop({ default: "active", type: String })
  status!: string;
}

export const SpeakflowSessionModel = getModelForClass(SpeakflowSession);
