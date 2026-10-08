import { supabase } from "@/lib/supabase";
import { must, type TaskCategory, type TaskRow, type GoalRow } from "./dashboard";

export type TaskInput = { title: string; category: TaskCategory; scheduled_date: string; start_time: string | null; end_time: string | null; description?: string | null };

const clean = (t: TaskInput) => {
  const title = t.title.trim();
  if (!title) throw new Error("check constraint: title required");
  if (t.start_time && t.end_time && t.end_time <= t.start_time) throw new Error("check constraint: end before start");
  return { ...t, title, start_time: t.start_time || null, end_time: t.end_time || null };
};

export const tasksApi = {
  create: (t: TaskInput) => must(supabase.from("tasks").insert(clean(t)).select("id").single()),
  update: ({ id, ...t }: TaskInput & { id: string }) => must(supabase.from("tasks").update(clean(t)).eq("id", id).select("id").single()),
  setStatus: ({ id, status }: { id: string; status: TaskRow["status"] }) => must(supabase.from("tasks").update({ status }).eq("id", id).select("id").single()),
  reschedule: ({ id, date }: { id: string; date: string }) => must(supabase.from("tasks").update({ scheduled_date: date }).eq("id", id).select("id").single()),
  remove: (id: string) => must(supabase.from("tasks").delete().eq("id", id)),
};

export const habitsApi = {
  create: ({ name, description }: { name: string; description?: string }) => {
    if (!name.trim()) throw new Error("check constraint");
    return must(supabase.from("habits").insert({ name: name.trim(), description: description?.trim() || null }).select("id").single());
  },
  rename: ({ id, name }: { id: string; name: string }) => must(supabase.from("habits").update({ name: name.trim() }).eq("id", id).select("id").single()),
  archive: (id: string) => must(supabase.from("habits").update({ active: false }).eq("id", id).select("id").single()),
  toggleToday: ({ id, done, today }: { id: string; done: boolean; today: string }) =>
    done
      ? must(supabase.from("habit_logs").delete().eq("habit_id", id).eq("log_date", today))
      : must(supabase.from("habit_logs").upsert({ habit_id: id, log_date: today, completed: true, completed_at: new Date().toISOString() }, { onConflict: "habit_id,log_date" })),
};

export type GoalInput = { title: string; target_value: number; current_value: number; unit: string | null; deadline: string | null };
const cleanGoal = (g: GoalInput) => {
  if (!g.title.trim() || !(g.target_value > 0) || g.current_value < 0) throw new Error("check constraint");
  return { ...g, title: g.title.trim(), unit: g.unit?.trim() || null, deadline: g.deadline || null };
};

export const goalsApi = {
  create: (g: GoalInput) => must(supabase.from("goals").insert(cleanGoal(g)).select("id").single()),
  update: ({ id, ...g }: GoalInput & { id: string }) =>
    must(supabase.from("goals").update({ ...cleanGoal(g), status: g.current_value >= g.target_value ? "completed" : "active" }).eq("id", id).select("id").single()),
  setStatus: ({ id, status }: { id: string; status: GoalRow["status"] }) => must(supabase.from("goals").update({ status }).eq("id", id).select("id").single()),
};

export const studyApi = {
  start: (task_id: string | null) => must(supabase.from("study_sessions").insert({ task_id, session_type: "study" }).select("id").single()),
  stop: (id: string) => must(supabase.from("study_sessions").update({ ended_at: new Date().toISOString() }).eq("id", id).select("duration_seconds").single()),
};
