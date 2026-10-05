import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Calculator, Brain, BookA, Newspaper, ChevronRight, BookOpen, PenSquare, ClipboardCheck, NotebookPen, RotateCcw, Timer } from "lucide-react";
import { toast } from "sonner";
import { recentTopics } from "@/lib/mock-data";
import { Card, IconTile, PageHeader, ProgressBar, SectionHeader, SubjectCard, TopicCard, type Tone } from "@/components/rise/ui";

export const Route = createFileRoute("/_authenticated/learn")({
  head: () => ({ meta: [{ title: "Learn — Rise OS" }, { name: "description", content: "Study smarter, improve faster with subjects, quizzes and mock tests." }, { property: "og:title", content: "Learn — Rise OS" }, { property: "og:description", content: "Study smarter, improve faster." }] }),
  component: Learn,
});

const SUBJECTS = [
  { name: "Mathematics", icon: Calculator, t: "blue" },
  { name: "Reasoning", icon: Brain, t: "orange" },
  { name: "English", icon: BookA, t: "mint" },
  { name: "Current Affairs", icon: Newspaper, t: "rose" },
] as const;

function Learn() {
  const [q, setQ] = useState("");
  const topics = recentTopics.filter((t) => (t.title + t.subject).toLowerCase().includes(q.toLowerCase()));
  const tiles: { label: string; icon: typeof PenSquare; t: Tone; to?: "daily" | "mock" }[] = [
    { label: "Practice Questions", icon: PenSquare, t: "violet", to: "daily" },
    { label: "Take a Quiz", icon: ClipboardCheck, t: "rose", to: "daily" },
    { label: "My Notes", icon: NotebookPen, t: "blue" },
    { label: "Revision", icon: RotateCcw, t: "mint" },
  ];
  return (
    <div className="space-y-4">
      <PageHeader title="Learn" subtitle="Study smarter, improve faster." />
      <label className="flex h-11 items-center gap-2.5 rounded-xl border bg-card px-3.5">
        <Search className="size-4 text-muted-foreground" aria-hidden />
        <span className="sr-only">Search</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subjects, topics or notes..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </label>
      <div className="grid grid-cols-4 gap-2.5">
        {SUBJECTS.map((s) => <SubjectCard key={s.name} icon={s.icon} t={s.t} name={s.name} onClick={() => toast(s.name)} />)}
      </div>

      <Card className="border-secondary bg-secondary/60">
        <p className="text-xs font-semibold text-primary">Continue Learning</p>
        <div className="mt-2 flex items-center gap-3">
          <IconTile icon={BookOpen} t="blue" className="bg-card" />
          <div className="min-w-0 flex-1"><p className="truncate font-bold">Number Systems</p><p className="text-xs text-muted-foreground">Mathematics • 4/12 topics</p></div>
          <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
        </div>
        <div className="mt-3 flex items-center gap-3"><ProgressBar value={33} className="flex-1 bg-card" /><span className="text-xs font-bold">33%</span></div>
      </Card>

      <Link to="/quiz" search={{ mode: "mock" }} className="flex items-center gap-3 rounded-2xl p-4 text-primary-foreground" style={{ background: "var(--gradient-focus)" }}>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-foreground/20"><Timer className="size-5" aria-hidden /></span>
        <div className="min-w-0 flex-1"><p className="font-bold">Full Mock Test</p><p className="text-xs opacity-85">Timed • +2 correct, −0.5 wrong</p></div>
        <ChevronRight className="size-4" aria-hidden />
      </Link>

      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((t) => {
          const inner = (<><IconTile icon={t.icon} t={t.t} /><span className="text-sm font-semibold leading-tight">{t.label}</span></>);
          const cls = "flex items-center gap-3 rounded-2xl border bg-card p-3.5 text-left transition hover:border-primary/40";
          return t.to ? <Link key={t.label} to="/quiz" search={{ mode: t.to }} className={cls}>{inner}</Link> : <button key={t.label} type="button" className={cls} onClick={() => toast(`${t.label} coming soon`)}>{inner}</button>;
        })}
      </div>

      <section>
        <SectionHeader title="Recent Topics" action="View all" />
        <Card className="divide-y py-0">
          {topics.map((t, i) => <TopicCard key={t.title} icon={BookOpen} t={i % 2 ? "rose" : "blue"} title={t.title} meta={`${t.subject} • ${t.done}/${t.total}`} pct={(t.done / t.total) * 100} />)}
          {!topics.length && <p className="py-4 text-center text-sm text-muted-foreground">No topics match "{q}".</p>}
        </Card>
      </section>
    </div>
  );
}
