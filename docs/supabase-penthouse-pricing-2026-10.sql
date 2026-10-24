-- Penthouse pricing grid 2026-10-24 -> 2027-04-19 (generated from OrHakerem_Grille_Tarifaire.xlsx, onglet Site).
-- Listing id in Supabase: 'penthouse'. Studio untouched. Prices = net direct (0 commission).
-- Model: 6 new season types p1..p6 -> pricing_tiers (weekday/weekend base price)
--        + pricing_adjustment_rules type 'duration' (per period, per night range, negative basis points).
-- Needs the code change allowing season types p1..p6 (SeasonType union + SEASON_TYPES sets) BEFORE going live.
-- Dates after 2027-04-19 fall back to the existing 'current' tier (2500) as today.
-- STEP 0 (read-only, run first, optional): check how season_type is constrained. The DO block below assumes
-- CHECK constraints; if "data_type" below is USER-DEFINED (an enum), adapt step 1 before running.
--   select table_name, data_type, udt_name from information_schema.columns
--    where table_schema='public' and column_name='season_type';
--   select conrelid::regclass, conname, pg_get_constraintdef(oid) from pg_constraint
--    where contype='c' and pg_get_constraintdef(oid) ilike '%season_type%';
-- Deploy order: merge the p1..p6 code to production BEFORE running this script.
begin;

-- 1. Allow p1..p6 as season_type (replaces any check on season_type for these 3 tables).
do $$
declare r record; t text;
begin
  foreach t in array array['pricing_tiers','season_periods','season_date_overrides'] loop
    for r in select c.conname from pg_constraint c
             where c.conrelid = ('public.'||t)::regclass and c.contype='c'
               and pg_get_constraintdef(c.oid) ilike '%season_type%' loop
      execute format('alter table public.%I drop constraint %I', t, r.conname);
    end loop;
    execute format('alter table public.%I add constraint %I check (season_type in (''current'',''low'',''high'',''p1'',''p2'',''p3'',''p4'',''p5'',''p6''))', t, t||'_season_type_check');
  end loop;
end $$;

-- 2. Re-runnable: remove only what this script creates.
delete from public.season_periods where season_type in ('p1','p2','p3','p4','p5','p6');
delete from public.pricing_tiers where listing_id='penthouse' and season_type in ('p1','p2','p3','p4','p5','p6');
delete from public.pricing_adjustment_rules where listing_id='penthouse' and name like 'OH Penthouse P%';

-- 3. Deactivate (not delete) the old generic penthouse duration rules (they would compete).
update public.pricing_adjustment_rules set is_active=false
 where listing_id='penthouse' and rule_type='duration'
   and name in ('Penthouse weekly discount','Penthouse monthly discount');

-- 4. Periods (end date inclusive; P1 starts today).
insert into public.season_periods (name, season_type, start_date, end_date, is_active) values
  ('OH P1','p1','2026-10-24','2026-12-14',true),
  ('OH P2','p2','2026-12-15','2027-01-02',true),
  ('OH P3','p3','2027-01-03','2027-02-14',true),
  ('OH P4','p4','2027-02-15','2027-02-21',true),
  ('OH P5','p5','2027-02-22','2027-03-22',true),
  ('OH P6','p6','2027-03-23','2027-04-19',true);

-- 5. Base nightly price per period and day type (Thu+Fri = weekend).
insert into public.pricing_tiers (listing_id, season_type, day_type, min_nights, max_nights, target_price, is_active, priority) values
  ('penthouse','p1','weekday',1,null,1950,true,0),
  ('penthouse','p1','weekend',1,null,2300,true,0),
  ('penthouse','p2','weekday',1,null,2300,true,0),
  ('penthouse','p2','weekend',1,null,2500,true,0),
  ('penthouse','p3','weekday',1,null,1900,true,0),
  ('penthouse','p3','weekend',1,null,2300,true,0),
  ('penthouse','p4','weekday',1,null,2000,true,0),
  ('penthouse','p4','weekend',1,null,2500,true,0),
  ('penthouse','p5','weekday',1,null,1900,true,0),
  ('penthouse','p5','weekend',1,null,2500,true,0),
  ('penthouse','p6','weekday',1,null,2200,true,0),
  ('penthouse','p6','weekend',1,null,2300,true,0);

