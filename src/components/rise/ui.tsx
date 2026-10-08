import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, Inbox, MoreVertical, Send, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tone = "blue" | "violet" | "cyan" | "mint" | "orange" | "rose" | "amber";

const TONE: Record<Tone, { text: string; soft: string; stroke: string; bg: string }> = {
  blue: { text: "text-tone-blue", soft: "bg-tone-blue/10", stroke: "stroke-tone-blue", bg: "bg-tone-blue" },
  violet: { text: "text-tone-violet", soft: "bg-tone-violet/10", stroke: "stroke-tone-violet", bg: "bg-tone-violet" },
  cyan: { text: "text-tone-cyan", soft: "bg-tone-cyan/10", stroke: "stroke-tone-cyan", bg: "bg-tone-cyan" },
  mint: { text: "text-tone-mint", soft: "bg-tone-mint/10", stroke: "stroke-tone-mint", bg: "bg-tone-mint" },
  orange: { text: "text-tone-orange", soft: "bg-tone-orange/10", stroke: "stroke-tone-orange", bg: "bg-tone-orange" },
  rose: { text: "text-tone-rose", soft: "bg-tone-rose/10", stroke: "stroke-tone-rose", bg: "bg-tone-rose" },
  amber: { text: "text-tone-amber", soft: "bg-tone-amber/15", stroke: "stroke-tone-amber", bg: "bg-tone-amber" },
};
export const tone = (t: Tone) => TONE[t];

export function Card({ className, children, as: As = "div" }: { className?: string; children: ReactNode; as?: "div" | "section" | "article" }) {
  return <As className={cn("rounded-2xl border bg-card p-4 shadow-[0_1px_2px_oklch(0.3_0.05_265/0.04),0_4px_14px_oklch(0.3_0.05_265/0.04)]", className)}>{children}</As>;
}

export function IconTile({ icon: Icon, t = "blue", size = "md", className }: { icon: LucideIcon; t?: Tone; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = size === "sm" ? "size-8 rounded-lg" : size === "lg" ? "size-11 rounded-2xl" : "size-9 rounded-xl";
  const i = size === "sm" ? "size-4" : size === "lg" ? "size-5.5" : "size-[18px]";
  return <span className={cn("grid shrink-0 place-items-center", s, TONE[t].soft, TONE[t].text, className)}><Icon className={i} aria-hidden /></span>;
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-[26px] font-extrabold leading-tight tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function SectionHeader({ title, action, to }: { title: string; action?: string; to?: string }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-3">
      <h2 className="text-base font-bold tracking-tight">{title}</h2>
      {action && (to ? <Link to={to} className="text-sm font-semibold text-primary">{action}</Link> : <button type="button" className="text-sm font-semibold text-primary">{action}</button>)}
    </div>
  );
}

export function ProgressBar({ value, t = "blue", className, label }: { value: number; t?: Tone; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Progress"} className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all", TONE[t].bg)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function ProgressRing({ value, t = "blue", size = 44, stroke = 5, children }: { value: number; t?: Tone; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${Math.round(v)}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} className={cn(TONE[t].stroke, "transition-all")} />
      </svg>
      <span className="absolute text-[10px] font-bold">{children ?? `${Math.round(v)}%`}</span>
    </div>
  );
}

export function StatCard({ icon, t, value, label }: { icon: LucideIcon; t: Tone; value: ReactNode; label: string }) {
  return (
    <Card className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
      <IconTile icon={icon} t={t} />
      <div className="text-base font-extrabold leading-none">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </Card>
  );
}

export function ProgressCard({ label, value, sub, pct, t }: { label: string; value: ReactNode; sub: ReactNode; pct: number; t: Tone }) {
  return (
    <Card className="flex items-center justify-between gap-2 p-3.5">
      <div className="min-w-0">
        <p className={cn("text-xs font-semibold", TONE[t].text)}>{label}</p>
        <p className="mt-0.5 text-lg font-extrabold leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <ProgressRing value={pct} t={t} size={48} />
    </Card>
  );
}

export function IconButton({ label, className, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button type="button" aria-label={label} className={cn("grid size-10 shrink-0 place-items-center rounded-xl text-foreground transition hover:bg-muted active:scale-95", className)} {...p}>{children}</button>;
}

export function PrimaryButton({ className, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn("inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_6px_16px_-6px_var(--primary)] transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50", className)} {...p}>{children}</button>;
}

export function SecondaryButton({ className, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn("inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-semibold transition hover:bg-muted active:scale-[0.98] disabled:opacity-50", className)} {...p}>{children}</button>;
}

export function SegmentedTabs<T extends string>({ tabs, value, onChange, className }: { tabs: readonly T[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div role="tablist" className={cn("flex gap-1 overflow-x-auto rounded-xl bg-muted p-1 [scrollbar-width:none]", className)}>
      {tabs.map((t) => (
        <button key={t} role="tab" type="button" aria-selected={value === t} onClick={() => onChange(t)}
          className={cn("min-w-0 flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-semibold text-muted-foreground transition", value === t && "bg-card text-primary shadow-sm")}>
          {t}
        </button>
      ))}
    </div>
  );
}

export function Pills<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
      {items.map((i) => (
        <button key={i} type="button" aria-pressed={value === i} onClick={() => onChange(i)}
          className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition", value === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
          {i}
        </button>
      ))}
    </div>
  );
}

function Check0({ done, onToggle, label }: { done: boolean; onToggle?: (() => void) | undefined; label: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={done} aria-label={label} onClick={onToggle}
      className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2 transition", done ? "border-tone-mint bg-tone-mint text-primary-foreground" : "border-input hover:border-primary")}>
      {done && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
    </button>
  );
}

export function TaskItem({ title, meta, done, onToggle, onMore }: { title: string; meta: string; done: boolean; onToggle?: () => void; onMore?: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Check0 done={done} onToggle={onToggle} label={`Mark ${title} ${done ? "not done" : "done"}`} />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-semibold", done && "text-muted-foreground line-through")}>{title}</p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
      <IconButton label={`More options for ${title}`} className="size-8 text-muted-foreground" onClick={onMore}><MoreVertical className="size-4" /></IconButton>
    </div>
  );
}

export function HabitItem({ icon, t, title, streak, done, onToggle, onMore }: { icon: LucideIcon; t: Tone; title: string; streak: number; done: boolean; onToggle?: (() => void) | undefined; onMore?: (() => void) | undefined }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <IconTile icon={icon} t={t} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{streak} day streak</p>
      </div>
      <Check0 done={done} onToggle={onToggle} label={`Mark ${title} ${done ? "not done" : "done"}`} />
      {onMore && <IconButton label={`More options for ${title}`} className="size-8 text-muted-foreground" onClick={onMore}><MoreVertical className="size-4" /></IconButton>}
    </div>
  );
}

export function LoadingState({ text = "Loading..." }: { text?: string }) {
  return (
    <div role="status" className="space-y-3 py-2" aria-label={text}>
      <div className="h-7 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      <div className="grid grid-cols-4 gap-2.5">{[0, 1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}</div>
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      <span className="sr-only">{text}</span>
    </div>
  );
}

export function ErrorState({ onRetry, text = "We couldn't load your data. Check your connection and try again." }: { onRetry?: () => void; text?: string }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm">
      <p className="font-semibold">{text}</p>
      {onRetry && <button type="button" onClick={onRetry} className="mt-3 font-semibold text-primary">Try again</button>}
    </div>
  );
}

