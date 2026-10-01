import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileQuery } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { useTheme, type ThemePref } from "@/lib/theme";
import { Card, PageHeader, LoadingState } from "@/components/rk/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — RK Study" }, { name: "description", content: "Your RK Study profile and settings." }, { property: "og:title", content: "Profile — RK Study" }, { property: "og:description", content: "Your RK Study profile and settings." }] }),
  component: Profile,
});

function Profile() {
  const p = useQuery(profileQuery);
  const { theme, setTheme } = useTheme();
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function logout() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  if (p.isLoading) return <LoadingState />;
  return (
    <div className="space-y-4">
      <PageHeader title={p.data?.name || "Profile"} subtitle={`${p.data?.target_exam} · ${p.data?.preparation_level}`} />
      <Card>
        <p className="font-bold">Theme</p>
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
          {(["light", "dark", "system"] as ThemePref[]).map((t) => (
            <Button key={t} role="radio" aria-checked={theme === t} variant={theme === t ? "default" : "outline"} onClick={() => setTheme(t)} className="capitalize">{t}</Button>
          ))}
        </div>
      </Card>
      <Button variant="outline" className="h-11 w-full" onClick={logout}>Log out</Button>
    </div>
  );
}
