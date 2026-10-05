# Rise OS

RK STUDY — MASTER WEBSITE DEVELOPMENT

1. PROJECT IDENTITY

Build a modern, mobile-first educational web application called:

RK Study

Tagline:

"Study Smart. Practice Better. Rank Higher."

RK Study is an educational platform primarily designed for SSC CGL aspirants.

The product should feel like a serious competitive-exam preparation platform — clean, fast, focused and practical.

Do NOT make it look like a generic school/college website.

---

2. PRIMARY OBJECTIVE

Create a complete SSC CGL preparation platform where students can:

- Learn concepts

- Read short notes

- Practice questions

- Take quizzes

- Attempt mock tests

- Track performance

- Revise weak topics

- Follow a study plan

- View daily current affairs 

- Monitor preparation progress

- All must update automatically 

The application should be designed for long-term use rather than being a simple landing page.

---

3. TARGET USERS

Primary users:

- SSC CGL aspirants

- Beginners preparing for SSC CGL

- Students preparing alongside college

- Students preparing for government examinations

The interface must remain simple enough for beginners while providing advanced functionality for serious aspirants.

---

4. DESIGN PHILOSOPHY

Use a:

- Minimal

- Modern

- Professional

- Academic

- Mobile-first

- App-like

- Fast

- Distraction-free design.

Reference the usability philosophy of modern education applications such as:

- clean dashboards

- bottom navigation

- cards

- progress indicators

- concise information

- clear hierarchy

Do NOT copy another application's design.

RK Study must have its own visual identity.

---

5. BRANDING

Brand name:

RK Study

Use a simple professional logo based around:

RK 

with a subtle education/study visual identity.

Avoid complicated logos.

Suggested visual direction:

- White/light neutral backgrounds

- Dark text

- One primary brand accent

- Subtle secondary colors

- Rounded cards

- Soft shadows

- Clean typography

Do not use excessive gradients, glassmorphism or flashy animations.

---

6. RESPONSIVE DESIGN

The application must work perfectly on:

- Android phones

- iPhones

- Tablets

- Laptops

- Desktop screens

Priority:

Mobile → Tablet → Desktop

Do not simply shrink the desktop layout for mobile.

Create a genuine mobile-first experience.

---

7. MAIN NAVIGATION

Use a bottom navigation bar on mobile.

Main sections:

1. Home

2. Practice

3. Articles & Current affairs 

4. Tests

5. Profile

On desktop, convert this into an appropriate sidebar/top navigation system.

---

8. HOME DASHBOARD

Create a personalized student dashboard.

Top section:

Good Morning, [Name] 👋

Show:

- Today's progress

- Study streak

- Questions solved

- Accuracy

- Current rank

- Weekly progress

Example:

Today's Progress

45 / 60 Questions

75% Complete

---

Quick Actions

Create cards for:

- Daily Practice

- Daily Mock

- Current Affairs

- Revision

- AI Coach

---

Continue Learning

Show the last topic studied.

Example:

Quantitative Aptitude

Percentage

Progress: 68%

Button:

Continue

---

Today's Target

Show:

- Questions target

- Study time target

- Revision target

Example:

Today's Target

☐ 30 Quant questions

☐ 20 Reasoning questions

☐ 15 English questions

☐ 20 minutes Current Affairs

---

9. PRACTICE SECTION

Create a dedicated Practice page.

Subjects:

Quantitative Aptitude

General Intelligence & Reasoning

English Language

General Awareness

Each subject should contain:

- Topics

- Subtopics

- Practice questions

- Difficulty level

- Question count

- Accuracy

- Progress

Example:

Quantitative Aptitude

- Number System

- Percentage

- Profit & Loss

- Ratio & Proportion

- Average

- Time & Work

- Time, Speed & Distance

- Simple Interest

- Compound Interest

- Algebra

- Geometry

- Mensuration

- Trigonometry

- Data Interpretation

---

10. QUESTION PRACTICE ENGINE

