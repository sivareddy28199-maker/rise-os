-- ===== Profiles: extra fields =====
alter table public.profiles
  add column if not exists email text,
  add column if not exists study_goal text,
  add column if not exists target_year integer not null default 2027,
  add column if not exists local_data_migrated boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists profiles_updated on public.profiles;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
 returns trigger language plpgsql security definer set search_path to 'public' as $function$
begin
  insert into public.profiles (id, name, avatar_url, email)
  values (new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url', new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end; $function$;

-- ===== Tasks =====
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null check (length(btrim(title)) between 1 and 200),
  description text,
  category text not null default 'study' check (category in ('study','personal','other')),
  status text not null default 'pending' check (status in ('pending','completed','cancelled')),
  scheduled_date date default ((now() at time zone 'Asia/Kolkata')::date),
  start_time time,
  end_time time,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  source text not null default 'manual' check (source in ('manual','ai','system')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.tasks to authenticated;
grant all on public.tasks to service_role;
alter table public.tasks enable row level security;
create policy "own tasks select" on public.tasks for select to authenticated using (user_id = auth.uid());
create policy "own tasks insert" on public.tasks for insert to authenticated with check (user_id = auth.uid());
create policy "own tasks update" on public.tasks for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own tasks delete" on public.tasks for delete to authenticated using (user_id = auth.uid());
create index tasks_user_date on public.tasks (user_id, scheduled_date);

create or replace function public.tasks_before_write() returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  if new.status = 'completed' and (tg_op = 'INSERT' or old.status <> 'completed') then new.completed_at = now();
  elsif new.status <> 'completed' then new.completed_at = null; end if;
  return new;
end $$;
create trigger tasks_bw before insert or update on public.tasks for each row execute function public.tasks_before_write();

-- ===== Habits =====
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null check (length(btrim(name)) between 1 and 120),
  description text,
  frequency text not null default 'daily' check (frequency in ('daily','weekly')),
  target_count integer not null default 1 check (target_count > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.habits to authenticated;
grant all on public.habits to service_role;
alter table public.habits enable row level security;
create policy "own habits select" on public.habits for select to authenticated using (user_id = auth.uid());
create policy "own habits insert" on public.habits for insert to authenticated with check (user_id = auth.uid());
create policy "own habits update" on public.habits for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own habits delete" on public.habits for delete to authenticated using (user_id = auth.uid());
create index habits_user on public.habits (user_id);
create trigger habits_updated before update on public.habits for each row execute function public.set_updated_at();

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  log_date date not null default ((now() at time zone 'Asia/Kolkata')::date),
  completed boolean not null default true,
  completed_at timestamptz default now(),
  unique (habit_id, log_date)
);
grant select, insert, update, delete on public.habit_logs to authenticated;
grant all on public.habit_logs to service_role;
alter table public.habit_logs enable row level security;
create policy "own logs select" on public.habit_logs for select to authenticated using (user_id = auth.uid());
create policy "own logs insert" on public.habit_logs for insert to authenticated with check (
  user_id = auth.uid() and exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid()));
create policy "own logs update" on public.habit_logs for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own logs delete" on public.habit_logs for delete to authenticated using (user_id = auth.uid());
create index habit_logs_user_date on public.habit_logs (user_id, log_date);

-- ===== Goals =====
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null check (length(btrim(title)) between 1 and 200),
  description text,
  target_value numeric not null default 100 check (target_value > 0),
  current_value numeric not null default 0 check (current_value >= 0),
  unit text,
  deadline date,
  status text not null default 'active' check (status in ('active','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.goals to authenticated;
grant all on public.goals to service_role;
alter table public.goals enable row level security;
create policy "own goals select" on public.goals for select to authenticated using (user_id = auth.uid());
create policy "own goals insert" on public.goals for insert to authenticated with check (user_id = auth.uid());
create policy "own goals update" on public.goals for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own goals delete" on public.goals for delete to authenticated using (user_id = auth.uid());
create index goals_user on public.goals (user_id);
create trigger goals_updated before update on public.goals for each row execute function public.set_updated_at();

-- ===== Study sessions =====
create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  subject_id uuid references public.subjects(id),
  topic_id uuid references public.topics(id),
  task_id uuid references public.tasks(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  session_type text not null default 'study' check (session_type in ('study','practice','quiz','mock_test','revision')),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.study_sessions to authenticated;
grant all on public.study_sessions to service_role;
alter table public.study_sessions enable row level security;
create policy "own sessions select" on public.study_sessions for select to authenticated using (user_id = auth.uid());
create policy "own sessions insert" on public.study_sessions for insert to authenticated with check (user_id = auth.uid());
create policy "own sessions update" on public.study_sessions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own sessions delete" on public.study_sessions for delete to authenticated using (user_id = auth.uid());
create index study_sessions_user_started on public.study_sessions (user_id, started_at);

-- Duration is always computed by the database, never trusted from the client.
create or replace function public.study_sessions_before_write() returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then new.started_at = least(coalesce(new.started_at, now()), now()); end if;
  if tg_op = 'UPDATE' then new.started_at = old.started_at; end if;
  if new.ended_at is not null then
    new.ended_at = least(new.ended_at, now());
    new.duration_seconds = greatest(0, least(43200, extract(epoch from (new.ended_at - new.started_at))::int));
  else
    new.duration_seconds = 0;
  end if;
  return new;
end $$;
create trigger study_sessions_bw before insert or update on public.study_sessions for each row execute function public.study_sessions_before_write();

-- ===== Notes =====
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  subject_id uuid references public.subjects(id),
  topic_id uuid references public.topics(id),
  title text not null check (length(btrim(title)) between 1 and 200),
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.notes to authenticated;
grant all on public.notes to service_role;
alter table public.notes enable row level security;
create policy "own notes select" on public.notes for select to authenticated using (user_id = auth.uid());
create policy "own notes insert" on public.notes for insert to authenticated with check (user_id = auth.uid());
create policy "own notes update" on public.notes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own notes delete" on public.notes for delete to authenticated using (user_id = auth.uid());
create index notes_user on public.notes (user_id, updated_at desc);
create trigger notes_updated before update on public.notes for each row execute function public.set_updated_at();

-- ===== Test configuration (configurable blueprints) =====
create table public.test_configs (
  test_type text primary key,
  title text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  marks_per_question numeric not null default 2,
  negative_marks numeric not null default 0.5
);
grant select on public.test_configs to authenticated;
grant all on public.test_configs to service_role;
alter table public.test_configs enable row level security;
create policy "configs read" on public.test_configs for select to authenticated using (true);
create policy "configs admin" on public.test_configs for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.test_blueprints (
  id uuid primary key default gen_random_uuid(),
  test_type text not null references public.test_configs(test_type) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  question_count integer not null check (question_count >= 0),
  unique (test_type, subject_id)
);
grant select on public.test_blueprints to authenticated;
grant all on public.test_blueprints to service_role;
alter table public.test_blueprints enable row level security;
create policy "blueprints read" on public.test_blueprints for select to authenticated using (true);
create policy "blueprints admin" on public.test_blueprints for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.test_configs (test_type, title, duration_minutes) values ('daily_quiz', 'Daily Quiz', 10), ('mock', 'Full Mock Test', 60);
insert into public.test_blueprints (test_type, subject_id, question_count)
  select 'daily_quiz', id, 3 from public.subjects union all select 'mock', id, 25 from public.subjects;

-- ===== Quiz sessions (server-held question list + timer) =====
create table public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  test_type text not null check (test_type in ('daily_quiz','mock','practice')),
  title text not null,
  question_ids uuid[] not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  attempt_id uuid references public.test_attempts(id),
  status text not null default 'in_progress' check (status in ('in_progress','submitted','expired'))
);
grant select on public.quiz_sessions to authenticated;
grant all on public.quiz_sessions to service_role;
alter table public.quiz_sessions enable row level security;
create policy "own quiz sessions read" on public.quiz_sessions for select to authenticated using (user_id = auth.uid());
create index quiz_sessions_user on public.quiz_sessions (user_id, started_at desc);

-- ===== Other indexes =====
create index if not exists test_attempts_user_completed on public.test_attempts (user_id, completed_at desc);
create index if not exists questions_subject_topic on public.questions (subject_id, topic_id);
create index if not exists topics_subject on public.topics (subject_id);
create index if not exists question_attempts_user_time on public.question_attempts (user_id, attempted_at);

-- ===== Hide correct answers from the browser =====
revoke select on public.questions from authenticated, anon;
grant select (id, subject_id, topic_id, question, option_a, option_b, option_c, option_d, difficulty, source, created_at) on public.questions to authenticated;

-- ===== Quiz engine =====
create or replace function public.quiz_payload(p_id uuid) returns json language sql stable security definer set search_path = public as $$
  select json_build_object('session_id', s.id, 'test_type', s.test_type, 'title', s.title, 'started_at', s.started_at,
    'expires_at', s.expires_at, 'server_now', now(),
    'questions', (select json_agg(json_build_object('id', q.id, 'subject', sb.name, 'topic', t.name, 'question', q.question,
        'options', json_build_array(q.option_a, q.option_b, q.option_c, q.option_d), 'difficulty', q.difficulty) order by u.ord)
      from unnest(s.question_ids) with ordinality u(qid, ord)
      join questions q on q.id = u.qid join subjects sb on sb.id = q.subject_id join topics t on t.id = q.topic_id))
  from quiz_sessions s where s.id = p_id and s.user_id = auth.uid();
$$;

create or replace function public.start_quiz(p_type text, p_subject uuid default null, p_topic uuid default null, p_difficulty text default null, p_count integer default 10)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); v_cfg record; v_ids uuid[]; v_sess quiz_sessions; v_title text; v_secs int;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if p_type not in ('daily_quiz','mock','practice') then raise exception 'bad type'; end if;
  update quiz_sessions set status = 'expired' where user_id = uid and status = 'in_progress' and expires_at < now() - interval '30 seconds';

  if p_type in ('daily_quiz','mock') then
    select * into v_sess from quiz_sessions where user_id = uid and test_type = p_type and status = 'in_progress' order by started_at desc limit 1;
    if found then return quiz_payload(v_sess.id); end if;
    select * into v_cfg from test_configs where test_type = p_type;
    if not found then raise exception 'test not configured'; end if;
    v_title := v_cfg.title; v_secs := v_cfg.duration_minutes * 60;
    with weak as (
      select q.topic_id, avg(case when qa.is_correct then 100 else 0 end) acc
      from question_attempts qa join questions q on q.id = qa.question_id where qa.user_id = uid group by q.topic_id),
    recent as (select distinct question_id from question_attempts where user_id = uid and attempted_at > now() - interval '7 days'),
    ranked as (
      select q.id, q.subject_id, row_number() over (partition by q.subject_id
        order by coalesce(w.acc, 60) + case when r.question_id is not null then 40 else 0 end + random() * 30) rn
      from questions q left join weak w on w.topic_id = q.topic_id left join recent r on r.question_id = q.id)
    select array_agg(rk.id order by s.sort_order, rk.rn) into v_ids
    from ranked rk join test_blueprints b on b.subject_id = rk.subject_id and b.test_type = p_type
    join subjects s on s.id = rk.subject_id where rk.rn <= b.question_count;
  else
    p_count := greatest(1, least(coalesce(p_count, 10), 50));
    if p_difficulty is not null and p_difficulty not in ('easy','medium','hard') then raise exception 'bad difficulty'; end if;
    with weak as (
      select q.topic_id, avg(case when qa.is_correct then 100 else 0 end) acc
      from question_attempts qa join questions q on q.id = qa.question_id where qa.user_id = uid group by q.topic_id),
    ranked as (
      select q.id from questions q left join weak w on w.topic_id = q.topic_id
      where (p_subject is null or q.subject_id = p_subject) and (p_topic is null or q.topic_id = p_topic)
        and (p_difficulty is null or q.difficulty = p_difficulty)
      order by coalesce(w.acc, 60) + random() * 40 limit p_count)
    select array_agg(id) into v_ids from ranked;
    v_title := coalesce('Practice: ' || (select name from topics where id = p_topic), 'Practice: ' || (select name from subjects where id = p_subject), 'Practice');
    v_secs := cardinality(coalesce(v_ids, '{}')) * 90;
  end if;

  if v_ids is null or cardinality(v_ids) = 0 then raise exception 'no questions available'; end if;
  insert into quiz_sessions (user_id, test_type, title, question_ids, expires_at)
  values (uid, p_type, v_title, v_ids, now() + make_interval(secs => v_secs)) returning * into v_sess;
  return quiz_payload(v_sess.id);
end $$;

create or replace function public.submit_quiz(p_session uuid, p_answers jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare s quiz_sessions; v_ans jsonb; v_id uuid; v_type text; v_elapsed int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into s from quiz_sessions where id = p_session and user_id = auth.uid() for update;
  if not found then raise exception 'session not found'; end if;
  if s.status = 'submitted' then return json_build_object('attempt_id', s.attempt_id, 'already', true); end if;
  if s.status = 'expired' or now() > s.expires_at + interval '30 seconds' then
    update quiz_sessions set status = 'expired' where id = s.id;
    return json_build_object('error', 'expired');
  end if;

  select jsonb_agg(jsonb_build_object('question_id', u.qid, 'selected',
      (select upper(a->>'selected') from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) a
        where a->>'question_id' = u.qid::text and upper(a->>'selected') in ('A','B','C','D') limit 1)) order by u.ord)
    into v_ans from unnest(s.question_ids) with ordinality u(qid, ord);

  v_type := case s.test_type when 'mock' then 'mock' when 'daily_quiz' then 'daily_quiz' else 'revision' end;
  v_elapsed := greatest(0, extract(epoch from (least(now(), s.expires_at) - s.started_at))::int);
  v_id := submit_test(v_type, s.title, v_ans, v_elapsed);
  update quiz_sessions set status = 'submitted', submitted_at = now(), attempt_id = v_id where id = s.id;
  insert into study_sessions (user_id, started_at, ended_at, session_type)
    values (auth.uid(), s.started_at, least(now(), s.expires_at),
      case s.test_type when 'mock' then 'mock_test' when 'daily_quiz' then 'quiz' else 'practice' end);
  return json_build_object('attempt_id', v_id);
end $$;

-- Scoring is only reachable through submit_quiz (validated session + timer).
revoke execute on function public.submit_test(text, text, jsonb, integer) from public, anon, authenticated;

-- ===== Habit streak =====
create or replace function public.habit_streak(p_habit uuid) returns integer language plpgsql stable security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Kolkata')::date; n int := 0;
begin
  if not exists (select 1 from habits where id = p_habit and user_id = auth.uid()) then return 0; end if;
  if not exists (select 1 from habit_logs where habit_id = p_habit and log_date = d and completed) then d := d - 1; end if;
  while exists (select 1 from habit_logs where habit_id = p_habit and log_date = d and completed) loop n := n + 1; d := d - 1; end loop;
  return n;
end $$;

-- ===== Dashboard (one consolidated read) =====
create or replace function public.get_dashboard() returns json language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_ws date; v_days date[]; v_streak int := 0; v_long int := 0; v_run int := 0; v_prev date; d date;
  v_weak json; v_rec json; v_w record; r json;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  v_ws := v_today - (extract(isodow from v_today)::int - 1);

  select array_agg(x order by x) into v_days from (
    select (completed_at at time zone 'Asia/Kolkata')::date x from tasks where user_id = uid and status = 'completed' and completed_at is not null
    union select log_date from habit_logs where user_id = uid and completed
    union select (started_at at time zone 'Asia/Kolkata')::date from study_sessions where user_id = uid and duration_seconds >= 60
    union select (attempted_at at time zone 'Asia/Kolkata')::date from question_attempts where user_id = uid) s;
  v_days := coalesce(v_days, '{}');
  d := v_today;
  if not (d = any(v_days)) then d := d - 1; end if;
  while d = any(v_days) loop v_streak := v_streak + 1; d := d - 1; end loop;
  foreach d in array v_days loop
    if v_prev is not null and d = v_prev + 1 then v_run := v_run + 1; else v_run := 1; end if;
    v_long := greatest(v_long, v_run); v_prev := d;
  end loop;

  select coalesce(json_agg(w), '[]') into v_weak from (
    select t.id topic_id, t.name topic, s.name subject, s.slug subject_slug, count(*) attempts,
      round(100.0 * count(*) filter (where qa.is_correct) / count(*)) accuracy
    from question_attempts qa join questions q on q.id = qa.question_id join topics t on t.id = q.topic_id join subjects s on s.id = t.subject_id
    where qa.user_id = uid group by t.id, t.name, s.name, s.slug having count(*) >= 3
    order by accuracy asc, attempts desc limit 5) w;

  select * into v_w from json_to_recordset(v_weak) as x(topic_id uuid, topic text, subject text, accuracy numeric, attempts int) limit 1;
  if v_w.topic is not null then
    v_rec := json_build_object('topic_id', v_w.topic_id, 'topic', v_w.topic, 'subject', v_w.subject, 'accuracy', v_w.accuracy,
      'reason', format('Your accuracy in %s is %s%% across %s questions, your weakest topic.', v_w.topic, v_w.accuracy, v_w.attempts),
      'action', format('Practice %s questions on %s today.', case when v_w.accuracy < 50 then 20 else 15 end, v_w.topic),
      'minutes', case when v_w.accuracy < 50 then 45 else 30 end);
  else
    v_rec := json_build_object('topic_id', null, 'topic', null, 'subject', null, 'accuracy', null,
      'reason', 'Not enough practice yet to find your weak topics.',
      'action', 'Take today''s Daily Quiz so Rise OS can find your weak topics.', 'minutes', 15);
  end if;

  select json_build_object(
    'today', v_today,
    'profile', (select json_build_object('name', p.name, 'email', p.email, 'avatar_url', p.avatar_url, 'target_exam', p.target_exam,
        'target_year', p.target_year, 'study_goal', p.study_goal, 'local_data_migrated', p.local_data_migrated) from profiles p where p.id = uid),
    'tasks_today', coalesce((select json_agg(row_to_json(t) order by t.start_time nulls last, t.created_at) from (
        select id, title, description, category, status, scheduled_date, start_time, end_time, priority, source, completed_at, created_at
        from tasks where user_id = uid and scheduled_date = v_today and status <> 'cancelled') t), '[]'),
    'tasks_upcoming', coalesce((select json_agg(row_to_json(t) order by t.scheduled_date, t.start_time nulls last) from (
        select id, title, description, category, status, scheduled_date, start_time, end_time, priority, source, completed_at, created_at
        from tasks where user_id = uid and scheduled_date > v_today and status = 'pending' order by scheduled_date, start_time limit 10) t), '[]'),
    'tasks_overdue', coalesce((select json_agg(row_to_json(t) order by t.scheduled_date) from (
        select id, title, description, category, status, scheduled_date, start_time, end_time, priority, source, completed_at, created_at
        from tasks where user_id = uid and scheduled_date < v_today and status = 'pending' order by scheduled_date limit 10) t), '[]'),
    'habits', coalesce((select json_agg(json_build_object('id', h.id, 'name', h.name, 'description', h.description,
        'done_today', exists (select 1 from habit_logs l where l.habit_id = h.id and l.log_date = v_today and l.completed),
        'streak', habit_streak(h.id)) order by h.created_at) from habits h where h.user_id = uid and h.active), '[]'),
    'goals', coalesce((select json_agg(row_to_json(g) order by g.status, g.deadline nulls last) from (
        select id, title, description, target_value, current_value, unit, deadline, status from goals where user_id = uid and status <> 'archived') g), '[]'),
    'active_session', (select json_build_object('id', id, 'started_at', started_at, 'task_id', task_id) from study_sessions
        where user_id = uid and ended_at is null order by started_at desc limit 1),
    'study_today_seconds', coalesce((select sum(duration_seconds) from study_sessions where user_id = uid and (started_at at time zone 'Asia/Kolkata')::date = v_today), 0),
    'study_week_seconds', coalesce((select sum(duration_seconds) from study_sessions where user_id = uid and (started_at at time zone 'Asia/Kolkata')::date >= v_ws), 0),
    'weekly', (select json_agg(json_build_object('day', g::date, 'seconds', coalesce((select sum(duration_seconds) from study_sessions
        where user_id = uid and (started_at at time zone 'Asia/Kolkata')::date = g::date), 0)) order by g)
        from generate_series(v_ws::timestamp, (v_ws + 6)::timestamp, interval '1 day') g),
    'streak', v_streak, 'longest_streak', v_long,
    'tasks_week', (select json_build_object('done', count(*) filter (where status = 'completed'), 'total', count(*)) from tasks
        where user_id = uid and status <> 'cancelled' and scheduled_date between v_ws and v_ws + 6),
    'habits_week', json_build_object(
        'done', (select count(*) from habit_logs l join habits h on h.id = l.habit_id where l.user_id = uid and h.active and l.completed and l.log_date between v_ws and v_today),
        'expected', (select count(*) from habits where user_id = uid and active) * (v_today - v_ws + 1)),
    'goals_summary', (select json_build_object('done', count(*) filter (where status = 'completed' or current_value >= target_value), 'total', count(*),
        'pct', coalesce(round(avg(least(current_value / nullif(target_value, 0), 1)) * 100), 0)) from goals where user_id = uid and status <> 'archived'),
    'practice', (select json_build_object('attempted', count(*), 'correct', count(*) filter (where is_correct),
        'week_attempted', count(*) filter (where attempted_at >= now() - interval '7 days'),
        'week_correct', count(*) filter (where is_correct and attempted_at >= now() - interval '7 days'),
        'prev_attempted', count(*) filter (where attempted_at < now() - interval '7 days' and attempted_at >= now() - interval '14 days'),
        'prev_correct', count(*) filter (where is_correct and attempted_at < now() - interval '7 days' and attempted_at >= now() - interval '14 days'))
        from question_attempts where user_id = uid),
    'weak_topics', v_weak,
    'recommendation', v_rec,
    'recent_tests', coalesce((select json_agg(row_to_json(t)) from (select id, title, test_type, score, total_marks, accuracy, correct, wrong, skipped, completed_at
        from test_attempts where user_id = uid order by completed_at desc limit 5) t), '[]')
  ) into r;
  return r;
end $$;

-- ===== Realtime for cross-device sync =====
alter publication supabase_realtime add table public.tasks, public.habits, public.habit_logs, public.goals;