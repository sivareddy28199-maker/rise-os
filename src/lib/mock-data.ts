// Mock data for the Rise OS frontend. Replace with FastAPI calls later.
export type TaskCategory = "Study" | "Personal" | "Learning" | "Other";
export type Task = { id: string; title: string; category: TaskCategory; time: string; done: boolean };

export const todayTasks: Task[] = [
  { id: "t1", title: "Revise Quant", category: "Study", time: "10:00 AM – 11:00 AM", done: false },
  { id: "t2", title: "Practice 20 questions", category: "Study", time: "11:30 AM – 12:00 PM", done: false },
  { id: "t3", title: "Read current affairs", category: "Learning", time: "08:00 AM – 08:30 AM", done: true },
  { id: "t4", title: "Evening walk", category: "Personal", time: "06:00 PM – 06:30 PM", done: true },
  { id: "t5", title: "Plan tomorrow", category: "Other", time: "09:30 PM – 09:45 PM", done: true },
];

export const upcomingTasks: Task[] = [
  { id: "u1", title: "Mock test (Quant)", category: "Study", time: "Tomorrow 9:00 AM", done: false },
];

export const habits = [
  { id: "h1", title: "Morning Exercise", streak: 6, done: true },
  { id: "h2", title: "Read 20 pages", streak: 4, done: true },
  { id: "h3", title: "Drink 2L water", streak: 2, done: false },
  { id: "h4", title: "No phone after 10 PM", streak: 0, done: false },
];

export const goals = [
  { id: "g1", title: "Complete Quant syllabus", meta: "By 30 Nov", pct: 62 },
  { id: "g2", title: "Score 150+ in mock", meta: "By 15 Dec", pct: 40 },
  { id: "g3", title: "30-day study streak", meta: "Ongoing", pct: 100 },
];

export const weekly = [
  { day: "Mon", h: 1.5 }, { day: "Tue", h: 1.2 }, { day: "Wed", h: 2.2 }, { day: "Thu", h: 1.8 },
  { day: "Fri", h: 2.8 }, { day: "Sat", h: 1.0 }, { day: "Sun", h: 2.0 },
];

export const recentTopics = [
  { title: "Number Systems", subject: "Mathematics", done: 4, total: 12 },
  { title: "Time and Work", subject: "Mathematics", done: 0, total: 10 },
  { title: "Percentage", subject: "Mathematics", done: 6, total: 8 },
  { title: "Syllogism", subject: "Reasoning", done: 3, total: 9 },
];

export const weakTopics = [
  { title: "Number Systems", subject: "Mathematics", pct: 40 },
  { title: "Para Jumbles", subject: "English", pct: 48 },
  { title: "Blood Relations", subject: "Reasoning", pct: 55 },
];

export const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

export const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning," : h < 17 ? "Good afternoon," : "Good evening,";
};
