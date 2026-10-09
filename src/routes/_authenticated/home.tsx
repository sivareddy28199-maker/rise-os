import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Target, ChevronRight, CheckCircle2, Flame, Clock, BarChart3, Lightbulb, CalendarDays, Plus } from "lucide-react";
import { dashboardQuery, useRiseMutation } from "@/services/dashboard";
import { habitsApi } from "@/services/routines";
import { greet, todayLabel, fmtDuration, fmtRange, pct } from "@/lib/format";
import { Card, IconTile, SectionHeader, StatCard, LoadingState, ErrorState } from "@/components/rise/ui";
import { StudyTimer } from "@/components/rise/StudyTimer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Home — Rise OS" }, { name: "description", content: "Your daily focus, tasks, habits and study progress." }, { property: "og:title", content: "Home — Rise OS" }, { property: "og:description", content: "Your daily focus, tasks, habits and study progress." }] }),
  component: Home,
});

function Home() {
  const { data: d, isLoading, error, refetch } = useQuery(dashboardQuery);
  const toggleHabit = useRiseMutation(habitsApi.toggleToday);
  if (isLoading) return <LoadingState text="Loading your day..." />;
  if (error || !d) return <ErrorState onRetry={() => refetch()} />;

  const name = d.profile?.name || "there";
  const tasks = d.tasks_today;
  const doneTasks = tasks.filter((t) => t.status === "completed").length;
  const doneHabits = d.habits.filter((h) => h.done_today).length;
  const pending = [...d.tasks_overdue, ...tasks.filter((t) => t.status === "pending")];
  const nowHm = new Date().toTimeString().slice(0, 5);
  const next = tasks.find((t) => t.status === "pending" && (t.end_time ?? t.start_time ?? "23:59") >= nowHm) ?? pending[0];
  const rec = d.recommendation;
  const focusTitle = next?.title ?? (rec.topic ? `Practice ${rec.topic}` : "Take the Daily Quiz");
  const focusText = next ? (d.tasks_overdue.includes(next) ? "Overdue — clear it first." : "Stay consistent. You've got this!") : rec.action;
  const progress = pct(doneTasks + doneHabits, tasks.length + d.habits.length);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 pt-1">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{greet()}</p>
          <h1 className="truncate text-[26px] font-extrabold leading-tight tracking-tight">{name}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Let's make today productive.</p>
        </div>
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium"><CalendarDays className="size-3.5 text-muted-foreground" aria-hidden />{todayLabel()}</span>
      </div>

      <Link to={next ? "/routines" : "/quiz"} search={next ? undefined : rec.topic_id ? { mode: "practice", topic: rec.topic_id, count: 15 } : { mode: "daily" }}
        className="flex items-center gap-3 rounded-2xl p-4 text-primary-foreground shadow-[0_12px_28px_-14px_var(--tone-violet)]" style={{ background: "var(--gradient-focus)" }}>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground/20"><Target className="size-6" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs opacity-85">Today's Focus</p>
          <p className="truncate text-lg font-bold leading-tight">{focusTitle}</p>
          <p className="truncate text-xs opacity-85">{focusText}</p>
        </div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/25"><ChevronRight className="size-4" aria-hidden /></span>
      </Link>

      <div className="grid grid-cols-4 gap-2.5">
        <StatCard icon={CheckCircle2} t="mint" value={`${doneTasks}/${tasks.length}`} label="Tasks" />
        <StatCard icon={Flame} t="orange" value={`${doneHabits}/${d.habits.length}`} label="Habits" />
        <StatCard icon={Clock} t="blue" value={fmtDuration(d.study_today_seconds)} label="Study" />
        <StatCard icon={BarChart3} t="violet" value={`${progress}%`} label="Progress" />
      </div>

      <Card>
        <SectionHeader title="Next Task" />
        {next ? (
          <div className="flex items-center gap-3">
            <IconTile icon={CalendarDays} t="rose" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{next.title}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" aria-hidden />{fmtRange(next.start_time, next.end_time)}</p>
            </div>
            <StudyTimer active={d.active_session} taskId={next.id} />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="flex-1 text-sm text-muted-foreground">No pending tasks for today.</p>
            {d.active_session ? <StudyTimer active={d.active_session} taskId={null} /> : <Link to="/routines" className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><Plus className="size-4" />Add task</Link>}
          </div>
        )}
      </Card>

      <Link to="/quiz" search={rec.topic_id ? { mode: "practice", topic: rec.topic_id, count: 15 } : { mode: "daily" }} className="flex items-center gap-3 rounded-2xl border bg-accent/50 p-4">
        <IconTile icon={Lightbulb} t="amber" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">AI Recommendation</p>
          <p className="text-xs text-muted-foreground">{rec.topic ? `Focus on ${rec.topic} today. ${rec.reason}` : rec.reason} {rec.action}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>

      <Card>
        <SectionHeader title="Today's Routine" action="View all" to="/routines" />
        {d.habits.length ? d.habits.slice(0, 3).map((h) => (
          <button key={h.id} type="button" disabled={toggleHabit.isPending} onClick={() => toggleHabit.mutate({ id: h.id, done: h.done_today, today: d.today })}
            aria-pressed={h.done_today} className="flex w-full items-center gap-3 py-1.5 text-left">
            <CheckCircle2 className={cn("size-6 shrink-0", h.done_today ? "fill-tone-mint text-card" : "text-input")} aria-hidden />
            <p className={cn("flex-1 text-sm font-semibold", h.done_today && "text-muted-foreground")}>{h.name}</p>
            <span className="text-xs text-muted-foreground">{h.streak}d</span>
          </button>
        )) : <p className="py-1 text-sm text-muted-foreground">No habits yet. <Link to="/routines" className="font-semibold text-primary">Add one</Link></p>}
      </Card>
    </div>
  );
}
