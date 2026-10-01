
-- ROLES
create type public.app_role as enum ('admin', 'student');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  avatar_url text,
  target_exam text not null default 'SSC CGL',
  preparation_level text not null default 'beginner',
  daily_goal int not null default 60,
  show_on_leaderboard boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url');
  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- CONTENT
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  description text,
  sort_order int not null default 0
);
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  notes jsonb,
  sort_order int not null default 0
);
create index topics_subject_idx on public.topics(subject_id);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  question text not null,
  option_a text not null, option_b text not null, option_c text not null, option_d text not null,
  correct_answer char(1) not null check (correct_answer in ('A','B','C','D')),
  explanation text not null default '',
  difficulty text not null default 'easy' check (difficulty in ('easy','medium','hard')),
  source text,
  created_at timestamptz not null default now()
);
create index questions_topic_idx on public.questions(topic_id);
create index questions_subject_idx on public.questions(subject_id);

create table public.current_affairs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  ssc_relevance text,
  date date not null default current_date,
  source text,
  created_at timestamptz not null default now()
);
create index ca_date_idx on public.current_affairs(date desc);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  content text not null,
  category text not null default 'Strategy',
  read_minutes int not null default 4,
  published_at date not null default current_date
);

grant select on public.subjects, public.topics, public.current_affairs, public.articles to anon, authenticated;
grant insert, update, delete on public.subjects, public.topics, public.current_affairs, public.articles, public.questions to authenticated;
grant all on public.subjects, public.topics, public.current_affairs, public.articles, public.questions to service_role;
-- correct answers / explanations are hidden from direct reads
grant select (id, subject_id, topic_id, question, option_a, option_b, option_c, option_d, difficulty, source, created_at) on public.questions to authenticated;

alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.current_affairs enable row level security;
alter table public.articles enable row level security;

create policy "public read" on public.subjects for select using (true);
create policy "public read" on public.topics for select using (true);
create policy "public read" on public.current_affairs for select using (true);
create policy "public read" on public.articles for select using (true);
create policy "auth read" on public.questions for select to authenticated using (true);
create policy "admin write" on public.subjects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.topics for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.questions for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.current_affairs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.articles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- TESTS (definitions)
create table public.tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  duration int not null,
  total_questions int not null,
  total_marks int not null
);
grant select on public.tests to authenticated;
grant all on public.tests to service_role;
alter table public.tests enable row level security;
create policy "auth read" on public.tests for select to authenticated using (true);

-- USER ACTIVITY
create table public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer char(1),
  is_correct boolean not null,
  time_taken int not null default 0,
  mode text not null default 'practice',
  attempted_at timestamptz not null default now()
);
create index qa_user_idx on public.question_attempts(user_id, attempted_at desc);
create index qa_question_idx on public.question_attempts(question_id);

create table public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_id uuid references public.tests(id) on delete set null,
  test_type text not null,
  title text not null,
  score numeric not null,
  total_marks int not null,
  total_questions int not null,
  attempted int not null, correct int not null, wrong int not null, skipped int not null,
  accuracy numeric not null,
  time_taken int not null,
  subject_breakdown jsonb not null default '[]',
  topic_breakdown jsonb not null default '[]',
  review jsonb not null default '[]',
  completed_at timestamptz not null default now()
);
create index ta_user_idx on public.test_attempts(user_id, completed_at desc);

create table public.study_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  progress int not null default 0,
  accuracy numeric not null default 0,
  questions_solved int not null default 0,
  attempts int not null default 0,
  last_studied timestamptz not null default now(),
  unique (user_id, topic_id)
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create table public.question_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

grant select on public.question_attempts, public.test_attempts, public.study_progress to authenticated;
grant select, insert, delete on public.bookmarks to authenticated;
grant insert on public.question_reports to authenticated;
grant all on public.question_attempts, public.test_attempts, public.study_progress, public.bookmarks, public.question_reports to service_role;

alter table public.question_attempts enable row level security;
alter table public.test_attempts enable row level security;
alter table public.study_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.question_reports enable row level security;

