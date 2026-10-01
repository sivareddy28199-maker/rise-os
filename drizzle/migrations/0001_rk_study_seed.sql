
insert into public.subjects (slug, name, short_name, description, sort_order) values
('reasoning','General Intelligence & Reasoning','Reasoning','Analogy, series, coding, puzzles and logical reasoning',1),
('ga','General Awareness','GA','History, polity, geography, economy, science and current affairs',2),
('quant','Quantitative Aptitude','Quant','Arithmetic, algebra, geometry, trigonometry and DI',3),
('english','English Comprehension','English','Vocabulary, grammar, idioms and comprehension',4);

insert into public.topics (subject_id, slug, name, sort_order)
select s.id, v.slug, v.name, v.ord from (values
 ('quant','number-system','Number System',1),('quant','percentage','Percentage',2),('quant','profit-loss','Profit & Loss',3),
 ('quant','ratio-proportion','Ratio & Proportion',4),('quant','average','Average',5),('quant','time-work','Time & Work',6),
 ('quant','time-speed-distance','Time, Speed & Distance',7),('quant','simple-interest','Simple Interest',8),
 ('quant','compound-interest','Compound Interest',9),('quant','algebra','Algebra',10),('quant','geometry','Geometry',11),
 ('quant','mensuration','Mensuration',12),('quant','trigonometry','Trigonometry',13),('quant','data-interpretation','Data Interpretation',14),
 ('reasoning','analogy','Analogy',1),('reasoning','classification','Classification',2),('reasoning','series','Series',3),
 ('reasoning','coding-decoding','Coding-Decoding',4),('reasoning','blood-relations','Blood Relations',5),
 ('reasoning','direction-sense','Direction Sense',6),('reasoning','syllogism','Syllogism',7),('reasoning','order-ranking','Order & Ranking',8),
 ('english','synonyms','Synonyms',1),('english','antonyms','Antonyms',2),('english','idioms','Idioms & Phrases',3),
 ('english','one-word','One Word Substitution',4),('english','spelling','Spelling',5),('english','error-spotting','Error Spotting',6),
 ('english','fill-blanks','Fill in the Blanks',7),('english','voice','Active & Passive Voice',8),
 ('ga','history','History',1),('ga','polity','Indian Polity',2),('ga','geography','Geography',3),('ga','economy','Economy',4),
 ('ga','science','General Science',5),('ga','static-gk','Static GK',6),('ga','current-affairs','Current Affairs',7)
) v(subj, slug, name, ord) join public.subjects s on s.slug = v.subj;

update public.topics set notes = '{"concept":"Percentage means \"per hundred\". x% of N = (x/100) × N.","formulas":["% change = (Change ÷ Original) × 100","If A is r% more than B, B is [r/(100+r)]×100 % less than A","Successive change a% and b%: a + b + ab/100"],"shortcuts":["10% of a number: move the decimal one place left","Learn fraction values: 1/8 = 12.5%, 1/6 = 16.67%, 1/3 = 33.33%"],"example":"Price rises 20% then falls 20%. Net = 20 − 20 − 400/100 = −4% (a 4% fall).","mistakes":["Taking the base as the new value instead of the original","Adding successive percentages directly"],"revision":["Base value matters","Use fraction equivalents","Successive change formula"]}' where slug = 'percentage';
update public.topics set notes = '{"concept":"Profit = SP − CP. Profit % is always calculated on CP unless stated otherwise.","formulas":["Profit % = (Profit ÷ CP) × 100","SP = CP × (100 + P%) ÷ 100","Discount % is calculated on Marked Price","SP = MP × (100 − D%) ÷ 100"],"shortcuts":["Two successive discounts a% and b% = a + b − ab/100"],"example":"CP ₹400, SP ₹500 → Profit ₹100 → 100/400 × 100 = 25%.","mistakes":["Calculating profit % on SP","Calculating discount on CP instead of MP"],"revision":["Profit on CP","Discount on MP","Successive discount formula"]}' where slug = 'profit-loss';
update public.topics set notes = '{"concept":"Work = Rate × Time. If A finishes a job in n days, A does 1/n of it per day.","formulas":["A and B together: (a × b) ÷ (a + b) days","LCM method: total work = LCM of the days"],"shortcuts":["Take total work as the LCM so each rate is a whole number"],"example":"A takes 12 days and B takes 24. Work = 24 units; A does 2/day, B does 1/day; together 3/day → 8 days.","mistakes":["Adding days instead of adding rates"],"revision":["Add rates, not days","Use the LCM method"]}' where slug = 'time-work';
update public.topics set notes = '{"concept":"Simple interest is charged on the principal only, so it is the same every year.","formulas":["SI = (P × R × T) ÷ 100","Amount = P + SI"],"shortcuts":["If a sum doubles in T years at SI, R = 100 ÷ T"],"example":"₹5000 at 8% for 3 years: 5000 × 8 × 3 ÷ 100 = ₹1200.","mistakes":["Using months as years — convert T to years"],"revision":["Same interest every year","Doubling rule R = 100/T"]}' where slug = 'simple-interest';
update public.topics set notes = '{"concept":"The Constitution is the supreme law. Fundamental Rights are in Part III (Articles 12–35).","formulas":["Art 14: Equality before law","Art 17: Abolition of untouchability","Art 21: Protection of life and personal liberty","Art 21A: Right to education (6–14 yrs)","Art 32: Right to constitutional remedies"],"shortcuts":["Part III = Rights, Part IV = DPSP, Part IVA = Fundamental Duties (Art 51A)"],"example":"Article 32 was called the \"heart and soul\" of the Constitution by Dr B. R. Ambedkar.","mistakes":["Confusing Art 32 (Supreme Court) with Art 226 (High Courts)"],"revision":["Part III = FRs","Art 21 and 32 are asked most often"]}' where slug = 'polity';
update public.topics set notes = '{"concept":"A synonym is a word with the same or nearly the same meaning.","formulas":["Abundant = Plentiful","Benevolent = Kind","Candid = Frank","Diligent = Hardworking","Ephemeral = Short-lived"],"shortcuts":["Check the root: bene = good, mal = bad"],"example":"BENEVOLENT → Kind (bene = good).","mistakes":["Choosing the antonym under time pressure"],"revision":["Learn 10 words daily","Revise with roots"]}' where slug = 'synonyms';

