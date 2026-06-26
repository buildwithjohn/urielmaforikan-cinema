-- ─────────────────────────────────────────────────────────────
-- Row Level Security. Default: deny. The service-role key (server
-- actions / webhooks) bypasses RLS entirely; these policies govern
-- the browser anon/auth clients.
-- ─────────────────────────────────────────────────────────────
alter table films            enable row level security;
alter table credits          enable row level security;
alter table viewers          enable row level security;
alter table premieres        enable row level security;
alter table premiere_rsvps   enable row level security;
alter table responses        enable row level security;
alter table gifts            enable row level security;
alter table admin_emails     enable row level security;

-- Films & credits: world-readable (the catalog is public);
-- gated playback is enforced at the token-minting layer, not the row.
create policy "films are public" on films
  for select using (true);
create policy "admins manage films" on films
  for all using (is_admin()) with check (is_admin());

create policy "credits are public" on credits
  for select using (true);
create policy "admins manage credits" on credits
  for all using (is_admin()) with check (is_admin());

-- Premieres: list publicly; admins manage.
create policy "premieres are public" on premieres
  for select using (true);
create policy "admins manage premieres" on premieres
  for all using (is_admin()) with check (is_admin());

-- Viewers: a person sees and edits only their own row.
create policy "viewer reads self" on viewers
  for select using (auth_user_id = auth.uid() or is_admin());
create policy "viewer updates self" on viewers
  for update using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
-- Inserts happen server-side (service role) on first sign-in.

-- RSVPs: a viewer manages their own; admins read all.
create policy "viewer reads own rsvps" on premiere_rsvps
  for select using (
    is_admin() or viewer_id in (
      select id from viewers where auth_user_id = auth.uid()
    )
  );
create policy "viewer creates own rsvp" on premiere_rsvps
  for insert with check (
    viewer_id in (select id from viewers where auth_user_id = auth.uid())
  );
create policy "viewer deletes own rsvp" on premiere_rsvps
  for delete using (
    viewer_id in (select id from viewers where auth_user_id = auth.uid())
  );

-- Responses: anyone may submit (anonymous responses allowed);
-- only admins (and the author) may read. Writes go through the server,
-- but allow authenticated inserts as a fallback.
create policy "anyone may respond" on responses
  for insert with check (true);
create policy "admins or author read responses" on responses
  for select using (
    is_admin() or viewer_id in (
      select id from viewers where auth_user_id = auth.uid()
    )
  );
create policy "admins manage responses" on responses
  for update using (is_admin()) with check (is_admin());

-- Gifts: created server-side; only admins / the donor read.
create policy "admins or donor read gifts" on gifts
  for select using (
    is_admin() or viewer_id in (
      select id from viewers where auth_user_id = auth.uid()
    )
  );

-- admin_emails: only admins may read; managed via SQL / dashboard.
create policy "admins read admin_emails" on admin_emails
  for select using (is_admin());
