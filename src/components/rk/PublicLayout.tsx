import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "./ui";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" aria-label="RK Study home"><Logo /></Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/auth">Log in</Link></Button>
          <Button asChild size="sm"><Link to="/auth" search={{ mode: "signup" }}>Start Preparing</Link></Button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const links = [
    ["/about", "About"], ["/contact", "Contact"], ["/privacy", "Privacy Policy"], ["/terms", "Terms"], ["/disclaimer", "Disclaimer"],
  ] as const;
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">Study Smart. Practice Better. Rank Higher.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map(([to, l]) => <Link key={to} to={to} className="text-muted-foreground hover:text-foreground">{l}</Link>)}
        </nav>
      </div>
      <p className="pb-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} RK Study</p>
    </footer>
  );
}

export function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <PublicHeader />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed">
        <h1 className="text-3xl font-bold">{title}</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}
