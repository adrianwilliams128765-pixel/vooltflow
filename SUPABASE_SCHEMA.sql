-- ─────────────────────────────────────────────────────────────────────────
-- VooltFlow — Supabase Database Schema
-- Run this in your Supabase project: SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Profiles
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users manage own profile"
  on public.profiles for all using (auth.uid() = id);

-- 2. Stores (WooCommerce credentials)
create table if not exists public.stores (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid unique not null references auth.users(id) on delete cascade,
  store_url        text not null,
  consumer_key     text not null,
  consumer_secret  text not null,
  is_verified      boolean default false,
  created_at       timestamptz default now()
);

alter table public.stores enable row level security;
create policy "Users manage own store"
  on public.stores for all using (auth.uid() = user_id);

-- 3. Products (discovered by The Affiliate workflow)
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  platform       text not null,               -- Amazon | Jumia | Konga
  product_name   text not null,
  price          text not null,
  product_link   text,                         -- raw Google Shopping link
  affiliate_link text,                         -- built by Affiliate Generator node
  image_url      text,
  rating         text,
  reviews        text,
  youtube_link   text,                         -- from YouTube Search node
  video_title    text,                         -- from Parse YouTube Data node
  video_context  text,                         -- snippet / description
  published      boolean default false,
  published_at   timestamptz,
  created_at     timestamptz default now()
);

alter table public.products enable row level security;
create policy "Users manage own products"
  on public.products for all using (auth.uid() = user_id);

-- Useful index for loading recent products
create index if not exists idx_products_user_created
  on public.products (user_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- Auto-create profile on signup
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
