import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, jsonSchema, stepCountIs, type ModelMessage } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type DB = SupabaseClient<Database>;
export type MaxLink = { mode: "daily" | "mock" | "practice"; topic?: string; subject?: string; difficulty?: string; count?: number };
export type MaxAction = { title: string; detail: string; link?: MaxLink };
export type MaxReply = { reply: string; actions: MaxAction[]; error?: string };

const RUN_ID = "X-Lovable-AIG-Run-ID";
function runIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
    const res = await fetch(input, { ...init, headers });
    runId ??= res.headers.get(RUN_ID)?.trim() || undefined;
    return res;
  };
}

// ---- date helpers (India time, matches the database) ----
const istToday = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
const addDays = (d: string, n: number) => { const x = new Date(`${d}T00:00:00Z`); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
export function resolveDate(input: string | null | undefined, today = istToday()): string | null {
  const v = (input ?? "").trim().toLowerCase();
  if (!v || v === "today") return today;
  if (v === "tomorrow") return addDays(today, 1);
  if (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))) return v;
  return null;
}
export const validTime = (s: string | null | undefined) => (s && /^([01]\d|2[0-3]):[0-5]\d$/.test(s) ? s : null);
const like = (s: string) => `%${s.trim().replace(/[%_,()]/g, " ")}%`;

const obj = <T,>(properties: Record<string, unknown>) =>
  jsonSchema<T>({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });
const S = { type: "string" }, NS = { type: ["string", "null"] }, NN = { type: ["number", "null"] };

