import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, CalendarDays, BookOpen, Dumbbell, Droplets, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import { todayTasks, upcomingTasks, habits as habitSeed, goals } from "@/lib/mock-data";
import { Card, PageHeader, SegmentedTabs, Pills, ProgressRing, PrimaryButton, IconButton, SectionHeader, TaskItem, HabitItem, GoalItem, EmptyState, type Tone } from "@/components/rise/ui";

export const Route = createFileRoute("/_authenticated/routines")({
  head: () => ({ meta: [{ title: "Routines — Rise OS" }, { name: "description", content: "Tasks, habits and goals to build a better you." }, { property: "og:title", content: "Routines — Rise OS" }, { property: "og:description", content: "Tasks, habits and goals to build a better you." }] }),
  component: Routines,
});

const TABS = ["Tasks", "Habits", "Goals", "Today"] as const;
const CATS = ["All", "Study", "Personal", "Other"] as const;
const HABIT_ICONS = [{ i: Dumbbell, t: "orange" }, { i: BookOpen, t: "blue" }, { i: Droplets, t: "cyan" }, { i: PhoneOff, t: "violet" }] as const;

function Routines() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tasks");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [tasks, setTasks] = useState(todayTasks);
  const [habits, setHabits] = useState(habitSeed);
  const done = tasks.filter((t) => t.done).length;
  const hDone = habits.filter((h) => h.done).length;
  const shown = tasks.filter((t) => cat === "All" || (cat === "Other" ? !["Study", "Personal"].includes(t.category) : t.category === cat));

  const summary: { label: string; v: number; n: number; t: Tone }[] = [
    { label: "Tasks", v: done, n: tasks.length, t: "mint" },
    { label: "Habits", v: hDone, n: habits.length, t: "orange" },
    { label: "Goals", v: 1, n: goals.length, t: "violet" },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Routines" subtitle="Tasks, habits and goals to build a better you." />
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      <div className="grid grid-cols-3 gap-2.5">
        {summary.map((s) => (
          <Card key={s.label} className="flex flex-col items-center gap-1.5 p-3">
            <ProgressRing value={(s.v / s.n) * 100} t={s.t} size={36} stroke={4}>{""}</ProgressRing>
            <p className="text-base font-extrabold leading-none">{s.v}/{s.n}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>
      <div className="flex gap-2.5">
        <PrimaryButton className="flex-1" onClick={() => toast("Add task form coming soon")}><Plus className="size-4" />Add Task</PrimaryButton>
        <IconButton label="Pick date" className="size-11 border bg-card"><CalendarDays className="size-5 text-muted-foreground" /></IconButton>
      </div>

      {(tab === "Tasks" || tab === "Today") && (
        <>
          <section>
            <SectionHeader title="Today's Tasks" />
            <Pills items={CATS} value={cat} onChange={setCat} />
            <Card className="mt-3 divide-y py-0">
              {shown.length ? shown.map((t) => (
                <TaskItem key={t.id} title={t.title} meta={`${t.category} • ${t.time}`} done={t.done}
                  onToggle={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                  onMore={() => toast(t.title)} />
              )) : <div className="py-4"><EmptyState title="No tasks here" text="Try a different category." /></div>}
            </Card>
          </section>
          <section>
            <SectionHeader title="Upcoming" action="View all" />
            <Card className="py-0">{upcomingTasks.map((t) => <TaskItem key={t.id} title={t.title} meta={`${t.category} • ${t.time}`} done={false} />)}</Card>
          </section>
        </>
      )}

      {(tab === "Habits" || tab === "Today") && (
        <section>
          <SectionHeader title="Habits" />
          <Card className="divide-y py-0">
            {habits.map((h, i) => (
              <HabitItem key={h.id} icon={HABIT_ICONS[i % 4]!.i} t={HABIT_ICONS[i % 4]!.t} title={h.title} streak={h.streak} done={h.done}
                onToggle={() => setHabits((hs) => hs.map((x) => (x.id === h.id ? { ...x, done: !x.done } : x)))} />
            ))}
          </Card>
        </section>
      )}

      {tab === "Goals" && (
        <section>
          <SectionHeader title="Goals" />
          <Card className="divide-y py-0">{goals.map((g) => <GoalItem key={g.id} title={g.title} meta={g.meta} pct={g.pct} />)}</Card>
        </section>
      )}
    </div>
  );
}
