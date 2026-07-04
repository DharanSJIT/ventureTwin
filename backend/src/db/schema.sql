-- Enable pgvector for AI memory
create extension if not exists vector;

-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  career_score integer default 0,
  learning_score integer default 0,
  knowledge_score integer default 0,
  startup_score integer default 0,
  research_score integer default 0,
  investment_score integer default 0,
  productivity_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  status text default 'planned',
  priority text default 'medium',
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ideas Table
create table public.ideas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  problem text,
  solution text,
  innovation_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Knowledge Base / Memory Table
create table public.knowledge_memory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  embedding vector(1536), -- Assuming OpenAI ada-002
  metadata jsonb default '{}'::jsonb,
  type text default 'note', -- note, research, conversation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
