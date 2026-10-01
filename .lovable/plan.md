# RK Study — Build Plan

This is a big brief, so I'll build it in stages. Each stage gives you something you can use before the next one starts.

## Stage 1 (this build): Foundation, Learning, Testing
- **Look and feel:** a calm, academic design with a light neutral background, dark text and one deep teal brand color, plus an "RK" logo mark. Light, dark and system themes, and the app remembers your choice.
- **Public landing page:** the hero ("Your SSC CGL Preparation, Simplified."), Why RK Study, Practice, Mock Tests, AI Coach, Analytics, Current Affairs, FAQ and the footer. The About, Contact, Privacy, Terms and Disclaimer pages each get their own simple page.
- **Accounts:** email/password and Google sign-in, plus Login, Signup, Forgot Password and Reset Password pages. After sign-in you land on the Home dashboard. Every private page requires sign-in.
- **Navigation:** a bottom bar on phones and a sidebar on desktop, with Home, Practice, Articles & CA, Tests and Profile.
- **Home dashboard:** your greeting, today's progress, streak, questions solved, accuracy, weekly progress, quick actions, Continue Learning and Today's Target. All of it comes from your real activity.
- **Practice:** the 4 subjects, each with its topics and your progress and accuracy per topic. One shared question screen handles options, submit, right/wrong, explanation, next, bookmark and report.
- **Notes:** short notes for each topic (concept, formulas, shortcuts, an example, common mistakes, quick revision).
- **Daily Quiz:** 20 mixed questions, with results saved to your profile.
- **Mock Test:** SSC CGL Tier-I style. It has a question palette, mark for review, previous/next, a timer that submits automatically when time runs out, and a confirmation step before you submit. Scoring is +2 for a correct answer and −0.5 for a wrong one. The results page shows the subject breakdown and your strong and weak topics.
- **Current Affairs:** you can filter by category, and there's a daily quiz on the latest items.
- **Profile:** your stats, achievements, theme setting, leaderboard privacy switch and logout.
- **Starter content:** sample questions for every subject and a set of sample current affairs items. You'll need to replace or expand these with verified content.

## Stage 2: Intelligence
AI Coach chat that knows your performance, the Revision engine (built from your wrong answers, bookmarks and weak topics), the Study Plan generator and a charts-based Analytics page.

## Stage 3: Advanced
Leaderboard, an admin area (add and edit questions, tests, topics and current affairs; manage users), and an installable phone app with offline notes.

## Technical details
- Lovable Cloud provides the database, sign-in and storage.
- The tables follow the brief: profiles, subjects, topics, questions, question_attempts, tests, test_attempts, study_progress, bookmarks and current_affairs. Roles live in their own user_roles table.
- Row-level security keeps each user's data private. Questions, topics and current affairs are readable by signed-in users, and only admins can change them.
- Correct answers are never sent to the browser in bulk. Answers are checked and mock tests are scored on the server.
- Reusable components: StatCard, ProgressBar, QuestionCard, SubjectCard, TopicCard, TestCard, EmptyState and LoadingState.
