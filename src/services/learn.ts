import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { must } from "./dashboard";

export type Note = { id: string; title: string; content: string; subject_id: string | null; topic_id: string | null; updated_at: string };

export const notesQuery = (search: string) =>
  queryOptions({
    queryKey: ["notes", search],
    queryFn: async () => {
      let q = supabase.from("notes").select("id, title, content, subject_id, topic_id, updated_at").order("updated_at", { ascending: false }).limit(50);
      const s = search.trim().replace(/[%,()]/g, " ");
      if (s) q = q.or(`title.ilike.%${s}%,content.ilike.%${s}%`);
      return (await must(q)) as Note[];
    },
  });

export const notesApi = {
  save: (n: { id?: string; title: string; content: string; topic_id: string | null; subject_id: string | null }) => {
    if (!n.title.trim()) throw new Error("check constraint");
    const row = { title: n.title.trim(), content: n.content, topic_id: n.topic_id, subject_id: n.subject_id };
    return n.id ? must(supabase.from("notes").update(row).eq("id", n.id)) : must(supabase.from("notes").insert(row));
  },
  remove: (id: string) => must(supabase.from("notes").delete().eq("id", id)),
};

export const questionSearchQuery = (search: string) =>
  queryOptions({
    queryKey: ["question-search", search],
    enabled: search.trim().length >= 3,
    queryFn: async () => {
      const s = search.trim().replace(/[%,()]/g, " ");
      return must(supabase.from("questions").select("id, question, topic_id, subject_id").ilike("question", `%${s}%`).limit(5));
    },
  });

export type QuizMode = "daily_quiz" | "mock" | "practice";
export type QuizQuestion = { id: string; subject: string; topic: string; question: string; options: string[]; difficulty: string };
export type QuizPayload = { session_id: string; test_type: QuizMode; title: string; started_at: string; expires_at: string; server_now: string; questions: QuizQuestion[] };
export type ReviewItem = { question_id: string; question: string; subject: string; topic: string; options: string[]; selected: string | null; correct_answer: string; explanation: string };
export type Attempt = {
  id: string; title: string; test_type: string; score: number; total_marks: number; total_questions: number;
  correct: number; wrong: number; skipped: number; accuracy: number; time_taken: number;
  subject_breakdown: { subject: string; total: number; correct: number; wrong: number; score: number }[];
  review: ReviewItem[];
};

export const quizApi = {
  start: async (p: { mode: QuizMode; subject?: string | undefined; topic?: string | undefined; difficulty?: string | undefined; count?: number | undefined }) => {
    const data = await must(supabase.rpc("start_quiz", {
      p_type: p.mode, p_subject: p.subject ?? undefined, p_topic: p.topic ?? undefined, p_difficulty: p.difficulty ?? undefined, p_count: p.count ?? 10,
    }));
    return data as unknown as QuizPayload;
  },
  submit: async (p: { session: string; answers: { question_id: string; selected: string }[] }) => {
    const data = (await must(supabase.rpc("submit_quiz", { p_session: p.session, p_answers: p.answers }))) as unknown as { attempt_id?: string; error?: string };
    if (data.error === "expired") throw new Error("expired");
    return data.attempt_id!;
  },
  attempt: async (id: string) =>
    (await must(supabase.from("test_attempts").select("id, title, test_type, score, total_marks, total_questions, correct, wrong, skipped, accuracy, time_taken, subject_breakdown, review").eq("id", id).single())) as unknown as Attempt,
};