insert into public.questions (subject_id, topic_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, source)
select t.subject_id, t.id, v.q, v.a, v.b, v.c, v.d, v.ans, v.ex, v.diff, 'RK Study starter set' from (values
 ('percentage','If 20% of a number is 50, what is 60% of the same number?','100','120','150','180','C','Number = 50 × 100/20 = 250. 60% of 250 = 150. Shortcut: 60% is 3 × 20%, so 3 × 50 = 150.','easy'),
 ('percentage','A''s salary is 25% more than B''s. By what percent is B''s salary less than A''s?','20%','25%','15%','30%','A','Use r/(100+r) × 100 = 25/125 × 100 = 20%.','medium'),
 ('profit-loss','An article bought for ₹400 is sold for ₹500. What is the profit percentage?','20%','25%','30%','15%','B','Profit = 100. Profit % = 100/400 × 100 = 25%.','easy'),
 ('profit-loss','The marked price of a bag is ₹800 and a 15% discount is given. What is the selling price?','₹680','₹700','₹720','₹650','A','SP = 800 × 85/100 = ₹680.','easy'),
 ('ratio-proportion','₹720 is divided in the ratio 4 : 5. What is the larger share?','₹320','₹400','₹360','₹420','B','Total parts 9. One part = 80. Larger share = 5 × 80 = ₹400.','easy'),
 ('average','What is the average of the first 10 natural numbers?','5','5.5','6','4.5','B','Average of the first n natural numbers = (n+1)/2 = 11/2 = 5.5.','easy'),
 ('time-work','A can finish a job in 12 days and B in 24 days. Working together, how long will they take?','8 days','6 days','9 days','10 days','A','Together = (12 × 24)/(12 + 24) = 288/36 = 8 days.','easy'),
 ('time-speed-distance','72 km/h is equal to how many m/s?','20 m/s','18 m/s','25 m/s','22 m/s','A','Multiply by 5/18: 72 × 5/18 = 20 m/s.','easy'),
 ('simple-interest','What is the simple interest on ₹5000 at 8% per annum for 3 years?','₹1000','₹1200','₹1500','₹1800','B','SI = 5000 × 8 × 3/100 = ₹1200.','easy'),
 ('compound-interest','What is the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually?','₹2000','₹2100','₹2200','₹2010','B','Amount = 10000 × 1.1 × 1.1 = 12100. CI = ₹2100.','medium'),
 ('number-system','What is the LCM of 12 and 18?','36','72','24','54','A','12 = 2²×3, 18 = 2×3². LCM = 2²×3² = 36.','easy'),
 ('algebra','If x + 1/x = 3, what is x² + 1/x²?','7','9','11','5','A','Square both sides: x² + 2 + 1/x² = 9, so x² + 1/x² = 7.','medium'),
 ('trigonometry','What is the value of sin²θ + cos²θ?','0','1','2','Depends on θ','B','This is a fundamental identity: sin²θ + cos²θ = 1 for every θ.','easy'),
 ('mensuration','What is the area of a circle with radius 7 cm? (π = 22/7)','154 cm²','144 cm²','164 cm²','132 cm²','A','Area = πr² = 22/7 × 49 = 154 cm².','easy'),
 ('geometry','What is the sum of the interior angles of a hexagon?','540°','720°','900°','360°','B','Sum = (n − 2) × 180° = 4 × 180° = 720°.','easy'),
 ('series','Find the next number: 2, 6, 12, 20, 30, ?','40','42','44','36','B','Differences are 4, 6, 8, 10, so the next is +12: 30 + 12 = 42.','easy'),
 ('series','Find the next number: 3, 9, 27, 81, ?','162','243','324','216','B','Each term is multiplied by 3: 81 × 3 = 243.','easy'),
 ('series','Find the next letter: A, C, F, J, ?','O','N','P','M','A','Gaps are +2, +3, +4, +5. J (10) + 5 = 15 = O.','medium'),
 ('analogy','Doctor : Hospital :: Teacher : ?','School','Book','Student','Class','A','A doctor works in a hospital; a teacher works in a school.','easy'),
 ('analogy','4 : 16 :: 6 : ?','36','24','30','42','A','The second number is the square of the first: 6² = 36.','easy'),
 ('classification','Find the odd one out: Apple, Mango, Potato, Banana','Apple','Mango','Potato','Banana','C','Potato is a vegetable (tuber); the others are fruits.','easy'),
 ('classification','Find the odd one out: 2, 3, 5, 9','2','3','5','9','D','2, 3 and 5 are prime numbers; 9 is not.','easy'),
 ('coding-decoding','If CAT is coded as DBU, how is DOG coded?','EPH','EPI','DPH','FQH','A','Each letter moves one step forward: D→E, O→P, G→H.','easy'),
 ('blood-relations','A is the brother of B. B is the mother of C. How is A related to C?','Father','Uncle','Brother','Grandfather','B','A is the brother of C''s mother, so A is C''s maternal uncle.','easy'),
 ('direction-sense','A man walks 5 km north, turns right and walks 3 km. Which direction is he facing now?','East','West','North','South','A','Turning right while facing north makes him face east.','easy'),
 ('order-ranking','Ravi is 7th from the left and 12th from the right in a row. How many people are in the row?','18','19','20','17','A','Total = 7 + 12 − 1 = 18.','easy'),
 ('syllogism','Statements: All cats are animals. All animals are living beings. Conclusion: All cats are living beings.','Definitely true','Definitely false','Uncertain','None of these','A','Cats ⊂ Animals ⊂ Living beings, so all cats are living beings.','easy'),
 ('synonyms','Choose the synonym of ABUNDANT.','Scarce','Plentiful','Rare','Meagre','B','Abundant means existing in large quantities, i.e. plentiful.','easy'),
 ('synonyms','Choose the synonym of BENEVOLENT.','Kind','Cruel','Greedy','Lazy','A','Benevolent means well-meaning and kind (bene = good).','easy'),
 ('antonyms','Choose the antonym of ANCIENT.','Old','Modern','Antique','Archaic','B','Ancient means very old; its opposite is modern.','easy'),
 ('antonyms','Choose the antonym of OPTIMISTIC.','Hopeful','Pessimistic','Cheerful','Positive','B','Optimistic means hopeful; its opposite is pessimistic.','easy'),
 ('idioms','What does the idiom "a piece of cake" mean?','Very easy','Delicious','A small share','A celebration','A','"A piece of cake" means something very easy to do.','easy'),
 ('idioms','What does the idiom "break the ice" mean?','To start a conversation','To destroy something','To cool down','To quarrel','A','"Break the ice" means to ease tension and start a conversation.','easy'),
 ('one-word','One who cannot be corrected','Incorrigible','Infallible','Invincible','Illegible','A','Incorrigible means not able to be corrected or reformed.','easy'),
 ('one-word','A person who knows many languages','Polyglot','Bibliophile','Philanthropist','Misanthrope','A','A polyglot knows several languages. A bibliophile loves books.','easy'),
 ('spelling','Choose the correctly spelt word.','Accommodation','Acommodation','Accomodation','Acomodation','A','Accommodation has a double c and a double m.','medium'),
 ('fill-blanks','He has been living here ___ 2015.','for','since','from','by','B','Use "since" with a point in time and "for" with a period of time.','easy'),
 ('error-spotting','Find the error: Each of the students (A) / have submitted (B) / the assignment (C) / on time (D).','A','B','C','D','B','"Each" is singular, so it should be "has submitted".','medium'),
 ('voice','Change to passive voice: "She writes a letter."','A letter is written by her.','A letter was written by her.','A letter has been written by her.','A letter is being written by her.','A','Simple present active → is/am/are + V3 in passive.','easy'),
 ('polity','In which Part of the Indian Constitution are the Fundamental Rights given?','Part II','Part III','Part IV','Part V','B','Fundamental Rights are in Part III (Articles 12–35).','easy'),
 ('polity','Article 21 of the Indian Constitution deals with:','Right to equality','Protection of life and personal liberty','Freedom of religion','Right to constitutional remedies','B','Article 21 guarantees protection of life and personal liberty.','easy'),
 ('polity','The President of India is elected by:','An electoral college','The Lok Sabha only','The people directly','The Rajya Sabha only','A','The electoral college is made up of the elected members of both Houses of Parliament and of the State Legislative Assemblies (including Delhi and Puducherry).','medium'),
 ('history','In which year was the Battle of Plassey fought?','1757','1764','1857','1761','A','The Battle of Plassey (1757) was fought between Robert Clive and Siraj-ud-Daulah.','easy'),
 ('history','Who founded the Maurya Empire?','Chandragupta Maurya','Ashoka','Bindusara','Bimbisara','A','Chandragupta Maurya founded it around 321 BCE with the help of Chanakya.','easy'),
 ('geography','Which is the longest river in India?','Ganga','Godavari','Yamuna','Brahmaputra','A','The Ganga (about 2,525 km) is the longest river flowing within India.','easy'),
 ('geography','The Tropic of Cancer does NOT pass through which state?','Gujarat','Odisha','Rajasthan','West Bengal','B','It passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.','medium'),
 ('economy','In which year was the Reserve Bank of India established?','1935','1947','1949','1969','A','The RBI was set up on 1 April 1935 and nationalised in 1949.','easy'),
 ('science','What is the chemical formula of common salt?','NaCl','KCl','NaOH','HCl','A','Common salt is sodium chloride, NaCl.','easy'),
 ('science','Deficiency of Vitamin C causes:','Scurvy','Rickets','Beriberi','Night blindness','A','Scurvy is caused by Vitamin C deficiency. Rickets is caused by lack of Vitamin D.','easy'),
 ('science','What is the SI unit of force?','Newton','Joule','Pascal','Watt','A','Force is measured in newtons (N). Joule is energy, pascal is pressure, watt is power.','easy'),
 ('static-gk','What is the National Aquatic Animal of India?','Gangetic Dolphin','Crocodile','Blue Whale','Olive Ridley Turtle','A','The Gangetic river dolphin was declared the National Aquatic Animal in 2009.','easy'),
 ('current-affairs','National Sports Day in India is celebrated on the birth anniversary of:','Major Dhyan Chand','Milkha Singh','Sachin Tendulkar','P. T. Usha','A','National Sports Day (29 August) marks the birth anniversary of hockey legend Major Dhyan Chand.','easy'),
 ('current-affairs','The International Day of Non-Violence is observed on:','2 October','15 August','30 January','26 November','A','The UN observes it on 2 October, Mahatma Gandhi''s birth anniversary.','easy'),
 ('current-affairs','How much income support does PM-KISAN give eligible farmer families each year?','₹6,000','₹10,000','₹12,000','₹4,000','A','PM-KISAN (launched 2019) pays ₹6,000 a year in three equal instalments.','easy'),
 ('current-affairs','International Day of Yoga is observed every year on:','21 June','5 June','21 March','1 July','A','The UN declared 21 June as International Day of Yoga in 2014; it was first observed in 2015.','easy')
) v(slug, q, a, b, c, d, ans, ex, diff) join public.topics t on t.slug = v.slug;

