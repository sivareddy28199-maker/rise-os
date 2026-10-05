import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Flame, ClipboardCheck } from "lucide-react";
import { weekly, weakTopics } from "@/lib/mock-data";
import { loadResults, MODES, type QuizResult } from "@/lib/quiz";
import { Card, IconTile, PageHeader, ProgressBar, ProgressCard, SectionHeader, SegmentedTabs, EmptyState } from "@/components/rise/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Progress — Rise OS" }, { name: "description", content: "Track your growth and stay consistent." }, { property: "og:title", content: "Progress — Rise OS" }, { property: "og:description", content: "Track your growth and stay consistent." }] }),
  component: Progress,
});

const TABS = ["Overview", "Study", "Tasks", "Habits", "Goals"] as const;

function Progress() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [results, setResults] = useState<QuizResult[]>([]);
  useEffect(() => setResults(loadResults()), []);
  const max = Math.max(...weekly.map((w) => w.h));
  const peak = weekly.findIndex((w) => w.h === max);
  return (
    <div className="space-y-4">
      <PageHeader title="Progress" subtitle="Track your growth and stay consistent." />
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      <div className="grid grid-cols-2 gap-2.5">
        <Card className="flex items-center gap-3 p-3.5"><IconTile icon={Clock} t="blue" size="lg" /><div className="min-w-0"><p className="text-[11px] text-muted-foreground">Study Time</p><p className="text-lg font-extrabold leading-tight">12.5h</p><p className="text-[11px] text-muted-foreground">This week</p></div></Card>
        <Card className="flex items-center gap-3 p-3.5"><IconTile icon={Flame} t="orange" size="lg" /><div className="min-w-0"><p className="text-[11px] text-muted-foreground">Consistency</p><p className="text-lg font-extrabold leading-tight">6 days</p><p className="text-[11px] text-muted-foreground">Current streak</p></div></Card>
      </div>

      <Card>
        <SectionHeader title="Weekly Overview" />
        <div className="flex h-36 items-end justify-between gap-2 pt-5" role="img" aria-label="Study hours per day this week">
          {weekly.map((w, i) => (
            <div key={w.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="relative flex h-24 w-full max-w-7 items-end rounded-lg bg-muted">
                {i === peak && <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-md bg-tone-violet px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">{w.h}h</span>}
                <div className={cn("w-full rounded-lg", i === peak ? "bg-tone-violet" : "bg-tone-blue/70")} style={{ height: `${(w.h / max) * 100}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{w.day}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        <ProgressCard label="Tasks" value="12/18" sub="67%" pct={67} t="mint" />
        <ProgressCard label="Habits" value="14/21" sub="67%" pct={67} t="orange" />
        <ProgressCard label="Goals" value="2/5" sub="40%" pct={40} t="violet" />
        <ProgressCard label="Practice Accuracy" value="68%" sub={<span className="text-tone-mint">+12%</span>} pct={68} t="blue" />
      </div>

      <section>
        <SectionHeader title="Weak Topics" action="View all" />
        <Card className="divide-y py-0">
          {weakTopics.map((w) => (
            <div key={w.title} className="py-3">
              <p className="text-sm font-semibold">{w.title}</p>
              <div className="mt-1 flex items-center gap-3"><span className="w-24 shrink-0 text-xs text-muted-foreground">{w.subject}</span><ProgressBar value={w.pct} t="rose" className="flex-1" /><span className="text-xs font-bold">{w.pct}%</span></div>
            </div>
          ))}
        </Card>
      </section>

      <section>
        <SectionHeader title="Quiz & Mock History" />
        {results.length ? (
          <Card className="divide-y py-0">
            {results.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-3">
                <IconTile icon={ClipboardCheck} t={r.mode === "mock" ? "violet" : "blue"} size="sm" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{MODES[r.mode].title}</p><p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()} • {r.correct}✓ {r.wrong}✗ {r.skipped} skipped</p></div>
                <span className="text-sm font-bold">{r.score}/{r.max}</span>
              </div>
            ))}
          </Card>
        ) : <EmptyState title="No attempts yet" text="Take the Daily Quiz to see your results here." action={<Link to="/quiz" search={{ mode: "daily" }} className="text-sm font-semibold text-primary">Start Daily Quiz</Link>} />}
      </section>
    </div>
  );
}
