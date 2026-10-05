import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Target, ChevronRight, CheckCircle2, Flame, Clock, BarChart3, Play, Lightbulb, CalendarDays, CheckCircle } from "lucide-react";
import { profileQuery } from "@/lib/data";
import { greet, todayLabel } from "@/lib/mock-data";
import { Card, IconTile, SectionHeader, StatCard } from "@/components/rise/ui";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Home — Rise OS" }, { name: "description", content: "Your daily focus, tasks, habits and study progress." }, { property: "og:title", content: "Home — Rise OS" }, { property: "og:description", content: "Your daily focus, tasks, habits and study progress." }] }),
  component: Home,
});

function Home() {
  const p = useQuery(profileQuery);
  const name = p.data?.name || "RK User";
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

      <Link to="/routines" className="flex items-center gap-3 rounded-2xl p-4 text-primary-foreground shadow-[0_12px_28px_-14px_var(--tone-violet)]" style={{ background: "var(--gradient-focus)" }}>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground/20"><Target className="size-6" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs opacity-85">Today's Focus</p>
          <p className="text-lg font-bold leading-tight">Revise Quant</p>
          <p className="text-xs opacity-85">Stay consistent. You've got this!</p>
        </div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/25"><ChevronRight className="size-4" aria-hidden /></span>
      </Link>

      <div className="grid grid-cols-4 gap-2.5">
        <StatCard icon={CheckCircle2} t="mint" value="3/5" label="Tasks" />
        <StatCard icon={Flame} t="orange" value="2/4" label="Habits" />
        <StatCard icon={Clock} t="blue" value="1.5h" label="Study" />
        <StatCard icon={BarChart3} t="violet" value="68%" label="Progress" />
      </div>

      <Card>
        <SectionHeader title="Next Task" />
        <div className="flex items-center gap-3">
          <IconTile icon={CalendarDays} t="rose" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Revise Quant</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" aria-hidden />10:00 AM – 11:00 AM</p>
          </div>
          <Link to="/quiz" search={{ mode: "daily" }} aria-label="Start task" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="size-4 fill-current" /></Link>
        </div>
      </Card>

      <Link to="/max" className="flex items-center gap-3 rounded-2xl border bg-accent/50 p-4">
        <IconTile icon={Lightbulb} t="amber" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">AI Recommendation</p>
          <p className="text-xs text-muted-foreground">Focus on Number Systems today. You're 20% below target in this topic.</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>

      <Card>
        <SectionHeader title="Today's Routine" action="View all" to="/routines" />
        <div className="flex items-center gap-3 py-1">
          <CheckCircle className="size-6 shrink-0 fill-tone-mint text-card" aria-hidden />
          <p className="flex-1 text-sm font-semibold">Morning Exercise</p>
          <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
        </div>
      </Card>
    </div>
  );
}
