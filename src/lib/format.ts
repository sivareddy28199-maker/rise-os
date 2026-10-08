export const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning," : h < 17 ? "Good afternoon," : "Good evening,";
};

export const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

/** "09:30:00" -> "9:30 AM" */
export function fmtClock(t: string | null | undefined) {
  if (!t) return "";
  const [h = 0, m = 0] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function fmtRange(start: string | null, end: string | null) {
  if (!start) return "Any time";
  return end ? `${fmtClock(start)} – ${fmtClock(end)}` : fmtClock(start);
}

export function fmtDuration(seconds: number) {
  const s = Math.max(0, Math.round(seconds || 0));
  if (s < 3600) return `${Math.round(s / 60)}m`;
  return `${(s / 3600).toFixed(1).replace(/\.0$/, "")}h`;
}

export const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

/** Local calendar date as YYYY-MM-DD, offset by n days. */
export function isoDate(base: string, n = 0) {
  const d = new Date(`${base}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function dayLabel(date: string, today: string) {
  if (date === today) return "Today";
  if (date === isoDate(today, 1)) return "Tomorrow";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function friendlyError(e: unknown) {
  if (typeof navigator !== "undefined" && !navigator.onLine) return "Unable to sync. Check your connection and try again.";
  const msg = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : "";
  if (/fetch|network/i.test(msg)) return "Unable to sync. Check your connection and try again.";
  if (/no questions available/i.test(msg)) return "There are no questions for this selection yet. Try another topic or difficulty.";
  if (/check constraint|violates/i.test(msg)) return "Please check the details and try again.";
  return "Something went wrong. Please try again.";
}