insert into public.tests (title, type, duration, total_questions, total_marks) values
('SSC CGL Tier-I Full Mock','mock',60,100,200),
('Daily SSC Quiz','daily_quiz',15,20,40);

insert into public.current_affairs (title, category, content, ssc_relevance, date, source) values
('International Day of Non-Violence observed on 2 October','Important Days','The UN observes 2 October, Mahatma Gandhi''s birth anniversary, as the International Day of Non-Violence. The General Assembly adopted the resolution in 2007.','Important days and the year of the UN resolution are frequent GA questions.','2026-10-01','UN'),
('National Sports Day honours Major Dhyan Chand','Sports','India celebrates National Sports Day on 29 August, the birth anniversary of hockey legend Major Dhyan Chand. The Major Dhyan Chand Khel Ratna is India''s highest sporting honour.','Sports awards and their namesakes are asked often in SSC GA.','2026-08-29','Ministry of Youth Affairs & Sports'),
('PM-KISAN: ₹6,000 a year income support for farmers','Government Schemes','Pradhan Mantri Kisan Samman Nidhi was launched in February 2019. Eligible farmer families get ₹6,000 a year in three instalments of ₹2,000, paid directly into their bank accounts.','Scheme launch year, benefit amount and ministry are common questions.','2026-09-28','Ministry of Agriculture & Farmers Welfare'),
('Ayushman Bharat PM-JAY gives ₹5 lakh health cover','Government Schemes','Launched in September 2018, PM-JAY gives health cover of up to ₹5 lakh per family per year for secondary and tertiary hospital care.','Cover amount and launch year are frequently asked.','2026-09-23','National Health Authority'),
('Hindi Diwas observed on 14 September','Important Days','Hindi Diwas marks 14 September 1949, the day the Constituent Assembly adopted Hindi in Devanagari script as an official language of the Union (Article 343).','Link the day to Article 343 for polity questions.','2026-09-14','Ministry of Home Affairs'),
('Teachers'' Day: birth anniversary of Dr S. Radhakrishnan','Important Days','India celebrates Teachers'' Day on 5 September, the birth anniversary of Dr Sarvepalli Radhakrishnan, India''s first Vice-President and second President.','Important days and their personalities are a GA staple.','2026-09-05','Ministry of Education'),
('RBI: India''s central bank since 1935','Banking','The Reserve Bank of India was set up on 1 April 1935 under the RBI Act, 1934, and nationalised in 1949. Its headquarters is in Mumbai.','Banking basics questions often ask for the founding year and the Act.','2026-09-20','Reserve Bank of India'),
('International Day of Yoga on 21 June','International','The UN General Assembly declared 21 June as International Day of Yoga in December 2014, following India''s proposal. It was first observed in 2015.','The year of declaration and first celebration are commonly asked.','2026-06-21','United Nations');

