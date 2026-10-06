import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Flag, Timer, Grid3x3, CheckCircle2, XCircle, MinusCircle, Trophy } from "lucide-react";
import { MODES, pickQuestions, saveResult, score, SCORING, type QuizResult } from "@/lib/quiz";
import { Card, IconTile, PrimaryButton, SecondaryButton, ProgressBar, ProgressRing } from "@/components/rise/ui";
import { cn } from "@/lib/utils";
import { fmtTime } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/quiz")({
  validateSearch: z.object({ mode: z.enum(["daily", "mock"]).catch("daily") }),
  head: () => ({ meta: [{ title: "Quiz & Mock Test — Rise OS" }, { name: "description", content: "Timed daily quiz and full mock test with instant scoring." }, { property: "og:title", content: "Quiz & Mock Test — Rise OS" }, { property: "og:description", content: "Timed daily quiz and full mock test." }] }),
  component: QuizPage,
});

function QuizPage() {
  const { mode } = Route.useSearch();
  return <Runner key={mode} mode={mode} />;
}

function Runner({ mode }: { mode: "daily" | "mock" }) {
  const cfg = MODES[mode];
  const qs = useMemo(() => pickQuestions(mode), [mode]);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => qs.map(() => null));
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [left, setLeft] = useState(cfg.minutes * 60);
  const [palette, setPalette] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const submitted = useRef(false);

  const submit = () => {
    if (submitted.current) return;
    submitted.current = true;
    const s = score(qs, answers);
    const r: QuizResult = { id: crypto.randomUUID(), mode, date: new Date().toISOString(), seconds: cfg.minutes * 60 - left, answers, questionIds: qs.map((q) => q.id), ...s };
    saveResult(r);
    setConfirm(false);
    setResult(r);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [started, result]);
  useEffect(() => { if (started && left <= 0) submit(); });

  if (result) return <Results result={result} mode={mode} qs={qs} />;

  if (!started)
    return (
      <div className="space-y-4">
        <h1 className="text-[26px] font-extrabold tracking-tight">{cfg.title}</h1>
        <Card className="space-y-3">
          {[["Questions", qs.length], ["Time", `${cfg.minutes} min`], ["Correct", `+${SCORING.correct}`], ["Wrong", `${SCORING.wrong}`], ["Skipped", "0"]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
          ))}
        </Card>
        <p className="text-xs text-muted-foreground">The timer starts when you begin. The test submits automatically when time runs out.</p>
        <PrimaryButton className="w-full" onClick={() => setStarted(true)}>Start {cfg.title}</PrimaryButton>
      </div>
    );

  const q = qs[i]!;
  const answered = answers.filter((a) => a != null).length;
  const toggleMark = () => setMarked((m) => { const n = new Set(m); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0"><p className="text-xs text-muted-foreground">{cfg.title}</p><p className="text-sm font-bold">Question {i + 1} of {qs.length}</p></div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-bold tabular-nums", left < 60 && "border-destructive text-destructive")} aria-live="polite"><Timer className="size-4" aria-hidden />{fmtTime(Math.max(0, left))}</span>
      </div>
      <ProgressBar value={(answered / qs.length) * 100} label="Answered" />

      <Card>
        <p className="text-xs font-semibold text-primary">{q.subject}</p>
        <p className="mt-1.5 text-[15px] font-semibold leading-relaxed">{q.q}</p>
        <div className="mt-4 space-y-2" role="radiogroup">
          {q.options.map((o, k) => {
            const sel = answers[i] === k;
            return (
              <button key={k} type="button" role="radio" aria-checked={sel} onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? (x === k ? null : k) : x)))}
                className={cn("flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition", sel ? "border-primary bg-secondary font-semibold" : "hover:bg-muted")}>
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold", sel && "border-primary bg-primary text-primary-foreground")}>{String.fromCharCode(65 + k)}</span>{o}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-[auto_auto_1fr_auto] gap-2">
        <SecondaryButton aria-label="Previous" disabled={i === 0} onClick={() => setI(i - 1)} className="px-3"><ChevronLeft className="size-4" /></SecondaryButton>
        <SecondaryButton aria-label="Question palette" onClick={() => setPalette((p) => !p)} className="px-3"><Grid3x3 className="size-4" /></SecondaryButton>
        <SecondaryButton onClick={toggleMark} className={cn(marked.has(i) && "border-tone-violet text-tone-violet")}><Flag className="size-4" />{marked.has(i) ? "Marked" : "Mark"}</SecondaryButton>
        {i < qs.length - 1 ? <PrimaryButton aria-label="Next" onClick={() => setI(i + 1)} className="px-3"><ChevronRight className="size-4" /></PrimaryButton> : <PrimaryButton onClick={() => setConfirm(true)}>Submit</PrimaryButton>}
      </div>

      {palette && (
        <Card>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
            {qs.map((_, k) => (
              <button key={k} type="button" onClick={() => { setI(k); setPalette(false); }} aria-label={`Go to question ${k + 1}`}
                className={cn("grid h-9 place-items-center rounded-lg border text-xs font-bold", answers[k] != null && "border-primary bg-primary text-primary-foreground", marked.has(k) && "ring-2 ring-tone-violet", k === i && "outline outline-2 outline-offset-2 outline-foreground")}>{k + 1}</button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Blue = answered • Purple ring = marked for review</p>
        </Card>
      )}
      <SecondaryButton className="w-full" onClick={() => setConfirm(true)}>Submit test</SecondaryButton>

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 z-[60] grid place-items-end bg-foreground/30 p-4 sm:place-items-center">
          <Card className="w-full max-w-sm space-y-3 p-5">
            <h2 id="confirm-title" className="text-lg font-bold">Submit {cfg.title}?</h2>
            <p className="text-sm text-muted-foreground">Answered {answered} of {qs.length}. {qs.length - answered} unanswered, {marked.size} marked for review. You can't change answers after submitting.</p>
            <div className="grid grid-cols-2 gap-2"><SecondaryButton onClick={() => setConfirm(false)}>Keep going</SecondaryButton><PrimaryButton onClick={submit}>Submit</PrimaryButton></div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Results({ result: r, mode, qs }: { result: QuizResult; mode: "daily" | "mock"; qs: ReturnType<typeof pickQuestions> }) {
  const acc = r.correct + r.wrong ? Math.round((r.correct / (r.correct + r.wrong)) * 100) : 0;
  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-4">
        <ProgressRing value={(Math.max(0, r.score) / r.max) * 100} size={72} stroke={7} t="violet"><span className="text-xs">{r.score}</span></ProgressRing>
        <div className="min-w-0"><p className="text-xs text-muted-foreground">{MODES[mode].title} • saved to Progress</p><p className="text-2xl font-extrabold">{r.score} <span className="text-base text-muted-foreground">/ {r.max}</span></p><p className="text-xs text-muted-foreground">Accuracy {acc}% • {fmtTime(r.seconds)} taken</p></div>
      </Card>
      <div className="grid grid-cols-3 gap-2.5">
        {[{ l: "Correct", v: r.correct, i: CheckCircle2, t: "mint" }, { l: "Wrong", v: r.wrong, i: XCircle, t: "rose" }, { l: "Skipped", v: r.skipped, i: MinusCircle, t: "amber" }].map((s) => (
          <Card key={s.l} className="flex flex-col items-center gap-1 p-3"><IconTile icon={s.i} t={s.t as "mint"} size="sm" /><p className="font-extrabold">{s.v}</p><p className="text-[11px] text-muted-foreground">{s.l}</p></Card>
        ))}
      </div>
      <h2 className="text-base font-bold">Detailed solutions</h2>
      <div className="space-y-2.5">
        {qs.map((q, k) => {
          const a = r.answers[k];
          const ok = a === q.answer;
          return (
            <Card key={q.id} className="p-3.5">
              <p className="text-sm font-semibold">{k + 1}. {q.q}</p>
              <p className={cn("mt-1.5 text-xs font-semibold", a == null ? "text-tone-amber" : ok ? "text-tone-mint" : "text-tone-rose")}>
                {a == null ? "Skipped" : ok ? `Correct (+${SCORING.correct})` : `Your answer: ${q.options[a]} (${SCORING.wrong})`}
              </p>
              {!ok && <p className="text-xs">Correct: <b>{q.options[q.answer]}</b></p>}
              <p className="mt-1 text-xs text-muted-foreground">{q.explain}</p>
            </Card>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link to="/progress" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-card text-sm font-semibold"><Trophy className="size-4" />Progress</Link>
        <Link to="/learn" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">Back to Learn</Link>
      </div>
    </div>
  );
}
