import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Flame, Target, CheckCircle2 } from "lucide-react";
import { statsQuery, profileQuery, greeting } from "@/lib/data";
import { Card, StatCard, ProgressBar, LoadingState, ErrorState, PageHeader } from "@/components/rk/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Home — RK Study" }, { name: "description", content: "Your RK Study dashboard." }, { property: "og:title", content: "Home — RK Study" }, { property: "og:description", content: "Your RK Study dashboard." }] }),
  component: Home,
});

function Home() {
  const s = useQuery(statsQuery);
  const p = useQuery(profileQuery);
  if (s.isLoading) return <LoadingState text="Loading your progress..." />;
  if (s.error || !s.data) return <ErrorState onRetry={() => s.refetch()} />;
  const d = s.data;
  const goal = p.data?.daily_goal ?? 60;
  const acc = d.total ? Math.round((d.correct / d.total) * 100) : 0;
  return (
    <div className="space-y-5">
      <PageHeader title={`${greeting()}, ${p.data?.name?.split(" ")[0] ?? ""} 👋`} subtitle="Study Smart. Practice Better. Rank Higher." />
      <Card>
        <p className="text-sm text-muted-foreground">Today's Progress</p>
        <p className="mt-1 font-display text-3xl font-bold">{d.today} <span className="text-lg text-muted-foreground">/ {goal} Questions</span></p>
        <ProgressBar value={(d.today / goal) * 100} className="mt-3" label="Today's progress" />
        <p className="mt-2 text-sm text-muted-foreground">{Math.min(100, Math.round((d.today / goal) * 100))}% complete</p>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Streak" value={`${d.streak} days`} icon={<Flame className="size-4" aria-hidden />} />
        <StatCard label="Solved" value={d.total} icon={<CheckCircle2 className="size-4" aria-hidden />} />
        <StatCard label="Accuracy" value={`${acc}%`} icon={<Target className="size-4" aria-hidden />} />
        <StatCard label="Tests" value={d.tests} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Button asChild variant="secondary" className="h-14"><Link to="/practice">Daily Practice</Link></Button>
        <Button asChild variant="secondary" className="h-14"><Link to="/tests">Daily Mock</Link></Button>
        <Button asChild variant="secondary" className="h-14"><Link to="/current-affairs">Current Affairs</Link></Button>
        <Button asChild variant="secondary" className="h-14"><Link to="/profile">Profile</Link></Button>
      </div>
      {d.last_topic && (
        <Card>
          <p className="text-sm text-muted-foreground">Continue Learning</p>
          <p className="mt-1 font-bold">{d.last_topic.subject} · {d.last_topic.topic}</p>
          <ProgressBar value={d.last_topic.progress} className="mt-3" />
          <p className="mt-1 text-xs text-muted-foreground">Progress: {d.last_topic.progress}%</p>
        </Card>
      )}
      <Card>
        <p className="font-bold">This week</p>
        <div className="mt-3 flex h-24 items-end gap-2">
          {d.weekly.map((w) => (
            <div key={w.day} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-md bg-primary/80" style={{ height: `${Math.max(4, Math.min(80, w.count))}px` }} />
              <span className="text-[10px] text-muted-foreground">{new Date(w.day).toLocaleDateString("en-IN", { weekday: "narrow" })}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