insert into public.articles (slug, title, summary, content, category, read_minutes, published_at) values
('negative-marking-strategy','Negative Marking: When to Attempt and When to Skip','In SSC CGL Tier-I, every wrong answer costs 0.5 marks. Here''s how to make that work in your favour.','## The maths\nEach correct answer gives +2 and each wrong answer costs −0.5. Guessing blindly among 4 options has an expected value of 0.125 marks, so it is close to zero and not worth the risk.\n\n## The 50-50 rule\n- If you can eliminate 2 options, attempting is worth it: expected value = +0.75.\n- If you can eliminate only 1 option, attempt only when you are fairly sure.\n- If you cannot eliminate any, skip it.\n\n## Practise it\nUse full mocks to track how often your "educated guesses" turn out right. If that is above 50%, keep making them.','Strategy',3,'2026-09-30'),
('tier1-90-day-plan','A 90-Day SSC CGL Tier-I Plan','A simple three-phase plan: build concepts, practise by topic, then take mocks every day.','## Days 1–30: Concepts\n- Quant: Arithmetic first (Percentage, Profit & Loss, Ratio, Time & Work).\n- Reasoning: Series, Analogy, Coding.\n- English: 10 new words and 1 grammar rule every day.\n- GA: Static GK and Polity basics.\n\n## Days 31–60: Topic practice\n- Solve 60–80 questions a day by topic.\n- Revise your wrong answers every Sunday.\n\n## Days 61–90: Mocks\n- One full mock every day, followed by a 30-minute analysis.\n- Revise weak topics from your results.','Study Plan',4,'2026-09-25'),
('percentage-shortcuts','Five Percentage Shortcuts Every Aspirant Needs','Percentage is the base of Profit & Loss, SI/CI and DI. Learn these shortcuts once and use them everywhere.','## 1. Learn fraction values\n1/8 = 12.5%, 1/6 = 16.67%, 1/3 = 33.33%, 1/12 = 8.33%.\n\n## 2. Successive change\nFor changes of a% and b%, the net change is a + b + ab/100.\n\n## 3. More than / less than\nIf A is r% more than B, then B is r/(100+r) × 100 % less than A.\n\n## 4. x% of y = y% of x\n8% of 50 is the same as 50% of 8, which is 4.\n\n## 5. Constant product\nIf price rises by r%, consumption must fall by r/(100+r) × 100 % to keep spending the same.','Quant',3,'2026-09-20');
