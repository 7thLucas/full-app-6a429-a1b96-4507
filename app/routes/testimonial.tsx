import { Link } from "react-router";
import { useState } from "react";
import { useConfigurables } from "~/modules/configurables";

const LOGO_URL =
  "https://client-api-stag.quantumbyte.ai/uploads/gz098zml/4507/assets/a9ea1d09-3370-4012-bf5b-b3519af1e4c5_1782747880236_xvqj69.png";

const REVIEWS = [
  {
    id: 1,
    name: "Maria Santos",
    rating: 5,
    topic: "pronunciation",
    quote:
      "After two months of daily sessions my accent improved so much that my colleagues started asking where I learned English. The pronunciation feedback after every turn was the game-changer.",
  },
  {
    id: 2,
    name: "Kenji Tanaka",
    rating: 5,
    topic: "interviews",
    quote:
      "I practiced job-interview scenarios every day for a week and landed my first English-speaking role. The AI stayed patient even when I fumbled my words.",
  },
  {
    id: 3,
    name: "Aisha Mensah",
    rating: 4,
    topic: "travel",
    quote:
      "Traveled through Europe and handled every airport and hotel conversation confidently. The travel scenario drills are incredibly realistic.",
  },
  {
    id: 4,
    name: "Dmitri Volkov",
    rating: 5,
    topic: "business",
    quote:
      "My business English went from shaky to boardroom-ready in three months. The grammar coaching never feels condescending — it just shows you a better way.",
  },
  {
    id: 5,
    name: "Priya Sharma",
    rating: 4,
    topic: "pronunciation",
    quote:
      "The streak system kept me honest — I haven't missed a day in 60 days. My pronunciation score jumped from 58 to 81.",
  },
  {
    id: 6,
    name: "Lucas Ferreira",
    rating: 5,
    topic: "business",
    quote:
      "I presented in English for the first time at a conference last month. Six months ago that would have been unthinkable. This app rebuilt my confidence from the ground up.",
  },
];

const TOPICS = ["all", "pronunciation", "business", "interviews", "travel"];

