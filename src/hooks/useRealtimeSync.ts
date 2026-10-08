import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/** Keeps Home/Routines/Progress in sync when tasks, habits or goals change on another device. */
export function useRealtimeSync() {
  const qc = useQueryClient();
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(() => qc.invalidateQueries({ queryKey: ["dashboard"] }), 400);
    };
    const ch = supabase.channel("rise-sync");
    for (const table of ["tasks", "habits", "habit_logs", "goals"]) ch.on("postgres_changes", { event: "*", schema: "public", table }, refresh);
    ch.subscribe();
    return () => { clearTimeout(t); supabase.removeChannel(ch); };
  }, [qc]);
}

const LOCAL_KEY = "rise-os:quiz-results";

/**
 * The old prototype stored quiz scores only in this browser. Those scores were calculated on the
 * device, so they can't be verified and are never copied into the account. Tell the student once,
 * then clear them and mark the account as handled.
 */
export function useLocalDataMigration(migrated: boolean | undefined) {
  useEffect(() => {
    if (migrated !== false) return;
    let count = 0;
    try { count = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]").length; } catch { count = 0; }
    const finish = async () => {
      localStorage.removeItem(LOCAL_KEY);
      const { data } = await supabase.auth.getUser();
      if (data.user) await supabase.from("profiles").update({ local_data_migrated: true }).eq("id", data.user.id);
    };
    if (!count) { void finish(); return; }
    toast(`Found ${count} quiz result${count > 1 ? "s" : ""} saved only on this device`, {
      description: "They were scored on this device, so they can't be added to your verified progress. New attempts are saved to your account.",
      duration: 15000,
      action: { label: "Got it", onClick: () => void finish() },
    });
  }, [migrated]);
}
