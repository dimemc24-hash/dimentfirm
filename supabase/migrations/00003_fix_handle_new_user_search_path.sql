-- Fix: handle_new_user() referenced `profiles`/`streaks` unqualified with no
-- explicit search_path. The auth.users trigger fires under supabase_auth_admin's
-- session search_path (which excludes `public`), so the unqualified inserts
-- failed to resolve — surfacing to GoTrue as a generic
-- "Database error creating new user" on every signup.

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, chapter_path)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'chapter_path', 'ch7')
  );

  insert into public.streaks (user_id, current_streak, longest_streak)
  values (new.id, 0, 0);

  return new;
end;
$$ language plpgsql security definer set search_path = public;
