import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo, Card } from "@/components/rk/ui";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ mode: z.enum(["login", "signup"]).optional() }),
  head: () => ({
    meta: [
      { title: "Log in or sign up — RK Study" },
      { name: "description", content: "Sign in to RK Study to continue your SSC CGL preparation." },
      { property: "og:title", content: "Log in — RK Study" },
      { property: "og:description", content: "Sign in to RK Study to continue your SSC CGL preparation." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: m } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">(m ?? "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => data.session && navigate({ to: "/home", replace: true }));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => s && navigate({ to: "/home", replace: true }));
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: window.location.origin + "/home", data: { name } },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error && /invalid/i.test(err.message) ? "Incorrect email or password." : err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Google sign-in didn't work. Please try again.");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Link to="/" aria-label="RK Study home" className="mb-8"><Logo /></Link>
      <Card className="w-full max-w-sm p-6">
        {sent ? (
          <div className="text-center">
            <h1 className="text-xl font-bold">Check your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">We sent a confirmation link to {email}. Open it to finish creating your account.</p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{mode === "login" ? "Log in to continue preparing." : "Start your SSC CGL preparation."}</p>
            <Button variant="outline" className="mt-5 h-11 w-full" onClick={google}>Continue with Google</Button>
            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <div className="space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-11" /></div>
              )}
              <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" /></div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><Label htmlFor="pw">Password</Label>
                  {mode === "login" && <Link to="/forgot-password" className="text-xs font-semibold text-primary">Forgot password?</Link>}</div>
                <Input id="pw" type="password" minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
              </div>
              <Button type="submit" className="h-11 w-full" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}</Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "login" ? "New to RK Study? " : "Already have an account? "}
              <button className="font-semibold text-primary" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
