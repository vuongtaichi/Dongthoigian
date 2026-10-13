-- Run once in Supabase → SQL Editor.
-- Adds the reader's country (2-letter code, e.g. 'VN', 'AU') to profiles.
-- It is written by the reader's own browser after sign-in (existing
-- "update own profile" policy) and shown as a flag on the admin pages.
alter table public.profiles
  add column if not exists country text
  check (country is null or country ~ '^[A-Z]{2}$');