Create a reusable question-practice system.

Each question should support:

- Question

- 4 options

- Submit answer

- Correct/incorrect indication

- Explanation

- Next question

- Bookmark

- Report question

Track:

- Attempts

- Correct answers

- Wrong answers

- Accuracy

- Time spent

- Topic performance

Do not hard-code question logic separately for every subject.

Create reusable components.

---

11. DAILY QUIZ

Create a Daily Quiz feature.

Example:

Today's SSC Quiz

20 Questions

Subjects:

- Quant

- Reasoning

- English

- General Awareness

Show:

- Score

- Accuracy

- Time

- Correct answers

- Wrong answers

- Explanation

Save the result to the user's profile.

---

12. MOCK TEST SYSTEM

Create a complete mock-test engine.

Support:

SSC CGL Tier-I style

Subjects:

- General Intelligence & Reasoning

- General Awareness

- Quantitative Aptitude

- English Comprehension

Default configuration:

100 Questions

200 Marks

60 Minutes

Scoring:

+2 for correct

−0.50 for incorrect

0 for unanswered

The test interface should include:

- Question number palette

- Current question

- Mark for review

- Previous

- Next

- Save answer

- Submit test

- Timer

Prevent accidental submission.

Show a confirmation dialog before final submission.

---



13. TEST RESULT ANALYSIS



After every test show:



Overall Score



Example:



142 / 200



Then:



- Accuracy

- Attempted

- Correct

- Wrong

- Skipped

- Time taken

- Percentile/rank when sufficient data exists



Subject breakdown:



Subject| Score| Accuracy

Quant| 36| 72%

Reasoning| 42| 84%

English| 38| 76%

GA| 26| 52%



Also show:



Strong Topics



Weak Topics



Topics to Revise



Recommended Practice



---



14. REVISION ENGINE



Create a Revision section.



Automatically identify weak areas from previous performance.



Example:



Revision Recommended



1. Percentage

2. Time & Work

3. Indian Polity

4. Synonyms & Antonyms



Allow:



Start Revision



The revision engine should prioritize:



- Frequently wrong questions

- Bookmarked questions

- Weak topics

- Previously attempted questions

- Recently learned topics



---



15. AI COACH



Create AI Coach as a major feature.



Do NOT create a separate "AI Notes Generator" page.



AI Coach should be conversational.



The student can ask:



- Explain Percentage simply

- Give me 10 questions on Profit & Loss

- Create a study plan

- Analyze my performance

- Explain this wrong answer

- Give me a revision test

- Teach me Indian Polity

- Test me on vocabulary

- What should I study today?



AI Coach should understand the student's:



- Performance

- Weak topics

- Study progress

- Test history

- Goals



when such data is available.



Create suggested prompts:



Explain a Topic



Give Me Practice



Analyze My Performance



Create My Study Plan



Start a Revision Test



---



16. AI SAFETY / QUALITY



AI-generated educational content must:



- Clearly distinguish facts from generated explanations

- Avoid confidently inventing factual information

- Provide explanations for answers

- Prefer SSC-relevant information

- Keep answers concise unless the user asks for detail



For current affairs, use verified/current data sources where available.



---



17. CURRENT AFFAIRS



Create a Current Affairs section.



Categories:



- National

- International

- Economy

- Banking

- Science & Technology

- Sports

- Awards

- Government Schemes

- Appointments

- Important Days



Each item should contain:



- Date

- Category

- Headline

- Short explanation

- SSC relevance



Add:



Daily Current Affairs Quiz



---



18. NOTES



Create concise SSC-oriented notes.



Notes should be:



- Short

- Exam-focused

- Easy to revise

- Structured with headings

- Important facts highlighted



Avoid unnecessarily long textbook-style content.



Each topic should have:



- Concept

- Important formulas/facts

- Shortcuts where appropriate

- Examples

- Common mistakes

- Quick revision section



---



19. STUDY PLAN



Create a personalized Study Plan page.



Allow students to specify:



- Exam target