function buildTools(db: DB, actions: MaxAction[]) {
  const today = istToday();
  const dashboard = async () => {
    const { data, error } = await db.rpc("get_dashboard");
    if (error) throw error;
    return data as Record<string, unknown>;
  };
  const fail = (message: string) => ({ ok: false, message });

  return {
    create_task: tool({
      description: "Create a task for the user. date is 'today', 'tomorrow' or YYYY-MM-DD. Times are 24h HH:MM. If the user gave no time use 09:00.",
      inputSchema: obj<{ title: string; date: string | null; start_time: string | null; end_time: string | null; category: "study" | "personal" | "other" }>({
        title: S, date: NS, start_time: NS, end_time: NS, category: { type: "string", enum: ["study", "personal", "other"] },
      }),
      execute: async (a) => {
        const title = a.title.trim().slice(0, 200);
        const date = resolveDate(a.date, today);
        if (!title) return fail("Title is required.");
        if (!date) return fail("Could not understand the date.");
        const start = validTime(a.start_time) ?? "09:00";
        let end = validTime(a.end_time);
        if (end && end <= start) end = null;
        const { data: dup } = await db.from("tasks").select("id").eq("scheduled_date", date).eq("status", "pending").ilike("title", title).limit(1);
        if (dup?.length) return { ok: true, duplicate: true, message: "A matching task already exists; nothing was added." };
        const { error } = await db.from("tasks").insert({ title, scheduled_date: date, start_time: start, end_time: end, category: a.category, source: "ai" });
        if (error) { console.error(error); return fail("Could not save the task."); }
        const when = date === today ? "Today" : date === addDays(today, 1) ? "Tomorrow" : date;
        actions.push({ title: `Added task: ${title}`, detail: `${when}, ${start}${end ? `–${end}` : ""}` });
        return { ok: true, date, start_time: start };
      },
    }),
    complete_task: tool({
      description: "Mark the user's pending task as completed by (part of) its title.",
      inputSchema: obj<{ title: string }>({ title: S }),
      execute: async ({ title }) => {
        const { data } = await db.from("tasks").select("id, title").eq("status", "pending").ilike("title", like(title)).order("scheduled_date").limit(1);
        const t = data?.[0];
        if (!t) return fail("No pending task matches that title.");
        const { error } = await db.from("tasks").update({ status: "completed" }).eq("id", t.id);
        if (error) return fail("Could not update the task.");
        actions.push({ title: `Completed: ${t.title}`, detail: "Marked as done" });
        return { ok: true };
      },
    }),
    create_habit: tool({
      description: "Create a new daily habit.",
      inputSchema: obj<{ name: string }>({ name: S }),
      execute: async ({ name }) => {
        const n = name.trim().slice(0, 120);
        if (!n) return fail("Name is required.");
        const { data: dup } = await db.from("habits").select("id").eq("active", true).ilike("name", n).limit(1);
        if (dup?.length) return { ok: true, duplicate: true, message: "This habit already exists." };
        const { error } = await db.from("habits").insert({ name: n });
        if (error) return fail("Could not save the habit.");
        actions.push({ title: `Added habit: ${n}`, detail: "Daily" });
        return { ok: true };
      },
    }),
    complete_habit: tool({
      description: "Mark one of the user's habits as done for today.",
      inputSchema: obj<{ name: string }>({ name: S }),
      execute: async ({ name }) => {
        const { data } = await db.from("habits").select("id, name").eq("active", true).ilike("name", like(name)).limit(1);
        const h = data?.[0];
        if (!h) return fail("No habit matches that name.");
        const { error } = await db.from("habit_logs").upsert({ habit_id: h.id, log_date: today, completed: true }, { onConflict: "habit_id,log_date" });
        if (error) return fail("Could not update the habit.");
        actions.push({ title: `Done today: ${h.name}`, detail: "Habit completed" });
        return { ok: true };
      },
    }),
    create_goal: tool({
      description: "Create a goal. target_value defaults to 100 (percent) when not given. deadline is YYYY-MM-DD or null.",
      inputSchema: obj<{ title: string; target_value: number | null; unit: string | null; deadline: string | null }>({ title: S, target_value: NN, unit: NS, deadline: NS }),
      execute: async (a) => {
        const title = a.title.trim().slice(0, 200);
        const target = a.target_value && a.target_value > 0 ? a.target_value : 100;
        if (!title) return fail("Title is required.");
        const deadline = a.deadline ? resolveDate(a.deadline, today) : null;
        const { error } = await db.from("goals").insert({ title, target_value: target, unit: a.unit?.trim() || (a.target_value ? null : "%"), deadline });
        if (error) return fail("Could not save the goal.");
        actions.push({ title: `Added goal: ${title}`, detail: `Target ${target}${a.unit ? ` ${a.unit}` : ""}${deadline ? ` by ${deadline}` : ""}` });
        return { ok: true };
      },
    }),
    update_goal: tool({
      description: "Set the current progress value of one of the user's goals.",
      inputSchema: obj<{ title: string; current_value: number }>({ title: S, current_value: { type: "number" } }),
      execute: async ({ title, current_value }) => {
        const { data } = await db.from("goals").select("id, title, target_value").neq("status", "archived").ilike("title", like(title)).limit(1);
        const g = data?.[0];
        if (!g || current_value < 0) return fail("No goal matches that title.");
        const { error } = await db.from("goals").update({ current_value, status: current_value >= Number(g.target_value) ? "completed" : "active" }).eq("id", g.id);
        if (error) return fail("Could not update the goal.");
        actions.push({ title: `Updated goal: ${g.title}`, detail: `${current_value} / ${g.target_value}` });
        return { ok: true };
      },
    }),
    start_study_session: tool({
      description: "Start a study timer for the user.",
      inputSchema: obj<Record<string, never>>({}),
      execute: async () => {
        const { data: open } = await db.from("study_sessions").select("id").is("ended_at", null).limit(1);
        if (open?.length) return { ok: true, message: "A study session is already running." };
        const { error } = await db.from("study_sessions").insert({ session_type: "study" });
        if (error) return fail("Could not start the session.");
        actions.push({ title: "Study session started", detail: "Stop it from Home when you're done" });
        return { ok: true };
      },
    }),
    end_study_session: tool({
      description: "Stop the user's running study timer.",
      inputSchema: obj<Record<string, never>>({}),
      execute: async () => {
        const { data: open } = await db.from("study_sessions").select("id").is("ended_at", null).limit(1);
        if (!open?.length) return fail("No study session is running.");
        const { data, error } = await db.from("study_sessions").update({ ended_at: new Date().toISOString() }).eq("id", open[0]!.id).select("duration_seconds").single();
        if (error) return fail("Could not stop the session.");
        actions.push({ title: "Study session saved", detail: `${Math.round((data?.duration_seconds ?? 0) / 60)} minutes` });
        return { ok: true, minutes: Math.round((data?.duration_seconds ?? 0) / 60) };
      },
    }),
    get_today_plan: tool({
      description: "Read today's tasks, overdue tasks, upcoming tasks, habits, goals and the data-based recommendation. Use before planning the day.",
      inputSchema: obj<Record<string, never>>({}),
      execute: async () => {
        const d = await dashboard();
        return { today: d["today"], tasks_today: d["tasks_today"], tasks_overdue: d["tasks_overdue"], tasks_upcoming: d["tasks_upcoming"], habits: d["habits"], goals: d["goals"], recommendation: d["recommendation"], study_today_seconds: d["study_today_seconds"] };
      },
    }),
    get_progress: tool({
      description: "Read the user's progress: study time, streaks, task/habit/goal completion, practice accuracy and recent tests.",
      inputSchema: obj<Record<string, never>>({}),
      execute: async () => {
        const d = await dashboard();
        const keys = ["study_week_seconds", "weekly", "streak", "longest_streak", "tasks_week", "habits_week", "goals_summary", "practice", "recent_tests"];
        return Object.fromEntries(keys.map((k) => [k, d[k]]));
      },
    }),
    get_weak_topics: tool({
      description: "Read the user's weakest topics (lowest accuracy, at least 3 attempts) and the recommendation.",
      inputSchema: obj<Record<string, never>>({}),
      execute: async () => { const d = await dashboard(); return { weak_topics: d["weak_topics"], recommendation: d["recommendation"] }; },
    }),
    generate_practice: tool({
      description: "Prepare a practice set from the question bank. topic and subject are names or null; difficulty easy|medium|hard or null; count 1-50.",
      inputSchema: obj<{ topic: string | null; subject: string | null; difficulty: string | null; count: number | null }>({ topic: NS, subject: NS, difficulty: NS, count: NN }),
      execute: async (a) => {
        const count = Math.max(1, Math.min(50, Math.round(a.count ?? 10)));
        const difficulty = a.difficulty && ["easy", "medium", "hard"].includes(a.difficulty) ? a.difficulty : undefined;
        let topic: { id: string; name: string } | undefined;
        let subject: { id: string; name: string } | undefined;
        if (a.topic) topic = (await db.from("topics").select("id, name").ilike("name", like(a.topic)).limit(1)).data?.[0];
        if (!topic && a.subject) subject = (await db.from("subjects").select("id, name").or(`name.ilike.${like(a.subject)},short_name.ilike.${like(a.subject)}`).limit(1)).data?.[0];
        if (a.topic && !topic) return fail(`There is no topic called "${a.topic}" in the question bank.`);
        let q = db.from("questions").select("id", { count: "exact", head: true });
        if (topic) q = q.eq("topic_id", topic.id);
        if (subject) q = q.eq("subject_id", subject.id);
        if (difficulty) q = q.eq("difficulty", difficulty);
        const { count: available } = await q;
        if (!available) return fail("No questions match that selection yet.");
        const n = Math.min(count, available);
        const name = topic?.name ?? subject?.name ?? "Mixed";
        actions.push({
          title: `Practice ready: ${name}`, detail: `${n} questions${difficulty ? ` • ${difficulty}` : ""}`,
          link: { mode: "practice", count: n, ...(topic ? { topic: topic.id } : {}), ...(subject ? { subject: subject.id } : {}), ...(difficulty ? { difficulty } : {}) },
        });
        return { ok: true, questions: n, available, note: available < count ? `Only ${available} questions are available.` : undefined };
      },
    }),
    generate_quiz: tool({
      description: "Offer the user today's Daily Quiz or the full mock test.",
      inputSchema: obj<{ kind: "daily" | "mock" }>({ kind: { type: "string", enum: ["daily", "mock"] } }),
      execute: async ({ kind }) => {
        actions.push({ title: kind === "mock" ? "Full Mock Test" : "Today's Daily Quiz", detail: "Timed • +2 correct, −0.5 wrong", link: { mode: kind } });
        return { ok: true };
      },
    }),
  };
}

