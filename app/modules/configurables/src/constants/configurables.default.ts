/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TPracticeScenario = {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
};

export type TAchievementBadge = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category?: "streak" | "vocabulary" | "pronunciation" | "grammar" | "milestone";
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  // SpeakFlow fields
  appTagline?: string;
  appDescription?: string;
  dailySpeakingGoalMinutes?: number;
  streakFreezeEnabled?: boolean;
  maxDailyChallenge?: number;
  defaultProficiencyLevel?: "Beginner" | "Intermediate" | "Advanced";
  enablePronunciationFeedback?: boolean;
  enableGrammarCoaching?: boolean;
  enableVocabCoaching?: boolean;
  enableAchievementBadges?: boolean;
  enableDailyChallenge?: boolean;
  enableProgressTracking?: boolean;
  aiCoachName?: string;
  aiCoachPersona?: string;
  practiceScenarios?: TPracticeScenario[];
  achievementBadges?: TAchievementBadge[];
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "SpeakFlow",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#ffffff",
    foreground:        "#09090b",
    // Card
    card:              "#ffffff",
    cardForeground:    "#09090b",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#09090b",
    // Primary
    primary:           "#2563eb",
    primaryForeground: "#ffffff",
    // Secondary
    secondary:           "#f4f4f5",
    secondaryForeground: "#18181b",
    // Muted
    muted:           "#f4f4f5",
    mutedForeground: "#71717a",
    // Accent
    accent:           "#f4f4f5",
    accentForeground: "#18181b",
    // Destructive
    destructive:           "#ef4444",
    destructiveForeground: "#fafafa",
    // Border / Input / Ring
    border: "#e4e4e7",
    input:  "#e4e4e7",
    ring:   "#2563eb",
    // Charts
    chart1: "#f97316",
    chart2: "#0d9488",
    chart3: "#1e3a5f",
    chart4: "#d4a017",
    chart5: "#ea580c",
    // Navbar
    navbarBackground: "#ffffff",
    // Sidebar
    sidebarBackground:        "#fafafa",
    sidebarForeground:        "#3f3f46",
    sidebarPrimary:           "#2563eb",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#f4f4f5",
    sidebarAccentForeground:  "#18181b",
    sidebarBorder:            "#e4e4e7",
    sidebarRing:              "#2563eb",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },
  // ── SpeakFlow defaults ───────────────────────────────────────────────
  appTagline: "Speak English. Confidently.",
  appDescription: "Your AI speaking coach — always available, never judgmental. Practice real conversations and improve with every session.",
  dailySpeakingGoalMinutes: 15,
  streakFreezeEnabled: true,
  maxDailyChallenge: 3,
  defaultProficiencyLevel: "Beginner",
  enablePronunciationFeedback: true,
  enableGrammarCoaching: true,
  enableVocabCoaching: true,
  enableAchievementBadges: true,
  enableDailyChallenge: true,
  enableProgressTracking: true,
  aiCoachName: "Aria",
  aiCoachPersona: "Patient, encouraging English coach who celebrates progress and frames mistakes as learning moments. Never condescending.",
  practiceScenarios: [
    { id: "food-ordering",   title: "Food Ordering",        icon: "☕", description: "Practice at cafés and restaurants",  difficulty: "Beginner" },
    { id: "travel",          title: "Travel & Navigation",  icon: "✈️", description: "Airport, hotel, and directions",       difficulty: "Beginner" },
    { id: "small-talk",      title: "Small Talk",           icon: "💬", description: "Social conversations and greetings",  difficulty: "Beginner" },
    { id: "phone-calls",     title: "Phone Calls",          icon: "📞", description: "Professional and personal calls",     difficulty: "Intermediate" },
    { id: "job-interview",   title: "Job Interview",        icon: "💼", description: "Answer tough interview questions",    difficulty: "Intermediate" },
    { id: "presentation",    title: "Business Presentation",icon: "📊", description: "Present ideas with confidence",       difficulty: "Advanced" },
  ],
  achievementBadges: [
    { id: "first-convo",       title: "First Words",         icon: "🎙️",  description: "Completed your first conversation",  category: "milestone" },
    { id: "streak-7",          title: "Week Warrior",        icon: "🔥",  description: "7-day speaking streak",              category: "streak" },
    { id: "streak-30",         title: "Monthly Master",      icon: "🏆",  description: "30-day speaking streak",             category: "streak" },
    { id: "vocab-100",         title: "Word Collector",      icon: "📖",  description: "Learned 100 new words",              category: "vocabulary" },
    { id: "pronunciation-pro", title: "Clear Speaker",       icon: "🗣️",  description: "Pronunciation score above 80",       category: "pronunciation" },
    { id: "grammar-ace",       title: "Grammar Ace",         icon: "✅",  description: "Grammar score above 85",            category: "grammar" },
    { id: "sessions-10",       title: "Consistent Learner",  icon: "⭐",  description: "Completed 10 practice sessions",     category: "milestone" },
  ],
  // ─────────────────────────────────────────────────────────────────────
};
