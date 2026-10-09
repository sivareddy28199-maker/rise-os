import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, CalendarDays, BookOpen, Dumbbell, Droplets, Sparkles } from "lucide-react";
import { dashboardQuery, useRiseMutation, type TaskRow, type GoalRow, type HabitRow } from "@/services/dashboard";
import { tasksApi, habitsApi, goalsApi } from "@/services/routines";
import { fmtRange, dayLabel, isoDate } from "@/lib/format";
import { Card, PageHeader, SegmentedTabs, Pills, ProgressRing, PrimaryButton, IconButton, SectionHeader, TaskItem, HabitItem, GoalItem, EmptyState, LoadingState, ErrorState, type Tone } from "@/components/rise/ui";
import { TaskDialog, HabitDialog, GoalDialog } from "@/components/rise/RoutineDialogs";

export const Route = createFileRoute("/_authenticated/routines")({
  head: () => ({ meta: [{ title: "Routines — Rise OS" }, { name: "description", content: "Tasks, habits and goals to build a better you." }, { property: "og:title", content: "Routines — Rise OS" }, { property: "og:description", content: "Tasks, habits and goals to build a better you." }] }),
  component: Routines,
});

const TABS = ["Tasks", "Habits", "Goals", "Today"] as const;
const CATS = ["All", "Study", "Personal", "Other"] as const;
const HABIT_ICONS = [{ i: Dumbbell, t: "orange" }, { i: BookOpen, t: "blue" }, { i: Droplets, t: "cyan" }, { i: Sparkles, t: "violet" }] as const;
const catLabel = (c: string) => c[0]!.toUpperCase() + c.slice(1);

