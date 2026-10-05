import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import { ChatBubble, ChatComposer, PageHeader } from "@/components/rise/ui";

export const Route = createFileRoute("/_authenticated/max")({
  head: () => ({ meta: [{ title: "Max — Rise OS" }, { name: "description", content: "Max, your personal study and productivity assistant." }, { property: "og:title", content: "Max — Rise OS" }, { property: "og:description", content: "Your personal assistant." }] }),
  component: Max,
});

type Msg = { id: number; from: "user" | "ai"; time: string; body: ReactNode };

const SEED: Msg[] = [
  { id: 1, from: "user", time: "9:41 AM", body: "What should I study today?" },
  { id: 2, from: "ai", time: "9:41 AM", body: (
    <>
      <p>Based on your progress, I recommend focusing on <b>Number Systems</b> today. You're 20% below your target in this topic.</p>
      <p className="mt-2">I can also:</p>
      <ul className="mt-1 list-disc pl-5"><li>Create a study session</li><li>Add a task for revision</li><li>Generate practice questions</li></ul>
    </>
  ) },
  { id: 3, from: "user", time: "9:42 AM", body: "Create a task to revise Quant tomorrow." },
  { id: 4, from: "ai", time: "9:42 AM", body: (
    <div className="flex gap-3"><CheckCircle className="size-6 shrink-0 fill-tone-mint text-card" aria-hidden /><div><p className="font-semibold">Added task: Revise Quant</p><p className="text-xs text-muted-foreground">Tomorrow, 09:00 AM</p></div></div>
  ) },
];

const QUICK = ["Plan my day", "Add task", "Explain topic"];
const now = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function Max() {
  const [msgs, setMsgs] = useState(SEED);
  const [text, setText] = useState("");
  const send = (t: string) => {
    if (!t.trim()) return;
    const id = Date.now();
    setMsgs((m) => [...m, { id, from: "user", time: now(), body: t }, { id: id + 1, from: "ai", time: now(), body: "Max will be connected soon. This is a preview reply." }]);
    setText("");
  };
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="MAX" subtitle="Your personal assistant." />
      <div className="space-y-3">{msgs.map((m) => <ChatBubble key={m.id} from={m.from} time={m.time}>{m.body}</ChatBubble>)}</div>
      <div className="sticky bottom-[calc(5.5rem+env(safe-area-inset-bottom))] space-y-2.5 bg-background/90 pt-2 backdrop-blur md:bottom-4">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {QUICK.map((q) => <button key={q} type="button" onClick={() => send(q)} className="shrink-0 rounded-full border bg-card px-3.5 py-1.5 text-[13px] font-medium hover:border-primary/40">{q}</button>)}
        </div>
        <ChatComposer value={text} onChange={setText} onSend={() => send(text)} />
      </div>
    </div>
  );
}
