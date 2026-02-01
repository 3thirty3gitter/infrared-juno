-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Tubs Table
create table if not exists tubs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  location text,
  color text default '#8a2be2',
  icon text default 'box',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table tubs enable row level security;

create policy "Users can CRUD their own tubs." on tubs
  for all using (auth.uid() = user_id);

-- Items Table
create table if not exists items (
  id uuid default gen_random_uuid() primary key,
  tub_id uuid references tubs on delete cascade not null,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  image_url text,
  tags text[],
  expiry_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table items enable row level security;

create policy "Users can CRUD their own items." on items
  for all using (auth.uid() = user_id);

-- Trigger to automatically create a profile entry when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    split_part(new.email, '@', 1) -- Default username from email
  );
  return new;
end;
$$;

-- Drop trigger if exists to avoid duplication errors on re-runs
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Bucket Setup (Attempt to create if permissions allow, otherwise must be done in Dashboard)
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Authenticated users can upload item images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'item-images' and auth.uid() = owner );

create policy "Authenticated users can update item images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'item-images' and auth.uid() = owner );

create policy "Anyone can view item images"
  on storage.objects for select
  to public
  using ( bucket_id = 'item-images' );

create policy "Users can delete their own item images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'item-images' and auth.uid() = owner );
