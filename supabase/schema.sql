-- Run this in Supabase: Dashboard -> SQL Editor -> New Query -> paste -> Run

-- Profiles table (extends Supabase's built-in auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Mods table
create table if not exists mods (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles(id) on delete cascade,
  game_name text not null,
  mod_name text not null,
  description text,
  file_url text not null,
  download_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Ratings table (1-5 stars per user per mod)
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  mod_id uuid references mods(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  stars integer check (stars >= 1 and stars <= 5),
  created_at timestamp with time zone default now(),
  unique (mod_id, user_id)
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table mods enable row level security;
alter table ratings enable row level security;

-- Anyone can view mods and profiles; only owners can insert/update their own rows
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

create policy "Mods are viewable by everyone" on mods for select using (true);
create policy "Users can insert their own mods" on mods for insert with check (auth.uid() = creator_id);
create policy "Users can update their own mods" on mods for update using (auth.uid() = creator_id);
create policy "Users can delete their own mods" on mods for delete using (auth.uid() = creator_id);

create policy "Ratings are viewable by everyone" on ratings for select using (true);
create policy "Users can insert their own ratings" on ratings for insert with check (auth.uid() = user_id);
create policy "Users can update their own ratings" on ratings for update using (auth.uid() = user_id);

-- Storage bucket for mod files (run this part, then also create the bucket
-- manually in Dashboard -> Storage -> New Bucket -> name it "mod-files" -> Public)
