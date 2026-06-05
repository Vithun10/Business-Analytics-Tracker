-- 1. Profiles Table (Linked to Supabase Auth Users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  weekly_hours_goal numeric default 10.0,
  weekly_priorities text[] default '{}'::text[],
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile." on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

-- 2. Skills Progress Table
create table if not exists public.skills_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  topic text not null,
  status text default 'Not Started' check (status in ('Not Started', 'In Progress', 'Completed')) not null,
  confidence integer default 1 check (confidence >= 1 and confidence <= 10) not null,
  notes text,
  completed_at timestamptz,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  unique (user_id, category, topic)
);

-- Enable RLS
alter table public.skills_progress enable row level security;

-- Skills Progress Policies
create policy "Users can view their own skills progress." on public.skills_progress
  for select using (auth.uid() = user_id);

create policy "Users can modify their own skills progress." on public.skills_progress
  for all using (auth.uid() = user_id);

-- 3. Study Sessions Table
create table if not exists public.study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date default current_date not null,
  skill text not null,
  topic text not null,
  hours numeric check (hours > 0) not null,
  notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.study_sessions enable row level security;

-- Study Sessions Policies
create policy "Users can view their own study sessions." on public.study_sessions
  for select using (auth.uid() = user_id);

create policy "Users can modify their own study sessions." on public.study_sessions
  for all using (auth.uid() = user_id);

-- 4. Trigger to create Profile on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to fire after user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