- Available study hours

- Current preparation level

- Strong subjects

- Weak subjects



Generate:



- Daily targets

- Weekly targets

- Revision schedule

- Mock-test schedule



Display progress visually.



---



20. PROGRESS ANALYTICS



Create a detailed Analytics page.



Track:



- Questions solved

- Tests attempted

- Accuracy

- Study time

- Subject performance

- Topic performance

- Weekly progress

- Monthly progress

- Streak



Use clean charts.



Do not overload the dashboard with charts.



---



21. LEADERBOARD



Create an optional leaderboard.



Display:



- Rank

- Student name

- Score

- Questions solved

- Accuracy



Use privacy-friendly usernames if required.



Allow students to hide their profile from the leaderboard.



---



22. PROFILE



Profile page should contain:



- Name

- Profile photo

- Target exam

- Preparation level

- Study streak

- Total questions

- Total tests

- Accuracy

- Achievements



Settings:



- Notifications

- Theme

- Account

- Privacy

- Logout



---



23. ACHIEVEMENTS



Create achievement badges.



Examples:



First Test



Completed your first mock test.



100 Questions



Solved 100 questions.



7 Day Streak



Studied for 7 consecutive days.



Accuracy Master



Achieved 90%+ accuracy in a test.



Use badges sparingly.



---



24. DATABASE ARCHITECTURE



Use Supabase.



Recommended entities:



profiles



- id

- name

- avatar

- target_exam

- preparation_level

- created_at



subjects



- id

- name

- description



topics



- id

- subject_id

- name

- description



questions



- id

- subject_id

- topic_id

- question

- option_a

- option_b

- option_c

- option_d

- correct_answer

- explanation

- difficulty

- source

- created_at



question_attempts



- id

- user_id

- question_id

- selected_answer

- is_correct

- time_taken

- attempted_at



tests



- id

- title

- type

- duration

- total_questions

- total_marks



test_attempts



- id

- user_id

- test_id

- score

- attempted

- correct

- wrong

- skipped

- accuracy

- time_taken

- completed_at



study_progress



- id

- user_id

- topic_id

- progress

- accuracy

- questions_solved

- last_studied



bookmarks



- id

- user_id

- question_id



current_affairs



- id

- title

- category

- content

- date

- source



Use proper foreign keys and indexes.



Do not duplicate data unnecessarily.



---



25. AUTHENTICATION



Use Supabase Authentication.



Support:



- Email/password

- Google authentication if configured



Pages:



- Login

- Signup

- Forgot Password

- Reset Password



After login:



→ Home Dashboard



Protect authenticated pages.



Do not expose private user data through public database queries.



Implement appropriate Supabase Row Level Security.



---



26. ADMIN SYSTEM



Create an admin architecture without exposing admin functionality to normal users.



Admin should eventually be able to:



- Add questions

- Edit questions

- Delete questions

- Create tests

- Manage topics

- Publish current affairs

- Manage users

- View platform analytics



Use role-based access.



Example roles:



student



admin



Do not rely only on frontend checks for admin security.



---



27. PERFORMANCE



Prioritize performance.



Use:



- Lazy loading

- Code splitting where appropriate

- Optimized images

- Pagination

- Database indexes

- Efficient queries

- Caching where appropriate



Avoid unnecessary API calls.



Do not reload the entire dashboard when a small component changes.



---



28. UX RULES



Every important action must provide feedback.



Examples:



Loading:



Loading your progress...



Success:



Progress saved.



Error:



Something went wrong. Please try again.



Empty state:



No questions available yet.



Avoid technical error messages for normal users.



---



29. MOBILE UX



On mobile:



- Large tap targets

- Bottom navigation

- Sticky important actions

- Minimal scrolling where possible

- Avoid tiny text

- Avoid crowded tables



Question screens should be especially optimized for one-handed use.



---



30. DARK MODE



Support:



- Light Mode

- Dark Mode

- System Default



Remember the user's preference.



---



