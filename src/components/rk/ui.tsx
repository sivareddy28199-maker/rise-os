import type { ReactNode } from "react";
import { Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="relative grid size-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground"
      >
        RK
        <span className="absolute -bottom-0.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-warning" />
      </span>
      {withText && <span className="font-display text-lg font-bold tracking-tight">RK Study</span>}
    </span>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border bg-card p-4 text-card-foreground shadow-[var(--shadow-soft)] sm:p-5", className)}>
      {children}
    </div>
  );
}

export function ProgressBar({ value, className, label }: { value: number; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed p-8 text-center">
      <Inbox className="size-8 text-muted-foreground" aria-hidden />
      <p className="mt-3 font-semibold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ text = "Loading..." }: { text?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" aria-hidden /> {text}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm">
      <p className="font-semibold">Something went wrong. Please try again.</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">
          Try again
        </button>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Tiny markdown-lite renderer: "## heading", "- bullet", paragraphs. */
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-3 leading-relaxed">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i} className="pt-2 text-lg font-bold">{b.slice(3)}</h2>;
        const lines = b.split("\n");
        if (lines[0].startsWith("## "))
          return (
            <div key={i}>
              <h2 className="pt-2 text-lg font-bold">{lines[0].slice(3)}</h2>
              <Lines lines={lines.slice(1)} />
            </div>
          );
        return <Lines key={i} lines={lines} />;
      })}
    </div>
  );
}
function Lines({ lines }: { lines: string[] }) {
  if (lines.every((l) => l.startsWith("- ")))
    return (
      <ul className="list-disc space-y-1 pl-5">
        {lines.map((l, i) => <li key={i}>{l.slice(2)}</li>)}
      </ul>
    );
  return <p>{lines.join(" ")}</p>;
}
