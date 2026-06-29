import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "~/speakflow/hooks/use-session";
import { invokeLLM } from "~/modules/agentic";
import { useConfigurables } from "~/modules/configurables";
import type { TPracticeScenario } from "~/modules/configurables/src/constants/configurables.default";
import { FeedbackCard } from "./feedback-card";

interface VoiceTutorProps {
  scenario: TPracticeScenario;
  onComplete?: () => void;
}

interface TurnFeedback {
  pronunciationTip?: string;
  grammarCorrections?: string[];
  learnedWords?: Array<{ word: string; definition?: string }>;
}

export function VoiceTutor({ scenario, onComplete }: VoiceTutorProps) {
  const { config } = useConfigurables();
  const coachName = config?.aiCoachName ?? "Aria";
  const coachPersona = config?.aiCoachPersona ?? "Patient, encouraging English coach.";
  const enablePronunciation = config?.enablePronunciationFeedback !== false;
  const enableGrammar = config?.enableGrammarCoaching !== false;

  const { session, startSession, addTurn, completeSession, loading } = useSession();

  const [isRecording, setIsRecording] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [feedback, setFeedback] = useState<TurnFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = useCallback(async () => {
    const s = await startSession(scenario.id, scenario.title);
    if (!s) return;
    setIsStarted(true);

    // Initial AI greeting
    setAiLoading(true);
    try {
      const result = await invokeLLM({
        message: `Start a ${scenario.title} conversation practice session. Greet the student warmly.`,
        systemPrompt: `You are ${coachName}, ${coachPersona}. You are conducting a "${scenario.title}" English speaking practice session. Keep responses concise (2-3 sentences max). Be encouraging. This is the beginning of the conversation.`,
        schema: { type: "object", properties: { reply: { type: "string" } }, required: ["reply"] },
      });
      const reply = (result.response as any)?.reply ?? `Hello! Let's practice ${scenario.title} together. I'll play the other role. Ready when you are!`;
      setMessages([{ role: "assistant", content: reply }]);
      await addTurn(s._id, "assistant", reply);
    } catch {
      setMessages([{ role: "assistant", content: `Hi! I'm ${coachName}. Let's practice ${scenario.title}. Go ahead and start!` }]);
    } finally {
      setAiLoading(false);
    }
  }, [scenario, coachName, coachPersona, startSession, addTurn]);

  const sendMessage = useCallback(async (text: string) => {
    if (!session || !text.trim()) return;
    setShowFeedback(false);

    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setUserInput("");
    await addTurn(session._id, "user", userMsg);

    setAiLoading(true);
    try {
      const historyContext = messages.slice(-6).map((m) => `${m.role === "user" ? "Student" : coachName}: ${m.content}`).join("\n");

      const result = await invokeLLM({
        message: `Student said: "${userMsg}"`,
        systemPrompt: `You are ${coachName}, ${coachPersona}. You are conducting a "${scenario.title}" English speaking practice.

Conversation so far:
${historyContext}

Respond naturally in the scenario role (2-3 sentences). After your reply, provide post-turn feedback as a separate JSON block with:
- "reply": your conversational response
- "pronunciationTip": one specific tip if pronunciation could be improved (null if fine)
- "grammarCorrections": array of corrections with format "mistake → correction" (empty array if perfect)
- "newWords": array of objects {word, definition} for any useful vocabulary (empty array if none)

Return ONLY valid JSON matching the schema.`,
        schema: {
          type: "object",
          properties: {
            reply: { type: "string" },
            pronunciationTip: { type: ["string", "null"] },
            grammarCorrections: { type: "array", items: { type: "string" } },
            newWords: {
              type: "array",
              items: {
                type: "object",
                properties: { word: { type: "string" }, definition: { type: "string" } },
                required: ["word"],
              },
            },
          },
          required: ["reply", "grammarCorrections", "newWords"],
        },
      });

      const r = result.response as any;
      const reply = r?.reply ?? "Good try! Let's continue.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      await addTurn(session._id, "assistant", reply);

      // Post-turn feedback (non-interruptive)
      if (enablePronunciation || enableGrammar) {
        const fb: TurnFeedback = {
          pronunciationTip: enablePronunciation ? r?.pronunciationTip ?? undefined : undefined,
          grammarCorrections: enableGrammar ? (r?.grammarCorrections ?? []) : [],
          learnedWords: r?.newWords ?? [],
        };
        const hasFeedback = fb.pronunciationTip || (fb.grammarCorrections?.length ?? 0) > 0 || (fb.learnedWords?.length ?? 0) > 0;
        if (hasFeedback) {
          setFeedback(fb);
          setShowFeedback(true);
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Great! Keep going!" }]);
    } finally {
      setAiLoading(false);
    }
  }, [session, messages, coachName, coachPersona, scenario, addTurn, enablePronunciation, enableGrammar]);

  const handleEndSession = useCallback(async () => {
    if (!session) return;
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    // Get final AI analysis
    let pronunciationScore = 70;
    let grammarScore = 70;
    let learnedWords: Array<{ word: string; definition?: string }> = [];

    try {
      const transcript = messages.map((m) => `${m.role === "user" ? "Student" : "Coach"}: ${m.content}`).join("\n");
      const result = await invokeLLM({
        message: `Analyze this English speaking practice session and provide scores:\n${transcript}`,
        systemPrompt: "You are an English language assessment tool. Analyze the student's messages only.",
        schema: {
          type: "object",
          properties: {
            pronunciationScore: { type: "number", minimum: 0, maximum: 100 },
            grammarScore: { type: "number", minimum: 0, maximum: 100 },
            learnedWords: {
              type: "array",
              items: { type: "object", properties: { word: { type: "string" }, definition: { type: "string" } }, required: ["word"] },
            },
          },
          required: ["pronunciationScore", "grammarScore", "learnedWords"],
        },
      });
      const r = result.response as any;
      if (r?.pronunciationScore) pronunciationScore = r.pronunciationScore;
      if (r?.grammarScore) grammarScore = r.grammarScore;
      if (r?.learnedWords) learnedWords = r.learnedWords;
    } catch {}

    await completeSession(session._id, {
      pronunciationScore,
      grammarScore,
      learnedWords,
      durationSeconds,
    });

    onComplete?.();
  }, [session, messages, startTime, completeSession, onComplete]);

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="text-6xl">{scenario.icon ?? "💬"}</div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{scenario.title}</h2>
          <p className="text-muted-foreground mt-2 max-w-md">{scenario.description}</p>
          {scenario.difficulty && (
            <span className="inline-block mt-3 text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full">
              {scenario.difficulty}
            </span>
          )}
        </div>
        <button
          onClick={handleStart}
          disabled={loading}
          className="mt-4 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Conversation"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card border border-border text-foreground rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" && (
                <p className="text-xs font-semibold text-primary mb-1">{coachName}</p>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Feedback Card (non-interruptive) */}
      {showFeedback && feedback && (
        <FeedbackCard
          feedback={feedback}
          onDismiss={() => setShowFeedback(false)}
        />
      )}

      {/* Input Area */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-3 items-end">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(userInput);
              }
            }}
            placeholder="Type your response... (Enter to send)"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => sendMessage(userInput)}
              disabled={!userInput.trim() || aiLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              Send
            </button>
            <button
              onClick={handleEndSession}
              className="px-4 py-2 bg-card border border-border text-muted-foreground rounded-xl text-sm hover:text-foreground transition-colors"
            >
              End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
