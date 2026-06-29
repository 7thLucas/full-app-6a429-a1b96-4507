# SpeakFlow Design Guidelines

## Design Philosophy
Modern, colorful, motivating. The UI should feel like a supportive coach — vibrant and energetic without being overwhelming. Every screen should communicate progress and possibility.

## Color Palette
Primary brand color: Indigo #6366F1
- Use indigo for primary actions, progress indicators, active states, and key CTAs
- Accent with violet and purple tones for depth
- Use bright green for success states and streak indicators
- Use amber/orange for warnings and challenge badges
- Backgrounds: light (near-white with subtle indigo tint) in light mode, deep navy/slate in dark mode

## Typography
- **Headings:** Plus Jakarta Sans — rounded, modern, friendly
- **Body:** Inter — clean, highly legible, neutral
- Font sizing: generous, accessible. Headings bold and confident. Body text comfortable reading size.

## Visual Language
- **Progress indicators:** Bold, vibrant, animated where possible. Circular progress rings, horizontal bars with gradient fills.
- **Cards:** Rounded corners (radius 12–16px), subtle shadows, slightly elevated feel. Cards for scores, recent words, scenario tiles.
- **Badges:** Colorful, icon-forward achievement badges. Use distinct colors per achievement category.
- **Scenario tiles:** Visual cards with icons representing each scenario (coffee cup, airplane, briefcase, etc.). Tap to start immediately.
- **Streak counter:** Prominent flame icon with streak count. Highlighted in amber/orange when active.
- **Score displays:** Large numeral, color-coded (green for high, amber for mid, red for low — relative to user's baseline).

## Component Patterns
- **Primary buttons:** Indigo background, white text, rounded-full or rounded-lg, subtle shadow on hover.
- **Voice button (mic):** Large, centered, indigo-to-violet gradient circle. Pulse animation when recording.
- **Feedback cards:** Slide-up after each conversation turn. Softly colored (not alarming). Collapsible.
- **Navigation:** Bottom nav on mobile, sidebar on desktop. Clean icons + labels.
- **Modals/sheets:** Rounded top corners on mobile (bottom sheet). Smooth slide-up animation.

## Motion & Interaction
- Smooth transitions (200–300ms ease-out)
- Mic button pulse when recording
- Progress bar fills animated on load
- Badge unlock: pop + confetti micro-animation
- Streak flame: subtle flicker animation

## Tone in UI Copy
- Encouraging: "Great job!", "You're improving!", "Keep it up!"
- Never shaming: Never say "Wrong" — say "Nice try! Here's a tip:"
- Conversational: Short sentences. Active voice.
- Motivating: Frame everything as progress, not failure.

## Layout Principles
- Dashboard-first: User sees progress immediately on login
- Quick-start prominent: Scenario tiles and daily challenge above the fold
- Scores visible but not anxiety-inducing: Shown with context ("Up 5 points this week")
- Mobile-first design, responsive desktop layout