create policy "own read" on public.question_attempts for select to authenticated using (user_id = auth.uid());
create policy "own read" on public.test_attempts for select to authenticated using (user_id = auth.uid());
create policy "own read" on public.study_progress for select to authenticated using (user_id = auth.uid());
create policy "own read" on public.bookmarks for select to authenticated using (user_id = auth.uid());
create policy "own insert" on public.bookmarks for insert to authenticated with check (user_id = auth.uid());
create policy "own delete" on public.bookmarks for delete to authenticated using (user_id = auth.uid());
create policy "own insert" on public.question_reports for insert to authenticated with check (user_id = auth.uid());
create policy "admin read" on public.question_reports for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- progress maintenance
create or replace function public.update_study_progress()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_topic uuid; v_total int; v_solved int; v_attempts int; v_correct int;
begin
  select topic_id into v_topic from questions where id = new.question_id;
  select count(*) into v_total from questions where topic_id = v_topic;
  select count(distinct qa.question_id), count(*), count(*) filter (where qa.is_correct)
    into v_solved, v_attempts, v_correct
    from question_attempts qa join questions q on q.id = qa.question_id
    where qa.user_id = new.user_id and q.topic_id = v_topic and qa.selected_answer is not null;
  insert into study_progress (user_id, topic_id, progress, accuracy, questions_solved, attempts, last_studied)
  values (new.user_id, v_topic, least(100, (v_solved * 100) / greatest(v_total,1)),
          round(v_correct * 100.0 / greatest(v_attempts,1), 1), v_solved, v_attempts, now())
  on conflict (user_id, topic_id) do update set
    progress = excluded.progress, accuracy = excluded.accuracy,
    questions_solved = excluded.questions_solved, attempts = excluded.attempts, last_studied = now();
  return new;
end; $$;
create trigger qa_progress after insert on public.question_attempts for each row execute function public.update_study_progress();

-- RPC: fetch questions without answers
create or replace function public.get_questions(
  p_topic_id uuid default null, p_subject_id uuid default null, p_limit int default 10,
  p_seed text default null, p_ids uuid[] default null)
returns table (id uuid, subject_id uuid, topic_id uuid, subject_name text, topic_name text, question text,
  option_a text, option_b text, option_c text, option_d text, difficulty text)
language sql volatile security definer set search_path = public as $$
  select q.id, q.subject_id, q.topic_id, s.short_name, t.name, q.question,
         q.option_a, q.option_b, q.option_c, q.option_d, q.difficulty
  from questions q join subjects s on s.id = q.subject_id join topics t on t.id = q.topic_id
  where auth.uid() is not null
    and (p_topic_id is null or q.topic_id = p_topic_id)
    and (p_subject_id is null or q.subject_id = p_subject_id)
    and (p_ids is null or q.id = any(p_ids))
  order by md5(q.id::text || coalesce(p_seed, random()::text))
  limit greatest(1, least(p_limit, 200));
$$;

create or replace function public.get_mock_questions(p_per_subject int default 25)
returns table (id uuid, subject_id uuid, topic_id uuid, subject_name text, topic_name text, question text,
  option_a text, option_b text, option_c text, option_d text, difficulty text)
language sql volatile security definer set search_path = public as $$
  select x.id, x.subject_id, x.topic_id, x.short_name, x.tname, x.question, x.option_a, x.option_b, x.option_c, x.option_d, x.difficulty
  from (
    select q.*, s.short_name, s.sort_order as sso, t.name as tname,
      row_number() over (partition by q.subject_id order by random()) rn
    from questions q join subjects s on s.id = q.subject_id join topics t on t.id = q.topic_id
    where auth.uid() is not null
  ) x where x.rn <= least(p_per_subject, 25)
  order by x.sso, x.rn;
$$;

-- RPC: check one answer
create or replace function public.check_answer(p_question_id uuid, p_selected text, p_time int default 0)
returns json language plpgsql security definer set search_path = public as $$
declare q record; v_ok boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select correct_answer, explanation into q from questions where id = p_question_id;
  if not found then raise exception 'question not found'; end if;
  v_ok := upper(p_selected) = q.correct_answer;
  insert into question_attempts (user_id, question_id, selected_answer, is_correct, time_taken, mode)
  values (auth.uid(), p_question_id, upper(p_selected), v_ok, greatest(0, least(p_time, 3600)), 'practice');
  return json_build_object('is_correct', v_ok, 'correct_answer', q.correct_answer, 'explanation', q.explanation);
end; $$;

