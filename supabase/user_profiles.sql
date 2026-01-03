-- Create user_profiles table
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

create table if not exists user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nationality text,
  language text,
  hobbies text[], -- Array of hobby tags
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table user_profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own profile" on user_profiles;
drop policy if exists "Users can insert their own profile" on user_profiles;
drop policy if exists "Users can update their own profile" on user_profiles;
drop policy if exists "Users can delete their own profile" on user_profiles;

-- Create policy that allows users to see only their own profile
create policy "Users can view their own profile"
  on user_profiles
  for select
  using (auth.uid() = user_id);

-- Create policy that allows users to insert their own profile
create policy "Users can insert their own profile"
  on user_profiles
  for insert
  with check (auth.uid() = user_id);

-- Create policy that allows users to update their own profile
create policy "Users can update their own profile"
  on user_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy that allows users to delete their own profile
create policy "Users can delete their own profile"
  on user_profiles
  for delete
  using (auth.uid() = user_id);

-- Create an index on user_id for faster queries
create index if not exists user_profiles_user_id_idx on user_profiles(user_id);

-- Create a function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create a trigger to automatically update updated_at
drop trigger if exists update_user_profiles_updated_at on user_profiles;
create trigger update_user_profiles_updated_at
  before update on user_profiles
  for each row
  execute function update_updated_at_column();

