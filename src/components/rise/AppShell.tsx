import { Link, Outlet } from "@tanstack/react-router";
import { Home, CalendarCheck, BookOpen, BarChart3, Sparkles, Bell, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardQuery } from "@/services/dashboard";
import { useRealtimeSync, useLocalDataMigration } from "@/hooks/useRealtimeSync";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/routines", label: "Routines", icon: CalendarCheck },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/max", label: "Max", icon: Sparkles },
  { to: "/progress", label: "Progress", icon: BarChart3 },
] as const;

export function Brand() {
  return (
    <span className="inline-flex items-center gap-1 text-lg font-extrabold tracking-tight">
      Rise OS <Sparkles className="size-4 fill-primary text-primary" aria-hidden />
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 md:px-8">
        <Link to="/home" aria-label="Rise OS home" className="md:invisible"><Brand /></Link>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Notifications" onClick={() => toast("No new notifications")} className="relative grid size-10 place-items-center rounded-xl hover:bg-muted">
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-tone-rose ring-2 ring-background" />
          </button>
          <Link to="/profile" aria-label="Account" className="grid size-9 place-items-center rounded-full text-primary-foreground ring-2 ring-card" style={{ background: "var(--gradient-ai)" }}>
            <User className="size-4.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
      <Link to="/home" className="mb-8 px-3 pt-2"><Brand /></Link>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {[...NAV, { to: "/profile", label: "Profile", icon: User } as const].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            activeProps={{ className: "!bg-sidebar-accent !text-sidebar-accent-foreground" }}>
            <Icon className="size-5" aria-hidden />{label === "Max" ? "Max AI" : label}
          </Link>
        ))}
      </nav>
      <p className="mt-auto px-3 text-xs text-muted-foreground">Your personal command center.</p>
    </aside>
  );
}

export function MobileBottomNav() {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-center px-2">
        {NAV.map(({ to, label, icon: Icon }) =>
          to === "/max" ? (
            <Link key={to} to={to} aria-label="Max AI assistant" className="flex justify-center">
              {({ isActive }) => (
                <span className={cn("-mt-7 grid size-14 place-items-center rounded-full text-primary-foreground shadow-[0_10px_24px_-8px_var(--tone-violet)] ring-4 ring-background transition active:scale-95", isActive && "ring-secondary")} style={{ background: "var(--gradient-ai)" }}>
                  <span className="flex flex-col items-center leading-none"><Sparkles className="size-5" aria-hidden /><span className="mt-0.5 text-[10px] font-bold">AI</span></span>
                </span>
              )}
            </Link>
          ) : (
            <Link key={to} to={to} className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-muted-foreground">
              {({ isActive }) => (
                <>
                  <span className={cn("grid h-7 w-12 place-items-center rounded-full transition", isActive && "bg-secondary text-primary")}><Icon className="size-5" aria-hidden /></span>
                  <span className={cn(isActive && "text-primary")}>{label}</span>
                </>
              )}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}

export function AppShell() {
  const { data } = useQuery(dashboardQuery);
  useRealtimeSync();
  useLocalDataMigration(data?.profile?.local_data_migrated);
  return (
    <div className="min-h-dvh overflow-x-hidden md:flex">
      <DesktopSidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto w-full max-w-4xl px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2 md:px-8 md:pb-12 md:pt-4">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
