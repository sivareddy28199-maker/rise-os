import { useEffect, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton, SecondaryButton } from "./ui";
import { isoDate } from "@/lib/format";
import type { TaskRow, GoalRow, TaskCategory } from "@/services/dashboard";
import type { TaskInput, GoalInput } from "@/services/routines";

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div className="space-y-1.5"><Label htmlFor={id}>{label}</Label>{children}</div>;
}

const selectCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

export function TaskDialog({ open, onOpenChange, today, task, busy, onSave, onDelete, onTomorrow }: {
  open: boolean; onOpenChange: (o: boolean) => void; today: string; task?: TaskRow | null; busy?: boolean;
  onSave: (t: TaskInput) => void; onDelete?: () => void; onTomorrow?: () => void;
}) {
  const [f, setF] = useState<TaskInput>({ title: "", category: "study", scheduled_date: today, start_time: null, end_time: null });
  useEffect(() => {
    if (open) setF(task ? { title: task.title, category: task.category, scheduled_date: task.scheduled_date ?? today, start_time: task.start_time?.slice(0, 5) ?? null, end_time: task.end_time?.slice(0, 5) ?? null } : { title: "", category: "study", scheduled_date: today, start_time: null, end_time: null });
  }, [open, task, today]);
  const bad = !f.title.trim() || (!!f.start_time && !!f.end_time && f.end_time <= f.start_time);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader><DialogTitle>{task ? "Edit task" : "Add task"}</DialogTitle><DialogDescription className="sr-only">Task details</DialogDescription></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!bad) onSave(f); }}>
          <Field id="t-title" label="Title"><Input id="t-title" required maxLength={200} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field id="t-cat" label="Category">
              <select id="t-cat" className={selectCls} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as TaskCategory })}>
                <option value="study">Study</option><option value="personal">Personal</option><option value="other">Other</option>
              </select>
            </Field>
            <Field id="t-date" label="Date"><Input id="t-date" type="date" required value={f.scheduled_date} onChange={(e) => setF({ ...f, scheduled_date: e.target.value })} /></Field>
          </div>
          <div className="flex gap-2">
            {[["Today", today], ["Tomorrow", isoDate(today, 1)]].map(([l, v]) => (
              <button key={l} type="button" onClick={() => setF({ ...f, scheduled_date: v! })} className={`rounded-full px-3 py-1 text-xs font-medium ${f.scheduled_date === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field id="t-start" label="Start"><Input id="t-start" type="time" value={f.start_time ?? ""} onChange={(e) => setF({ ...f, start_time: e.target.value || null })} /></Field>
            <Field id="t-end" label="End"><Input id="t-end" type="time" value={f.end_time ?? ""} onChange={(e) => setF({ ...f, end_time: e.target.value || null })} /></Field>
          </div>
          {f.start_time && f.end_time && f.end_time <= f.start_time && <p className="text-xs text-destructive">End time must be after start time.</p>}
          <PrimaryButton type="submit" className="w-full" disabled={bad || busy}>{busy ? "Saving..." : "Save task"}</PrimaryButton>
          {task && (
            <div className="grid grid-cols-2 gap-2">
              <SecondaryButton disabled={busy} onClick={onTomorrow}>Move to tomorrow</SecondaryButton>
              <SecondaryButton disabled={busy} onClick={onDelete} className="text-destructive">Delete</SecondaryButton>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function HabitDialog({ open, onOpenChange, name: initial, busy, onSave, onArchive }: {
  open: boolean; onOpenChange: (o: boolean) => void; name?: string; busy?: boolean; onSave: (name: string) => void; onArchive?: () => void;
}) {
  const [name, setName] = useState("");
  useEffect(() => { if (open) setName(initial ?? ""); }, [open, initial]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader><DialogTitle>{initial ? "Edit habit" : "Add habit"}</DialogTitle><DialogDescription>Daily habits are tracked once per day.</DialogDescription></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSave(name); }}>
          <Field id="h-name" label="Habit"><Input id="h-name" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Morning exercise" /></Field>
          <PrimaryButton type="submit" className="w-full" disabled={!name.trim() || busy}>{busy ? "Saving..." : "Save habit"}</PrimaryButton>
          {onArchive && <SecondaryButton className="w-full" disabled={busy} onClick={onArchive}>Archive habit</SecondaryButton>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GoalDialog({ open, onOpenChange, goal, busy, onSave, onArchive }: {
  open: boolean; onOpenChange: (o: boolean) => void; goal?: GoalRow | null; busy?: boolean; onSave: (g: GoalInput) => void; onArchive?: () => void;
}) {
  const [f, setF] = useState<GoalInput>({ title: "", target_value: 100, current_value: 0, unit: "%", deadline: null });
  useEffect(() => {
    if (open) setF(goal ? { title: goal.title, target_value: Number(goal.target_value), current_value: Number(goal.current_value), unit: goal.unit, deadline: goal.deadline } : { title: "", target_value: 100, current_value: 0, unit: "%", deadline: null });
  }, [open, goal]);
  const bad = !f.title.trim() || !(f.target_value > 0) || !(f.current_value >= 0);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader><DialogTitle>{goal ? "Update goal" : "Add goal"}</DialogTitle><DialogDescription className="sr-only">Goal details</DialogDescription></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!bad) onSave(f); }}>
          <Field id="g-title" label="Goal"><Input id="g-title" required maxLength={200} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Complete Quant syllabus" /></Field>
          <div className="grid grid-cols-3 gap-2">
            <Field id="g-cur" label="Progress"><Input id="g-cur" type="number" min={0} step="any" value={f.current_value} onChange={(e) => setF({ ...f, current_value: Number(e.target.value) })} /></Field>
            <Field id="g-tgt" label="Target"><Input id="g-tgt" type="number" min={0.01} step="any" value={f.target_value} onChange={(e) => setF({ ...f, target_value: Number(e.target.value) })} /></Field>
            <Field id="g-unit" label="Unit"><Input id="g-unit" maxLength={20} value={f.unit ?? ""} onChange={(e) => setF({ ...f, unit: e.target.value })} /></Field>
          </div>
          <Field id="g-dl" label="Deadline (optional)"><Input id="g-dl" type="date" value={f.deadline ?? ""} onChange={(e) => setF({ ...f, deadline: e.target.value || null })} /></Field>
          <PrimaryButton type="submit" className="w-full" disabled={bad || busy}>{busy ? "Saving..." : "Save goal"}</PrimaryButton>
          {goal && (
            <div className="grid grid-cols-2 gap-2">
              <SecondaryButton disabled={busy} onClick={() => onSave({ ...f, current_value: f.target_value })}>Mark complete</SecondaryButton>
              <SecondaryButton disabled={busy} onClick={onArchive}>Archive</SecondaryButton>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
