import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { friendlyError } from "@/lib/format";

export type TaskCategory = "study" | "personal" | "other";
export type TaskRow = {
  id: string; title: string; description: string | null; category: TaskCategory;
  status: "pending" | "completed" | "cancelled"; scheduled_date: string | null;
  start_time: string | null; end_time: string | null; priority: string; source: string;
  completed_at: string | null; created_at: string;
};
export type HabitRow = { id: string; name: string; description: string | null; done_today: boolean; streak: number };
export type GoalRow = { id: string; title: string; description: string | null; target_value: number; current_value: number; unit: string | null; deadline: string | null; status: "active" | "completed" | "archived" };
export type WeakTopic = { topic_id: string; topic: string; subject: string; subject_slug: string; attempts: number; accuracy: number };
export type Recommendation = { topic_id: string | null; topic: string | null; subject: string | null; accuracy: number | null; reason: string; action: string; minutes: number };
export type TestSummary = { id: string; title: string; test_type: string; score: number; total_marks: number; accuracy: number; correct: number; wrong: number; skipped: number; completed_at: string };

export type Dashboard = {
  today: string;
  profile: { name: string; email: string | null; avatar_url: string | null; target_exam: string; target_year: number; study_goal: string | null; local_data_migrated: boolean } | null;
  tasks_today: TaskRow[]; tasks_upcoming: TaskRow[]; tasks_overdue: TaskRow[];
  habits: HabitRow[]; goals: GoalRow[];
  active_session: { id: string; started_at: string; task_id: string | null } | null;
  study_today_seconds: number; study_week_seconds: number;
  weekly: { day: string; seconds: number }[];
  streak: number; longest_streak: number;
  tasks_week: { done: number; total: number };
  habits_week: { done: number; expected: number };
  goals_summary: { done: number; total: number; pct: number };
  practice: { attempted: number; correct: number; week_attempted: number; week_correct: number; prev_attempted: number; prev_correct: number };
  weak_topics: WeakTopic[]; recommendation: Recommendation; recent_tests: TestSummary[];
};

export const dashboardQuery = queryOptions({
  queryKey: ["dashboard"],
  queryFn: async () => {
    const { data, error } = await supabase.rpc("get_dashboard");
    if (error) throw error;
    return data as unknown as Dashboard;
  },
});

/** Wraps a write: shows a friendly error (never a false "saved"), refreshes the dashboard on success. */
export function useRiseMutation<V, R = unknown>(fn: (v: V) => Promise<R>, opts?: { success?: string | ((r: R) => string) }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      const s = typeof opts?.success === "function" ? opts.success(r) : opts?.success;
      if (s) toast.success(s);
    },
    onError: (e) => {
      console.error(e);
      toast.error(friendlyError(e));
    },
  });
}

/** Throws the database error so the mutation reports failure. */
export async function must<T>(p: PromiseLike<{ data: T; error: unknown }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw error;
  return data;
}
