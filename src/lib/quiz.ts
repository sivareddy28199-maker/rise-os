// Mock question bank + local result storage. Swap for FastAPI endpoints later.
export type QuizQ = { id: string; subject: string; q: string; options: string[]; answer: number; explain: string };
export type QuizMode = "daily" | "mock";
export type QuizResult = {
  id: string; mode: QuizMode; date: string; score: number; max: number;
  correct: number; wrong: number; skipped: number; seconds: number;
  answers: (number | null)[]; questionIds: string[];
};

export const SCORING = { correct: 2, wrong: -0.5 };

export const BANK: QuizQ[] = [
  { id: "q1", subject: "Mathematics", q: "What is the LCM of 12, 18 and 24?", options: ["36", "48", "72", "144"], answer: 2, explain: "12 = 2²·3, 18 = 2·3², 24 = 2³·3 → LCM = 2³·3² = 72." },
  { id: "q2", subject: "Mathematics", q: "25% of 480 is:", options: ["100", "120", "140", "96"], answer: 1, explain: "480 × 1/4 = 120." },
  { id: "q3", subject: "Mathematics", q: "A finishes a work in 10 days and B in 15 days. Together they take:", options: ["5 days", "6 days", "8 days", "12.5 days"], answer: 1, explain: "1/10 + 1/15 = 1/6 → 6 days." },
  { id: "q4", subject: "Mathematics", q: "The unit digit of 7⁴ is:", options: ["1", "3", "7", "9"], answer: 0, explain: "7⁴ = 2401." },
  { id: "q5", subject: "Mathematics", q: "Simple interest on ₹5000 at 10% p.a. for 2 years:", options: ["₹500", "₹1000", "₹1050", "₹1200"], answer: 1, explain: "5000 × 10 × 2 / 100 = 1000." },
  { id: "q6", subject: "Mathematics", q: "√1764 = ?", options: ["38", "42", "44", "46"], answer: 1, explain: "42 × 42 = 1764." },
  { id: "q7", subject: "Mathematics", q: "Average of the first 10 natural numbers:", options: ["5", "5.5", "6", "10"], answer: 1, explain: "Sum 55 ÷ 10 = 5.5." },
  { id: "q8", subject: "Reasoning", q: "Find the odd one out: 2, 3, 5, 9, 11", options: ["3", "5", "9", "11"], answer: 2, explain: "9 is the only non-prime." },
  { id: "q9", subject: "Reasoning", q: "3, 6, 12, 24, ?", options: ["36", "42", "48", "30"], answer: 2, explain: "Each term doubles." },
  { id: "q10", subject: "Reasoning", q: "If CAT = 24, then DOG = ?", options: ["24", "26", "27", "25"], answer: 1, explain: "Letter positions: 4 + 15 + 7 = 26." },
  { id: "q11", subject: "Reasoning", q: "Facing North, you turn right twice. You now face:", options: ["East", "West", "South", "North"], answer: 2, explain: "N → E → S." },
  { id: "q12", subject: "English", q: "Synonym of 'Abundant':", options: ["Scarce", "Plentiful", "Rare", "Tiny"], answer: 1, explain: "Abundant means plentiful." },
  { id: "q13", subject: "English", q: "Antonym of 'Ancient':", options: ["Old", "Antique", "Modern", "Historic"], answer: 2, explain: "Opposite of ancient is modern." },
  { id: "q14", subject: "English", q: "Choose the correct spelling:", options: ["Acommodate", "Accomodate", "Accommodate", "Acomodate"], answer: 2, explain: "Double c, double m." },
  { id: "q15", subject: "English", q: "He is good ___ mathematics.", options: ["in", "at", "on", "with"], answer: 1, explain: "'Good at' a subject." },
  { id: "q16", subject: "General Awareness", q: "The capital of Australia is:", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2, explain: "Canberra is the capital." },
  { id: "q17", subject: "General Awareness", q: "The Constitution of India came into force on:", options: ["15 Aug 1947", "26 Nov 1949", "26 Jan 1950", "2 Oct 1950"], answer: 2, explain: "26 January 1950." },
  { id: "q18", subject: "General Awareness", q: "The largest planet in the Solar System:", options: ["Saturn", "Jupiter", "Neptune", "Earth"], answer: 1, explain: "Jupiter." },
  { id: "q19", subject: "General Awareness", q: "Article 21 of the Indian Constitution deals with:", options: ["Right to Equality", "Protection of life and personal liberty", "Freedom of religion", "Right to education"], answer: 1, explain: "Article 21 — life and personal liberty." },
  { id: "q20", subject: "General Awareness", q: "How many states does India have?", options: ["27", "28", "29", "30"], answer: 1, explain: "28 states and 8 UTs." },
];

export const MODES: Record<QuizMode, { title: string; count: number; minutes: number }> = {
  daily: { title: "Daily Quiz", count: 10, minutes: 10 },
  mock: { title: "Full Mock Test", count: 20, minutes: 60 },
};

export function pickQuestions(mode: QuizMode): QuizQ[] {
  if (mode === "mock") return BANK;
  const day = Math.floor(Date.now() / 86400000);
  return [...BANK].sort((a, b) => ((+a.id.slice(1) * 31 + day) % 17) - ((+b.id.slice(1) * 31 + day) % 17)).slice(0, MODES.daily.count);
}

export function score(qs: QuizQ[], answers: (number | null)[]) {
  let correct = 0, wrong = 0, skipped = 0;
  qs.forEach((q, i) => (answers[i] == null ? skipped++ : answers[i] === q.answer ? correct++ : wrong++));
  return { correct, wrong, skipped, score: correct * SCORING.correct + wrong * SCORING.wrong, max: qs.length * SCORING.correct };
}

const KEY = "rise-os:quiz-results";
export function loadResults(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
export function saveResult(r: QuizResult) {
  localStorage.setItem(KEY, JSON.stringify([r, ...loadResults()].slice(0, 50)));
}