function Routines() {
  const { data: d, isLoading, error, refetch } = useQuery(dashboardQuery);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tasks");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [taskDlg, setTaskDlg] = useState<{ open: boolean; task?: TaskRow | null }>({ open: false });
  const [habitDlg, setHabitDlg] = useState<{ open: boolean; habit?: HabitRow | null }>({ open: false });
  const [goalDlg, setGoalDlg] = useState<{ open: boolean; goal?: GoalRow | null }>({ open: false });

  const close = () => { setTaskDlg({ open: false }); setHabitDlg({ open: false }); setGoalDlg({ open: false }); };
  const createTask = useRiseMutation(tasksApi.create, { success: "Task added" });
  const updateTask = useRiseMutation(tasksApi.update, { success: "Task updated" });
  const setStatus = useRiseMutation(tasksApi.setStatus);
  const moveTask = useRiseMutation(tasksApi.reschedule, { success: "Moved to tomorrow" });
  const deleteTask = useRiseMutation(tasksApi.remove, { success: "Task deleted" });
  const createHabit = useRiseMutation(habitsApi.create, { success: "Habit added" });
  const renameHabit = useRiseMutation(habitsApi.rename, { success: "Habit updated" });
  const archiveHabit = useRiseMutation(habitsApi.archive, { success: "Habit archived" });
  const toggleHabit = useRiseMutation(habitsApi.toggleToday);
  const createGoal = useRiseMutation(goalsApi.create, { success: "Goal added" });
  const updateGoal = useRiseMutation(goalsApi.update, { success: "Goal updated" });
  const archiveGoal = useRiseMutation(goalsApi.setStatus, { success: "Goal archived" });

  if (isLoading) return <LoadingState text="Loading routines..." />;
  if (error || !d) return <ErrorState onRetry={() => refetch()} />;

  const tasks = [...d.tasks_overdue, ...d.tasks_today];
  const done = d.tasks_today.filter((t) => t.status === "completed").length;
  const hDone = d.habits.filter((h) => h.done_today).length;
  const shown = tasks.filter((t) => cat === "All" || t.category === cat.toLowerCase());
  const summary: { label: string; v: number; n: number; t: Tone }[] = [
    { label: "Tasks", v: done, n: d.tasks_today.length, t: "mint" },
    { label: "Habits", v: hDone, n: d.habits.length, t: "orange" },
    { label: "Goals", v: d.goals_summary.done, n: d.goals_summary.total, t: "violet" },
  ];
  const addLabel = tab === "Habits" ? "Add Habit" : tab === "Goals" ? "Add Goal" : "Add Task";
  const onAdd = () => (tab === "Habits" ? setHabitDlg({ open: true }) : tab === "Goals" ? setGoalDlg({ open: true }) : setTaskDlg({ open: true }));
  const meta = (t: TaskRow) => `${catLabel(t.category)} • ${t.scheduled_date && t.scheduled_date !== d.today ? `${dayLabel(t.scheduled_date, d.today)} ` : ""}${fmtRange(t.start_time, t.end_time)}`;
  const busyTask = createTask.isPending || updateTask.isPending || moveTask.isPending || deleteTask.isPending;

  return (
    <div className="space-y-4">
      <PageHeader title="Routines" subtitle="Tasks, habits and goals to build a better you." />
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      <div className="grid grid-cols-3 gap-2.5">
        {summary.map((s) => (
          <Card key={s.label} className="flex flex-col items-center gap-1.5 p-3">
            <ProgressRing value={s.n ? (s.v / s.n) * 100 : 0} t={s.t} size={36} stroke={4}>{""}</ProgressRing>
            <p className="text-base font-extrabold leading-none">{s.v}/{s.n}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>
      <div className="flex gap-2.5">
        <PrimaryButton className="flex-1" onClick={onAdd}><Plus className="size-4" />{addLabel}</PrimaryButton>
        <IconButton label="Schedule a task for a date" className="size-11 border bg-card" onClick={() => setTaskDlg({ open: true })}><CalendarDays className="size-5 text-muted-foreground" /></IconButton>
      </div>

      {(tab === "Tasks" || tab === "Today") && (
        <>
          <section>
            <SectionHeader title="Today's Tasks" />
            <Pills items={CATS} value={cat} onChange={setCat} />
            <Card className="mt-3 divide-y py-0">
              {shown.length ? shown.map((t) => (
                <TaskItem key={t.id} title={t.title} meta={meta(t)} done={t.status === "completed"}
                  onToggle={() => setStatus.mutate({ id: t.id, status: t.status === "completed" ? "pending" : "completed" })}
                  onMore={() => setTaskDlg({ open: true, task: t })} />
              )) : <div className="py-4"><EmptyState title={tasks.length ? "No tasks here" : "No tasks for today"} text={tasks.length ? "Try a different category." : "Add a task to plan your day."} /></div>}
            </Card>
          </section>
          <section>
            <SectionHeader title="Upcoming" />
            <Card className="divide-y py-0">
              {d.tasks_upcoming.length ? d.tasks_upcoming.map((t) => (
                <TaskItem key={t.id} title={t.title} meta={meta(t)} done={false}
                  onToggle={() => setStatus.mutate({ id: t.id, status: "completed" })} onMore={() => setTaskDlg({ open: true, task: t })} />
              )) : <p className="py-4 text-center text-sm text-muted-foreground">Nothing scheduled ahead.</p>}
            </Card>
          </section>
        </>
      )}

      {(tab === "Habits" || tab === "Today") && (
        <section>
          <SectionHeader title="Habits" />
          <Card className="divide-y py-0">
            {d.habits.length ? d.habits.map((h, i) => (
              <HabitItem key={h.id} icon={HABIT_ICONS[i % 4]!.i} t={HABIT_ICONS[i % 4]!.t} title={h.name} streak={h.streak} done={h.done_today}
                onToggle={() => toggleHabit.mutate({ id: h.id, done: h.done_today, today: d.today })}
                onMore={() => setHabitDlg({ open: true, habit: h })} />
            )) : <div className="py-4"><EmptyState title="No habits yet" text="Add a daily habit to start a streak." /></div>}
          </Card>
        </section>
      )}

      {tab === "Goals" && (
        <section>
          <SectionHeader title="Goals" />
          <Card className="divide-y py-0">
            {d.goals.length ? d.goals.map((g) => (
              <button key={g.id} type="button" className="block w-full text-left" onClick={() => setGoalDlg({ open: true, goal: g })}>
                <GoalItem title={g.title} t={g.status === "completed" ? "mint" : "violet"}
                  meta={`${Number(g.current_value)} / ${Number(g.target_value)}${g.unit ? ` ${g.unit}` : ""}${g.deadline ? ` • By ${dayLabel(g.deadline, d.today)}` : ""}${g.status === "completed" ? " • Completed" : ""}`}
                  pct={Math.min(100, Math.round((Number(g.current_value) / Number(g.target_value)) * 100))} />
              </button>
            )) : <div className="py-4"><EmptyState title="No goals yet" text="Set a goal and track your progress." /></div>}
          </Card>
        </section>
      )}

      <TaskDialog open={taskDlg.open} onOpenChange={(o) => !o && close()} today={d.today} task={taskDlg.task ?? null} busy={busyTask}
        onSave={(t) => (taskDlg.task ? updateTask.mutate({ ...t, id: taskDlg.task.id }, { onSuccess: close }) : createTask.mutate(t, { onSuccess: close }))}
        onTomorrow={() => taskDlg.task && moveTask.mutate({ id: taskDlg.task.id, date: isoDate(d.today, 1) }, { onSuccess: close })}
        onDelete={() => taskDlg.task && deleteTask.mutate(taskDlg.task.id, { onSuccess: close })} />
      <HabitDialog open={habitDlg.open} onOpenChange={(o) => !o && close()} name={habitDlg.habit?.name ?? ""} busy={createHabit.isPending || renameHabit.isPending || archiveHabit.isPending}
        onSave={(name) => (habitDlg.habit ? renameHabit.mutate({ id: habitDlg.habit.id, name }, { onSuccess: close }) : createHabit.mutate({ name }, { onSuccess: close }))}
        {...(habitDlg.habit ? { onArchive: () => archiveHabit.mutate(habitDlg.habit!.id, { onSuccess: close }) } : {})} />
      <GoalDialog open={goalDlg.open} onOpenChange={(o) => !o && close()} goal={goalDlg.goal ?? null} busy={createGoal.isPending || updateGoal.isPending || archiveGoal.isPending}
        onSave={(g) => (goalDlg.goal ? updateGoal.mutate({ ...g, id: goalDlg.goal.id }, { onSuccess: close }) : createGoal.mutate(g, { onSuccess: close }))}
        onArchive={() => goalDlg.goal && archiveGoal.mutate({ id: goalDlg.goal.id, status: "archived" }, { onSuccess: close })} />
    </div>
  );
}