export function GoalItem({ title, meta, pct, t = "violet" }: { title: string; meta: string; pct: number; t?: Tone }) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0"><p className="truncate text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{meta}</p></div>
        <span className="text-sm font-bold">{pct}%</span>
      </div>
      <ProgressBar value={pct} t={t} className="mt-2" />
    </div>
  );
}

export function SubjectCard({ icon, t, name, onClick }: { icon: LucideIcon; t: Tone; name: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-2 rounded-2xl border bg-card px-1 py-3 text-center transition hover:border-primary/40 active:scale-[0.98]">
      <IconTile icon={icon} t={t} size="lg" />
      <span className="text-[11px] font-semibold leading-tight">{name}</span>
    </button>
  );
}

export function TopicCard({ icon, t, title, meta, pct, onClick }: { icon: LucideIcon; t: Tone; title: string; meta: string; pct: number; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 py-3 text-left">
      <IconTile icon={icon} t={t} size="sm" />
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{title}</p><p className="truncate text-xs text-muted-foreground">{meta}</p></div>
      <ProgressRing value={pct} t={pct ? "blue" : "blue"} size={38} stroke={4} />
    </button>
  );
}

export function ChatBubble({ from, time, children }: { from: "user" | "ai"; time: string; children: ReactNode }) {
  const user = from === "user";
  return (
    <div className={cn("flex", user ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed", user ? "rounded-br-md bg-secondary text-secondary-foreground" : "rounded-bl-md border bg-card")}>
        {children}
        <p className={cn("mt-1 text-[10px] text-muted-foreground", user && "text-right")}>{time}</p>
      </div>
    </div>
  );
}

export function ChatComposer({ value, onChange, onSend }: { value: string; onChange: (v: string) => void; onSend: () => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="flex items-center gap-2 rounded-2xl border bg-card p-1.5 pl-4">
      <label htmlFor="chat-input" className="sr-only">Message Max</label>
      <input id="chat-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Ask anything..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      <button type="submit" aria-label="Send" disabled={!value.trim()} className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition disabled:opacity-40"><Send className="size-4" /></button>
    </form>
  );
}

export function ProfileRow({ icon: Icon, title, subtitle, value, danger, onClick }: { icon: LucideIcon; title: string; subtitle?: string; value?: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-muted/60", danger && "text-destructive")}>
      <Icon className={cn("size-5 shrink-0", danger ? "text-destructive" : "text-primary")} aria-hidden />
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{title}</p>{subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}</div>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed p-8 text-center">
      <Inbox className="size-7 text-muted-foreground" aria-hidden />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
