import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ClipboardList, Newspaper, BarChart3, Target, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicHeader, Footer } from "@/components/rk/PublicLayout";
import { Card, ProgressBar } from "@/components/rk/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RK Study — Your SSC CGL Preparation, Simplified" },
      { name: "description", content: "Learn, practise, take SSC CGL Tier-I mock tests, follow daily current affairs and track your progress with RK Study." },
      { property: "og:title", content: "RK Study — Your SSC CGL Preparation, Simplified" },
      { property: "og:description", content: "Learn. Practice. Test. Analyze. Improve. SSC CGL preparation in one focused app." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: BookOpen, title: "Practice", text: "Topic-wise questions for Quant, Reasoning, English and GA, each with a clear explanation." },
  { icon: ClipboardList, title: "Mock Tests", text: "Tier-I style tests with a timer, question palette, mark for review and +2 / −0.5 scoring." },
  { icon: Newspaper, title: "Articles & Current Affairs", text: "Daily current affairs with SSC relevance, strategy articles and a daily CA quiz." },
  { icon: BarChart3, title: "Analytics", text: "Accuracy, streaks and subject-wise scores that show where you're losing marks." },
  { icon: RotateCcw, title: "Revision", text: "Bookmark tough questions and revise your weak topics before the exam." },
  { icon: Target, title: "Daily Targets", text: "A clear daily goal for each subject keeps you consistent." },
];

const FAQ = [
  ["Is RK Study only for SSC CGL?", "It's built around the SSC CGL Tier-I pattern, but the practice also helps with other SSC and government exams."],
  ["How is the mock test scored?", "+2 for each correct answer, −0.50 for each wrong answer and 0 for an unanswered question, just like Tier-I."],
  ["Do I need to pay?", "You can sign up and start practising for free."],
  ["Can I use it on my phone?", "Yes. RK Study is designed for phones first and works on tablets and laptops too."],
];

function Landing() {
  return (
    <div className="min-h-dvh">
      <PublicHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">RK Study</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Your SSC CGL Preparation, Simplified.</h1>
            <p className="mt-4 text-lg text-muted-foreground">Learn. Practice. Test. Analyze. Improve.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/auth" search={{ mode: "signup" }}>Start Preparing</Link></Button>
              <Button asChild size="lg" variant="outline"><a href="#features">Explore Features</a></Button>
            </div>
          </div>
          <Card className="mx-auto w-full max-w-sm space-y-4 p-6" >
            <p className="text-sm text-muted-foreground">Today's Progress</p>
            <p className="font-display text-3xl font-bold">45 <span className="text-lg text-muted-foreground">/ 60 questions</span></p>
            <ProgressBar value={75} label="Example progress" />
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-sm">
              {[["🔥 12", "Streak"], ["82%", "Accuracy"], ["142", "Mock score"]].map(([v, l]) => (
                <div key={l} className="rounded-xl bg-muted p-3"><div className="font-bold">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">Example dashboard</p>
          </Card>
        </section>

        <section id="features" className="border-y bg-card py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold">Why RK Study</h2>
            <p className="mt-2 text-muted-foreground">Everything you need for Tier-I, without the clutter.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border bg-background p-5">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-3 text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <Accordion type="single" collapsible className="mt-6">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center">
            <Button asChild size="lg"><Link to="/auth" search={{ mode: "signup" }}>Start Preparing</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
