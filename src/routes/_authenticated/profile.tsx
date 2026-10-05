import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { User, ChevronRight, Target, LayoutGrid, Moon, Bell, Sparkles, Database, Workflow, Info, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/data";
import { Card, PageHeader, ProfileRow } from "@/components/rise/ui";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Rise OS" }, { name: "description", content: "Manage your account and preferences." }, { property: "og:title", content: "Profile — Rise OS" }, { property: "og:description", content: "Manage your account and preferences." }] }),
  component: Profile,
});

const ROWS = [
  { icon: Target, title: "Study Goals" },
  { icon: LayoutGrid, title: "Subjects & Preferences" },
  { icon: Moon, title: "Appearance", value: "Light" },
  { icon: Bell, title: "Notifications" },
  { icon: Sparkles, title: "AI Settings" },
  { icon: Database, title: "Data & Backup" },
  { icon: Workflow, title: "Automation & Integrations" },
];

function Profile() {
  const p = useQuery(profileQuery);
  const nav = useNavigate();
  const { data: s } = useQuery({ queryKey: ["auth-email"], queryFn: async () => (await supabase.auth.getUser()).data.user?.email ?? "" });
  return (
    <div className="space-y-4">
      <PageHeader title="Profile" subtitle="Manage your account and preferences." />
      <Card className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary"><User className="size-6" aria-hidden /></span>
        <div className="min-w-0 flex-1"><p className="truncate font-bold">{p.data?.name || "RK User"}</p><p className="truncate text-sm text-muted-foreground">{s || "user.name@example.com"}</p></div>
        <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
      </Card>
      <Card className="divide-y overflow-hidden p-0">{ROWS.map((r) => <ProfileRow key={r.title} {...r} onClick={() => toast(`${r.title} coming soon`)} />)}</Card>
      <Card className="divide-y overflow-hidden p-0">
        <ProfileRow icon={Info} title="About Rise OS" value="v1.0.0" />
        <ProfileRow icon={LogOut} title="Log Out" danger onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }} />
      </Card>
    </div>
  );
}