-- RPC: submit quiz / mock
create or replace function public.submit_test(p_type text, p_title text, p_answers jsonb, p_time int)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_total int; v_correct int; v_wrong int; v_skipped int; v_subj jsonb; v_topic jsonb; v_review jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_type not in ('mock','daily_quiz','ca_quiz','revision') then raise exception 'bad type'; end if;

  create temp table _ans on commit drop as
  select q.id as question_id, q.subject_id, q.topic_id, s.short_name as subject, t.name as topic, s.sort_order,
         nullif(upper(a->>'selected'),'') as selected, q.correct_answer, q.explanation, q.question,
         q.option_a, q.option_b, q.option_c, q.option_d, ord
  from jsonb_array_elements(p_answers) with ordinality as arr(a, ord)
  join questions q on q.id = (a->>'question_id')::uuid
  join subjects s on s.id = q.subject_id join topics t on t.id = q.topic_id;

  select count(*), count(*) filter (where selected = correct_answer),
         count(*) filter (where selected is not null and selected <> correct_answer),
         count(*) filter (where selected is null)
    into v_total, v_correct, v_wrong, v_skipped from _ans;
  if v_total = 0 then raise exception 'no questions'; end if;

  select coalesce(jsonb_agg(row_to_json(x) order by x.sort_order), '[]') into v_subj from (
    select subject, min(sort_order) sort_order, count(*) total,
      count(*) filter (where selected = correct_answer) correct,
      count(*) filter (where selected is not null and selected <> correct_answer) wrong,
      (count(*) filter (where selected = correct_answer)) * 2 - (count(*) filter (where selected is not null and selected <> correct_answer)) * 0.5 score
    from _ans group by subject) x;

  select coalesce(jsonb_agg(row_to_json(x)), '[]') into v_topic from (
    select topic, subject, count(*) total, count(*) filter (where selected = correct_answer) correct
    from _ans group by topic, subject) x;

  select coalesce(jsonb_agg(json_build_object('question_id', question_id, 'question', question, 'subject', subject, 'topic', topic,
    'options', json_build_array(option_a, option_b, option_c, option_d), 'selected', selected,
    'correct_answer', correct_answer, 'explanation', explanation) order by ord), '[]') into v_review from _ans;

  insert into question_attempts (user_id, question_id, selected_answer, is_correct, time_taken, mode)
  select auth.uid(), question_id, selected, selected = correct_answer, 0, p_type from _ans where selected is not null;

  insert into test_attempts (user_id, test_type, title, score, total_marks, total_questions, attempted, correct, wrong, skipped,
    accuracy, time_taken, subject_breakdown, topic_breakdown, review)
  values (auth.uid(), p_type, left(p_title, 120), v_correct * 2 - v_wrong * 0.5, v_total * 2, v_total, v_correct + v_wrong,
    v_correct, v_wrong, v_skipped, round(v_correct * 100.0 / greatest(v_correct + v_wrong, 1), 1),
    greatest(0, least(p_time, 14400)), v_subj, v_topic, v_review)
  returning id into v_id;
  return v_id;
end; $$;

-- RPC: dashboard stats
create or replace function public.get_my_stats()
returns json language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid(); v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_streak int := 0; d date; r json;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  d := v_today;
  if not exists (select 1 from question_attempts where user_id = uid and (attempted_at at time zone 'Asia/Kolkata')::date = d) then
    d := d - 1;
  end if;
  while exists (select 1 from question_attempts where user_id = uid and (attempted_at at time zone 'Asia/Kolkata')::date = d) loop
    v_streak := v_streak + 1; d := d - 1;
  end loop;

  select json_build_object(
    'total', (select count(*) from question_attempts where user_id = uid),
    'correct', (select count(*) from question_attempts where user_id = uid and is_correct),
    'today', (select count(*) from question_attempts where user_id = uid and (attempted_at at time zone 'Asia/Kolkata')::date = v_today),
    'streak', v_streak,
    'tests', (select count(*) from test_attempts where user_id = uid),
    'best_accuracy', (select coalesce(max(accuracy),0) from test_attempts where user_id = uid and test_type = 'mock'),
    'today_by_subject', (select coalesce(json_object_agg(s.slug, c), '{}') from (
        select q.subject_id, count(*) c from question_attempts qa join questions q on q.id = qa.question_id
        where qa.user_id = uid and (qa.attempted_at at time zone 'Asia/Kolkata')::date = v_today group by q.subject_id) x
        join subjects s on s.id = x.subject_id),
    'weekly', (select json_agg(json_build_object('day', g::date, 'count',
        (select count(*) from question_attempts where user_id = uid and (attempted_at at time zone 'Asia/Kolkata')::date = g::date)) order by g)
        from generate_series(v_today - 6, v_today, interval '1 day') g),
    'last_topic', (select json_build_object('topic_id', t.id, 'topic', t.name, 'subject', s.name, 'subject_slug', s.slug, 'topic_slug', t.slug, 'progress', sp.progress)
        from study_progress sp join topics t on t.id = sp.topic_id join subjects s on s.id = t.subject_id
        where sp.user_id = uid order by sp.last_studied desc limit 1)
  ) into r;
  return r;
end; $$;

revoke execute on function public.get_questions, public.get_mock_questions, public.check_answer, public.submit_test, public.get_my_stats from anon, public;
grant execute on function public.get_questions, public.get_mock_questions, public.check_answer, public.submit_test, public.get_my_stats to authenticated;