31. ACCESSIBILITY



Implement:



- Proper semantic HTML

- Keyboard navigation

- Accessible buttons

- Proper labels

- Sufficient contrast

- Screen-reader-friendly structure



Do not use icons without accessible labels.



---



32. COMPONENT ARCHITECTURE



Use reusable components.



Examples:



- Button

- Card

- ProgressBar

- QuestionCard

- SubjectCard

- TopicCard

- TestCard

- ResultCard

- StatCard

- Modal

- BottomNavigation

- Header

- EmptyState

- LoadingState



Do not duplicate components unnecessarily.



---



33. TECH STACK



Use:



- React

- TypeScript

- Tailwind CSS

- Supabase

- Modern component architecture



Keep the existing project architecture if one already exists.



Do NOT unnecessarily rewrite working code.



If an existing project is provided, inspect it first and preserve working functionality.



---



34. IMPORTANT DEVELOPMENT RULE



Before making changes:



1. Inspect the existing project.

2. Understand the current architecture.

3. Reuse existing components.

4. Identify what already works.

5. Make only necessary changes.

6. Do not rebuild working features unnecessarily.

7. Avoid breaking existing functionality.

8. Avoid creating duplicate components.

9. Keep database changes backward compatible whenever possible.



---



35. DEVELOPMENT PRIORITY



Build in this order:



Phase 1 — Foundation



- Branding

- Authentication

- Navigation

- Home dashboard

- Profile



Phase 2 — Learning



- Subjects

- Topics

- Notes

- Practice engine

- Question database



Phase 3 — Testing



- Daily quiz

- Mock tests

- Timer

- Question navigation

- Results



Phase 4 — Intelligence



- Analytics

- Revision engine

- Study planner

- AI Coach



Phase 5 — Content



- Current affairs

- Daily quizzes

- Additional notes

- Question expansion



Phase 6 — Advanced



- Leaderboard

- Achievements

- Admin dashboard

- Notifications

- PWA support



---



36. PWA



Make RK Study installable as a Progressive Web App.



Include:



- Web app manifest

- App icon

- Splash/loading experience

- Service worker

- Installable mobile experience



Where appropriate, support offline access for static notes and previously cached content.



Do not claim that dynamic AI/current-affairs functionality works offline.



---



37. SEO / LANDING PAGE



Create a public landing page for logged-out users.



Hero:



RK Study



Your SSC CGL Preparation, Simplified.



Supporting text:



Learn. Practice. Test. Analyze. Improve.



CTA:



Start Preparing



Secondary CTA:



Explore Features



Sections:



- Why RK Study

- Practice

- Mock Tests

- AI Coach

- Analytics

- Current Affairs

- FAQ

- Footer



Keep it clean and conversion-focused.



---



38. FOOTER



Include:



RK Study



Study Smart. Practice Better. Rank Higher.



Links:



- About

- Contact

- Privacy Policy

- Terms

- Disclaimer



---



39. CONTENT PRINCIPLES



All educational content should prioritize:



Accuracy > Quantity



Clarity > Complexity



Revision > Information overload



Practice > Passive reading



The application should help students actually improve their exam performance.



---



40. FINAL QUALITY REQUIREMENT



The final product should feel like a real educational product, not a prototype.



Before considering the work complete, verify:



- Mobile responsiveness

- Desktop responsiveness

- Authentication

- Navigation

- Database queries

- Question practice

- Test submission

- Score calculation

- Progress tracking

- Protected routes

- Supabase RLS

- Loading states

- Error states

- Empty states

- Accessibility

- PWA functionality



Do not add unnecessary features merely to make the application look larger.



Build the smallest robust architecture that can scale.



Most importantly:



RK Study is not RankUp with a different name.



Treat RK Study as the new official product identity and use RK Study consistently throughout the application.



Do not use the old name RankUp anywhere in the UI, metadata, titles, navigation, footer, page headings, or user-facing content.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/605c89ea-f890-49fa-988e-10ada12ed352).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
