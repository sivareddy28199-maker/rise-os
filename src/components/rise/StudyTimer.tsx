import { useEffect, useState } from "react";
import { Play, Square } from "lucide-react";
import { studyApi } from "@/services/routines";
import { useRiseMutation, type Dashboard } from "@/services/dashboard";
import { fmtTime } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Real study tracking: starts/stops a study session row; duration is computed by the database. */
export function StudyTimer({ active, taskId }: { active: Dashboard["active_session"]; taskId: string | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);
  const start = useRiseMutation(studyApi.start, { success: "Study timer started" });
  const stop = useRiseMutation(studyApi.stop, { success: (r) => `Saved ${Math.max(1, Math.round((r?.duration_seconds ?? 0) / 60))} min of study` });
  const busy = start.isPending || stop.isPending;
  const elapsed = active ? Math.max(0, Math.floor((now - new Date(active.started_at).getTime()) / 1000)) : 0;
  return (
    <div className="flex shrink-0 items-center gap-2">
      {active && <span className="text-xs font-bold tabular-nums text-primary">{fmtTime(elapsed)}</span>}
      <button
        type="button" disabled={busy}
        aria-label={active ? "Stop study timer" : "Start study timer"}
        onClick={() => (active ? stop.mutate(active.id) : start.mutate(taskId))}
        className={cn("grid size-10 place-items-center rounded-full text-primary-foreground transition active:scale-95 disabled:opacity-50", active ? "bg-tone-rose" : "bg-primary")}
      >
        {active ? <Square className="size-3.5 fill-current" /> : <Play className="size-4 fill-current" />}
      </button>
    </div>
  );
}
