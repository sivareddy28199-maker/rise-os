import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Q = {
  id: string; subject_id: string; topic_id: string; subject_name: string; topic_name: string;
  question: string; option_a: string; option_b: string; option_c: string; option_d: string; difficulty: string;
};
export type Stats = {
  total: number; correct: number; today: number; streak: number; tests: number; best_accuracy: number;
  today_by_subject: Record<string, number>;
  weekly: { day: string; count: number }[];
  last_topic: null | { topic_id: string; topic: string; subject: string; subject_slug: string; topic_slug: string; progress: number };
};
export type Notes = { concept?: string; formulas?: string[]; shortcuts?: string[]; example?: string; mistakes?: string[]; revision?: string[] };

async function ok<T>(p: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw error;
  return data as T;
}

export const statsQuery = queryOptions({
  queryKey: ["stats"],
  queryFn: async () => (await ok(supabase.rpc("get_my_stats"))) as unknown as Stats,
});
export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    return ok(supabase.from("profiles").select("*").eq("id", u.user!.id).single());
  },
});
export const subjectsQuery = queryOptions({
  queryKey: ["subjects"],
  staleTime: 5 * 60_000,
  queryFn: () => ok(supabase.from("subjects").select("*, topics(id, slug, name, sort_order)").order("sort_order")),
});
export const progressQuery = queryOptions({
  queryKey: ["progress"],
  queryFn: () => ok(supabase.from("study_progress").select("*")),
});
export const topicQuery = (slug: string) =>
  queryOptions({
    queryKey: ["topic", slug],
    queryFn: () => ok(supabase.from("topics").select("*, subjects(name, slug)").eq("slug", slug).single()),
  });
export const questionCountsQuery = queryOptions({
  queryKey: ["qcounts"],
  staleTime: 5 * 60_000,
  queryFn: async () => {
    const rows = await ok(supabase.from("questions").select("topic_id, difficulty"));
    const m: Record<string, number> = {};
    rows.forEach((r) => (m[r.topic_id] = (m[r.topic_id] ?? 0) + 1));
    return m;
  },
});
export const testHistoryQuery = queryOptions({
  queryKey: ["tests-history"],
  queryFn: () =>
    ok(supabase.from("test_attempts").select("id, title, test_type, score, total_marks, accuracy, completed_at").order("completed_at", { ascending: false }).limit(20)),
});
export const caQuery = queryOptions({
  queryKey: ["ca"],
  queryFn: () => ok(supabase.from("current_affairs").select("*").order("date", { ascending: false }).limit(100)),
});
export const articlesQuery = queryOptions({
  queryKey: ["articles"],
  queryFn: () => ok(supabase.from("articles").select("id, slug, title, summary, category, read_minutes, published_at").order("published_at", { ascending: false })),
});
export const bookmarksQuery = queryOptions({
  queryKey: ["bookmarks"],
  queryFn: () => ok(supabase.from("bookmarks").select("question_id")),
});

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
};
export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
