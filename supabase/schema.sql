-- Create visited_countries table
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

create table if not exists visited_countries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  country_name text not null,
  country_code text,
  visited_at timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table visited_countries enable row level security;

-- Drop existing policy if it exists
drop policy if exists "Allow all operations for visited_countries" on visited_countries;

-- Create policy that allows users to see only their own countries
create policy "Users can view their own countries"
  on visited_countries
  for select
  using (auth.uid() = user_id);

-- Create policy that allows users to insert their own countries
create policy "Users can insert their own countries"
  on visited_countries
  for insert
  with check (auth.uid() = user_id);

-- Create policy that allows users to update their own countries
create policy "Users can update their own countries"
  on visited_countries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy that allows users to delete their own countries
create policy "Users can delete their own countries"
  on visited_countries
  for delete
  using (auth.uid() = user_id);

-- Create an index on user_id for faster queries
create index if not exists visited_countries_user_id_idx on visited_countries(user_id);

-- Create an index on country_name for faster searches
create index if not exists visited_countries_country_name_idx on visited_countries(country_name);

-- Create an index on created_at for sorting
create index if not exists visited_countries_created_at_idx on visited_countries(created_at desc);

