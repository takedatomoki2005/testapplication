-- Migration script to add user_id to existing visited_countries table
-- Run this SQL in your Supabase SQL Editor if you already have the table created
-- WARNING: This will delete all existing data in visited_countries table!

-- Step 1: Drop the existing table (this deletes all data!)
drop table if exists visited_countries;

-- Step 2: Recreate the table with user_id column
create table visited_countries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  country_name text not null,
  country_code text,
  visited_at timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- Step 3: Enable Row Level Security (RLS)
alter table visited_countries enable row level security;

-- Step 4: Drop existing policies if they exist
drop policy if exists "Allow all operations for visited_countries" on visited_countries;
drop policy if exists "Users can view their own countries" on visited_countries;
drop policy if exists "Users can insert their own countries" on visited_countries;
drop policy if exists "Users can update their own countries" on visited_countries;
drop policy if exists "Users can delete their own countries" on visited_countries;

-- Step 5: Create user-specific RLS policies
create policy "Users can view their own countries"
  on visited_countries
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own countries"
  on visited_countries
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own countries"
  on visited_countries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own countries"
  on visited_countries
  for delete
  using (auth.uid() = user_id);

-- Step 6: Create indexes
create index if not exists visited_countries_user_id_idx on visited_countries(user_id);
create index if not exists visited_countries_country_name_idx on visited_countries(country_name);
create index if not exists visited_countries_created_at_idx on visited_countries(created_at desc);

