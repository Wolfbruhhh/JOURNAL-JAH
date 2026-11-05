-- Run once in a new Supabase project using the SQL Editor.
begin;
create table public.journals (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{"accounts":[],"trades":[],"dailyLimit":2,"reflections":{}}'::jsonb,
 revision integer not null default 0 check(revision>=0),
 updated_at timestamptz not null default now(),
 constraint journal_shape check(jsonb_typeof(data)='object' and jsonb_typeof(data->'accounts')='array' and jsonb_typeof(data->'trades')='array' and jsonb_typeof(data->'reflections')='object'),
 constraint journal_size check(octet_length(data::text)<=2000000)
);
alter table public.journals enable row level security;
create policy "Read own journal" on public.journals for select to authenticated using ((select auth.uid())=user_id);
create policy "Create own journal" on public.journals for insert to authenticated with check ((select auth.uid())=user_id and revision=0);
create policy "Update own journal" on public.journals for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
revoke all on public.journals from anon;
grant select,insert,update on public.journals to authenticated;
create function public.bump_journal_revision() returns trigger language plpgsql set search_path='' as $$
begin new.revision:=old.revision+1;new.updated_at:=now();return new;end;$$;
create trigger journal_revision before update on public.journals for each row execute function public.bump_journal_revision();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('journal-charts','journal-charts',false,3145728,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy "Upload own charts" on storage.objects for insert to authenticated with check(bucket_id='journal-charts' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Read own charts" on storage.objects for select to authenticated using(bucket_id='journal-charts' and (storage.foldername(name))[1]=(select auth.uid())::text);
commit;
