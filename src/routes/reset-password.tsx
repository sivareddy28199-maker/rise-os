import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, Logo } from "@/components/rk/ui";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — RK Study" },
      { name: "description", content: "Choose a new password for your RK Study account." },
      { property: "og:title", content: "Set a new password — RK Study" },
      { property: "og:description", content: "Choose a new password for your RK Study account." },
    ],
  }),
  component: Page,
});

function Page() {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error("This reset link has expired. Please request a new one.");
    toast.success("Password updated.");
    navigate({ to: "/home" });
  }
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="mb-8"><Logo /></div>
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-bold">Set a new password</h1>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div className="space-y-1.5"><Label htmlFor="pw">New password</Label><Input id="pw" type="password" minLength={6} required value={pw} onChange={(e) => setPw(e.target.value)} className="h-11" /></div>
          <Button className="h-11 w-full" disabled={busy}>{busy ? "Saving..." : "Update password"}</Button>
        </form>
      </Card>
    </div>
  );
}