-- 6. Duration discounts (basis points, applied to every night by total stay length).
insert into public.pricing_adjustment_rules (listing_id, name, rule_type, is_active, priority, adjustment_basis_points, starts_on, ends_on, min_nights, max_nights) values
  ('penthouse','OH Penthouse P1 duree >= 2 nuits','duration',true,0,-513,'2026-10-24','2026-12-14',2,2),
  ('penthouse','OH Penthouse P1 duree >= 3 nuits','duration',true,0,-1026,'2026-10-24','2026-12-14',3,4),
  ('penthouse','OH Penthouse P1 duree >= 5 nuits','duration',true,0,-1538,'2026-10-24','2026-12-14',5,6),
  ('penthouse','OH Penthouse P1 duree >= 7 nuits','duration',true,0,-1795,'2026-10-24','2026-12-14',7,13),
  ('penthouse','OH Penthouse P1 duree >= 14 nuits','duration',true,0,-2308,'2026-10-24','2026-12-14',14,20),
  ('penthouse','OH Penthouse P1 duree >= 21 nuits','duration',true,0,-2821,'2026-10-24','2026-12-14',21,27),
  ('penthouse','OH Penthouse P1 duree >= 28 nuits','duration',true,0,-3333,'2026-10-24','2026-12-14',28,null),
  ('penthouse','OH Penthouse P2 duree >= 2 nuits','duration',true,0,-870,'2026-12-15','2027-01-02',2,2),
  ('penthouse','OH Penthouse P2 duree >= 3 nuits','duration',true,0,-1304,'2026-12-15','2027-01-02',3,4),
  ('penthouse','OH Penthouse P2 duree >= 5 nuits','duration',true,0,-1739,'2026-12-15','2027-01-02',5,6),
  ('penthouse','OH Penthouse P2 duree >= 7 nuits','duration',true,0,-2174,'2026-12-15','2027-01-02',7,13),
  ('penthouse','OH Penthouse P2 duree >= 14 nuits','duration',true,0,-2609,'2026-12-15','2027-01-02',14,20),
  ('penthouse','OH Penthouse P2 duree >= 21 nuits','duration',true,0,-3043,'2026-12-15','2027-01-02',21,27),
  ('penthouse','OH Penthouse P2 duree >= 28 nuits','duration',true,0,-3478,'2026-12-15','2027-01-02',28,null),
  ('penthouse','OH Penthouse P3 duree >= 2 nuits','duration',true,0,-526,'2027-01-03','2027-02-14',2,2),
  ('penthouse','OH Penthouse P3 duree >= 3 nuits','duration',true,0,-1053,'2027-01-03','2027-02-14',3,4),
  ('penthouse','OH Penthouse P3 duree >= 5 nuits','duration',true,0,-1579,'2027-01-03','2027-02-14',5,6),
  ('penthouse','OH Penthouse P3 duree >= 7 nuits','duration',true,0,-1579,'2027-01-03','2027-02-14',7,13),
  ('penthouse','OH Penthouse P3 duree >= 14 nuits','duration',true,0,-2105,'2027-01-03','2027-02-14',14,20),
  ('penthouse','OH Penthouse P3 duree >= 21 nuits','duration',true,0,-2632,'2027-01-03','2027-02-14',21,27),
  ('penthouse','OH Penthouse P3 duree >= 28 nuits','duration',true,0,-3158,'2027-01-03','2027-02-14',28,null),
  ('penthouse','OH Penthouse P4 duree >= 2 nuits','duration',true,0,-250,'2027-02-15','2027-02-21',2,2),
  ('penthouse','OH Penthouse P4 duree >= 3 nuits','duration',true,0,-500,'2027-02-15','2027-02-21',3,4),
  ('penthouse','OH Penthouse P4 duree >= 5 nuits','duration',true,0,-1000,'2027-02-15','2027-02-21',5,6),
  ('penthouse','OH Penthouse P4 duree >= 7 nuits','duration',true,0,-1500,'2027-02-15','2027-02-21',7,13),
  ('penthouse','OH Penthouse P4 duree >= 14 nuits','duration',true,0,-2000,'2027-02-15','2027-02-21',14,20),
  ('penthouse','OH Penthouse P4 duree >= 21 nuits','duration',true,0,-2500,'2027-02-15','2027-02-21',21,27),
  ('penthouse','OH Penthouse P4 duree >= 28 nuits','duration',true,0,-3000,'2027-02-15','2027-02-21',28,null),
  ('penthouse','OH Penthouse P5 duree >= 2 nuits','duration',true,0,-526,'2027-02-22','2027-03-22',2,2),
  ('penthouse','OH Penthouse P5 duree >= 3 nuits','duration',true,0,-1053,'2027-02-22','2027-03-22',3,4),
  ('penthouse','OH Penthouse P5 duree >= 5 nuits','duration',true,0,-1579,'2027-02-22','2027-03-22',5,6),
  ('penthouse','OH Penthouse P5 duree >= 7 nuits','duration',true,0,-1579,'2027-02-22','2027-03-22',7,13),
  ('penthouse','OH Penthouse P5 duree >= 14 nuits','duration',true,0,-2105,'2027-02-22','2027-03-22',14,20),
  ('penthouse','OH Penthouse P5 duree >= 21 nuits','duration',true,0,-2632,'2027-02-22','2027-03-22',21,27),
  ('penthouse','OH Penthouse P5 duree >= 28 nuits','duration',true,0,-3158,'2027-02-22','2027-03-22',28,null),
  ('penthouse','OH Penthouse P6 duree >= 2 nuits','duration',true,0,-455,'2027-03-23','2027-04-19',2,2),
  ('penthouse','OH Penthouse P6 duree >= 3 nuits','duration',true,0,-909,'2027-03-23','2027-04-19',3,4),
  ('penthouse','OH Penthouse P6 duree >= 5 nuits','duration',true,0,-1364,'2027-03-23','2027-04-19',5,6),
  ('penthouse','OH Penthouse P6 duree >= 7 nuits','duration',true,0,-1818,'2027-03-23','2027-04-19',7,13),
  ('penthouse','OH Penthouse P6 duree >= 14 nuits','duration',true,0,-2273,'2027-03-23','2027-04-19',14,20),
  ('penthouse','OH Penthouse P6 duree >= 21 nuits','duration',true,0,-2727,'2027-03-23','2027-04-19',21,27),
  ('penthouse','OH Penthouse P6 duree >= 28 nuits','duration',true,0,-3182,'2027-03-23','2027-04-19',28,null);

-- 7. Checks (expect 6 / 12 / 42 / 2 inactive).
select count(*) as periods from public.season_periods where season_type like 'p_';
select count(*) as tiers from public.pricing_tiers where listing_id='penthouse' and season_type like 'p_';
select count(*) as rules from public.pricing_adjustment_rules where listing_id='penthouse' and name like 'OH Penthouse P%';
select name, is_active from public.pricing_adjustment_rules where listing_id='penthouse' and name like 'Penthouse %discount';

commit;