const FEATURED = {
  name: "Yuki Nakamura",
  photo:
    "https://api-stag.qb-deck.quantumbyte.ai/common/image-generation?prompt=Confident%20young%20Japanese%20woman%20smiling%20warmly%2C%20professional%20headshot%2C%20clean%20background%2C%20vibrant%20and%20welcoming",
  rating: 5,
  quote:
    "I moved to Canada for grad school speaking maybe 60% of what I needed to. Within four months of daily speaking sessions — food ordering, presentations, small talk — I was the one other students came to for help with English. The non-interruptive feedback was everything. I never felt embarrassed. I just kept improving, one session at a time.",
  achievement: "Grammar score 91 · Pronunciation 87 · 120-day streak",
};

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < count ? "#F59E0B" : "var(--border)" }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function TestimonialPage() {
  const { config } = useConfigurables();
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [topicFilter, setTopicFilter] = useState("all");

  const filtered = REVIEWS.filter((r) => {
    const ratingOk = ratingFilter === null || r.rating === ratingFilter;
    const topicOk = topicFilter === "all" || r.topic === topicFilter;
    return ratingOk && topicOk;
  });

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* ── Top Banner ─────────────────────────────────────── */}
      <header
        className="w-full py-16 px-6 text-center flex flex-col items-center gap-4"
        style={{
          background: `linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)`,
        }}
      >
        <img src={LOGO_URL} alt={config?.appName ?? "App logo"} className="w-16 h-16 rounded-2xl shadow-lg" />
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ color: "var(--primary-foreground)", fontFamily: `${config?.font?.headingFont ?? "Plus Jakarta Sans"}, sans-serif` }}
        >
          Real learners. Real results.
        </h1>
        <p
          className="text-lg max-w-xl"
          style={{ color: "rgba(255,255,255,0.85)", fontFamily: `${config?.font?.textFont ?? "Inter"}, sans-serif` }}
        >
          Thousands of people have already found their English-speaking confidence with{" "}
          {config?.appName ?? "SpeakEasy AI"}. Here's what they say.
        </p>
      </header>

      {/* ── Quick Numbers Bar ──────────────────────────────── */}
      <div
        className="w-full py-4 flex flex-wrap justify-center gap-8 text-center"
        style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}
      >
        {[
          { label: "Total Reviews", value: "2,840+" },
          { label: "Average Rating", value: `⭐ ${avgRating} / 5` },
          { label: "Active Learners", value: "18,000+" },
          { label: "Sessions Completed", value: "240,000+" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span
              className="text-2xl font-black"
              style={{ color: "var(--primary)", fontFamily: `${config?.font?.headingFont ?? "Plus Jakarta Sans"}, sans-serif` }}
            >
              {stat.value}
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-6 py-14 flex flex-col gap-14">

        {/* ── Featured Story ─────────────────────────────────── */}
        <section>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "var(--primary)" }}
          >
            Featured Story · Updated weekly
          </p>
          <div
            className="rounded-3xl overflow-hidden grid md:grid-cols-2 gap-0 shadow-md"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <img
              src={FEATURED.photo}
              alt={FEATURED.name}
              className="w-full h-64 md:h-auto object-cover"
            />
            <div className="p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <Stars count={FEATURED.rating} />
                <blockquote
                  className="text-base leading-relaxed italic"
                  style={{ color: "var(--foreground)", fontFamily: `${config?.font?.textFont ?? "Inter"}, sans-serif` }}
                >
                  "{FEATURED.quote}"
                </blockquote>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-bold" style={{ color: "var(--foreground)" }}>
                  {FEATURED.name}
                </p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {FEATURED.achievement}
                </p>
                <Link
                  to="/progress"
                  className="mt-2 text-xs font-semibold underline underline-offset-2"
                  style={{ color: "var(--primary)" }}
                >
                  See what real progress looks like →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Review Cards ───────────────────────────────────── */}
        <section>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Filter:
            </span>
            {/* Rating filter */}
            {[null, 5, 4].map((r) => (
              <button
                key={r ?? "all-ratings"}
                onClick={() => setRatingFilter(r)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: ratingFilter === r ? "var(--primary)" : "var(--muted)",
                  color: ratingFilter === r ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                {r === null ? "All ratings" : `${r}★`}
              </button>
            ))}
            <span className="w-px h-4 mx-1" style={{ backgroundColor: "var(--border)" }} />
            {/* Topic filter */}
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                className="px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors"
                style={{
                  backgroundColor: topicFilter === t ? "var(--accent)" : "var(--muted)",
                  color: topicFilter === t ? "var(--accent-foreground)" : "var(--muted-foreground)",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-12" style={{ color: "var(--muted-foreground)" }}>
              No reviews match that filter.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <Stars count={review.rating} />
                  <p
                    className="text-sm leading-relaxed flex-1 italic"
                    style={{ color: "var(--foreground)", fontFamily: `${config?.font?.textFont ?? "Inter"}, sans-serif` }}
                  >
                    "{review.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                      {review.name}
                    </p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
                    >
                      {review.topic}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Join CTA ───────────────────────────────────────── */}
        <section
          className="rounded-3xl p-10 text-center flex flex-col items-center gap-6"
          style={{
            background: `linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)`,
          }}
        >
          <h2
            className="text-3xl font-black"
            style={{ color: "var(--primary-foreground)", fontFamily: `${config?.font?.headingFont ?? "Plus Jakarta Sans"}, sans-serif` }}
          >
            Start your own success story
          </h2>
          <p className="max-w-md text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
            {config?.appName ?? "SpeakEasy AI"} is free to try. No credit card. No judgment. Just you, your voice, and an AI coach that's always ready.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/auth/register"
              className="px-6 py-3 rounded-xl font-bold text-sm shadow-md"
              style={{ backgroundColor: "var(--primary-foreground)", color: "var(--primary)" }}
            >
              Create free account
            </Link>
            <Link
              to="/practice"
              className="px-6 py-3 rounded-xl font-bold text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "var(--primary-foreground)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              Try a session →
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
