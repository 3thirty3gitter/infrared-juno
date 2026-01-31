-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Tubs Table
create table tubs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  location text, -- simple text for now, could be a foreign key later
  color text default '#8a2be2',
  icon text default 'box',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table tubs enable row level security;

create policy "Users can CRUD their own tubs." on tubs
  for all using (auth.uid() = user_id);

-- Items Table
create table items (
  id uuid default uuid_generate_v4() primary key,
  tub_id uuid references tubs on delete cascade not null,
  user_id uuid references auth.users not null, -- denormalized for easier RLS
  name text not null,
  description text,
  image_url text, -- Storage URL
  tags text[],
  expiry_date date, -- For reminders/rotation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table items enable row level security;

create policy "Users can CRUD their own items." on items
  for all using (auth.uid() = user_id);

-- Storage bucket setup (script requires manual creation usually, but we define policy)
-- Bucket name: 'item-images'
-- Policy: "Give users access to their own folder 1uid123/..." etc