export async function runMax(db: DB, name: string, messages: { role: "user" | "assistant"; content: string }[]): Promise<MaxReply> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { reply: "", actions: [], error: "Max isn't configured yet. The AI service key is missing." };
  const actions: MaxAction[] = [];
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch(),
  });
  const today = istToday();
  const instructions = `You are Max, the assistant inside Rise OS, a study and productivity app for SSC CGL aspirants.
The student's name is ${name || "the student"}. Today is ${today} (${new Date(`${today}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })}, India time).
Rules:
- To change anything (tasks, habits, goals, study timer) you MUST call a tool. Never claim something was saved unless the tool returned ok: true. If a tool fails, say so plainly.
- Before recommending what to study, planning the day or describing progress, read the real data with get_today_plan, get_progress or get_weak_topics. Never invent numbers.
- When asked to plan the day: read get_today_plan first, then reply with three short sections "Morning", "Afternoon", "Evening". Each has 2-4 timed lines covering study, revision, practice, exercise and breaks, built around the existing tasks and the weakest topic. Keep it realistic (no more than ~6 hours of study). Do not create tasks unless asked.
- For practice questions use generate_practice (it uses the verified question bank); for quizzes use generate_quiz.
- You can explain SSC CGL topics (Quant, Reasoning, English, General Awareness) directly with short worked examples.
- Be concise and practical. Plain text with short bullet lines; no markdown headings or tables.`;
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      instructions,
      messages: messages as ModelMessage[],
      tools: buildTools(db, actions),
      stopWhen: stepCountIs(8),
      maxRetries: 0,
      providerOptions: {
        openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
      },
    });
    const reply = await result.text;
    return { reply: reply.trim() || (actions.length ? "Done." : "I couldn't come up with an answer. Please try rephrasing."), actions };
  } catch (e) {
    console.error("[max] AI call failed", e);
    const status = (e as { statusCode?: number })?.statusCode;
    const error =
      status === 402 ? "Max has run out of AI credits for this workspace. Add credits to keep chatting."
      : status === 429 ? "Max is getting a lot of requests. Please wait a minute and try again."
      : status === 403 ? "Max isn't available for this workspace right now."
      : "Max couldn't answer right now. Please try again.";
    return { reply: "", actions, error };
  }
}
