import { useState, useCallback } from "react";

export interface TurnData {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface SessionData {
  _id: string;
  scenarioId: string;
  scenarioTitle: string;
  turns: TurnData[];
  status: "active" | "completed";
  pronunciationFeedback?: { score?: number; tip?: string };
  grammarFeedback?: { score?: number; corrections?: string[] };
  learnedWords?: Array<{ word: string; definition?: string }>;
  durationSeconds?: number;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = useCallback(async (scenarioId: string, scenarioTitle: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/speakflow/sessions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId, scenarioTitle }),
      });
      const json = await res.json();
      if (json.success) {
        setSession(json.data);
        return json.data as SessionData;
      }
      throw new Error(json.message ?? "Failed to start session");
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTurn = useCallback(async (sessionId: string, role: "user" | "assistant", content: string) => {
    try {
      const res = await fetch(`/api/speakflow/sessions/${sessionId}/turns`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, content }),
      });
      const json = await res.json();
      if (json.success) setSession(json.data);
      return json.data as SessionData;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const completeSession = useCallback(async (
    sessionId: string,
    data: {
      pronunciationScore?: number;
      pronunciationTip?: string;
      grammarScore?: number;
      grammarCorrections?: string[];
      learnedWords?: Array<{ word: string; definition?: string }>;
      durationSeconds?: number;
    }
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/speakflow/sessions/${sessionId}/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) setSession(json.data);
      return json.data as SessionData;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async (limit = 10) => {
    try {
      const res = await fetch(`/api/speakflow/sessions/history?limit=${limit}`, { credentials: "include" });
      const json = await res.json();
      return json.success ? (json.data as SessionData[]) : [];
    } catch {
      return [];
    }
  }, []);

  return { session, setSession, loading, error, startSession, addTurn, completeSession, loadHistory };
}
