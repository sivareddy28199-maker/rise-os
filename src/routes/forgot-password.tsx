import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, Logo } from "@/components/rk/ui";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — RK Study" },
      { name: "description", content: "Reset your RK Study password." },
      { property: "og:title", content: "Forgot password — RK Study" },
      { property: "og:description", content: "Reset your RK Study password." },
    ],
  }),
  component: Page,
});

function Page() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    if (error) toast.error("Something went wrong. Please try again.");
    else setSent(true);
  }
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <Link to="/" className="mb-8" aria-label="RK Study home"><Logo /></Link>
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-bold">Reset your password</h1>
        {sent ? (
          <p className="mt-2 text-sm text-muted-foreground">If an account exists for {email}, we've sent a reset link to it.</p>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" /></div>
            <Button className="h-11 w-full" disabled={busy}>{busy ? "Sending..." : "Send reset link"}</Button>
          </form>
        )}
        <Link to="/auth" className="mt-4 block text-center text-sm font-semibold text-primary">Back to log in</Link>
      </Card>
    </div>
  );
}
