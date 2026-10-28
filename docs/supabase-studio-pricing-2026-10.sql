-- Studio pricing grid 2026-10-24 -> 2027-04-19 (generated from OrHakerem_Grille_Tarifaire.xlsx, onglet Site).
-- Listing id in Supabase: 'studio'. Penthouse untouched. Prices = net direct (0 commission).
-- Reuses the global period seasons p1..p6 and the New Year override (p7) created by
-- supabase-penthouse-pricing-2026-10.sql (already applied). Dates after 2027-04-19 stay on the 'current' tier.
-- p7 for the studio = P2 prices (assumption, to confirm): 31 Dec / 1 Jan are global p7 override dates.
begin;

delete from public.pricing_tiers where listing_id='studio' and season_type in ('p1','p2','p3','p4','p5','p6','p7');
delete from public.pricing_adjustment_rules where listing_id='studio' and name like 'OH Studio P%';

-- Deactivate (not delete) the old generic studio duration rules (they would compete).
update public.pricing_adjustment_rules set is_active=false
 where listing_id='studio' and rule_type='duration'
   and name in ('Studio weekly discount','Studio monthly discount');

insert into public.pricing_tiers (listing_id, season_type, day_type, min_nights, max_nights, target_price, is_active, priority) values
  ('studio','p1','weekday',1,null,500,true,0),
  ('studio','p1','weekend',1,null,450,true,0),
  ('studio','p2','weekday',1,null,550,true,0),
  ('studio','p2','weekend',1,null,380,true,0),
  ('studio','p3','weekday',1,null,480,true,0),
  ('studio','p3','weekend',1,null,370,true,0),
  ('studio','p4','weekday',1,null,500,true,0),
  ('studio','p4','weekend',1,null,420,true,0),
  ('studio','p5','weekday',1,null,480,true,0),
  ('studio','p5','weekend',1,null,390,true,0),
  ('studio','p6','weekday',1,null,520,true,0),
  ('studio','p6','weekend',1,null,400,true,0),
  ('studio','p7','weekday',1,null,550,true,0),
  ('studio','p7','weekend',1,null,380,true,0);

insert into public.pricing_adjustment_rules (listing_id, name, rule_type, is_active, priority, adjustment_basis_points, starts_on, ends_on, min_nights, max_nights) values
  ('studio','OH Studio P1 duree >= 2 nuits','duration',true,0,-600,'2026-10-24','2026-12-14',2,2),
  ('studio','OH Studio P1 duree >= 3 nuits','duration',true,0,-1000,'2026-10-24','2026-12-14',3,4),
  ('studio','OH Studio P1 duree >= 5 nuits','duration',true,0,-1400,'2026-10-24','2026-12-14',5,6),
  ('studio','OH Studio P1 duree >= 7 nuits','duration',true,0,-2000,'2026-10-24','2026-12-14',7,13),
  ('studio','OH Studio P1 duree >= 14 nuits','duration',true,0,-2600,'2026-10-24','2026-12-14',14,20),
  ('studio','OH Studio P1 duree >= 21 nuits','duration',true,0,-3000,'2026-10-24','2026-12-14',21,27),
  ('studio','OH Studio P1 duree >= 28 nuits','duration',true,0,-3400,'2026-10-24','2026-12-14',28,null),
  ('studio','OH Studio P2 duree >= 2 nuits','duration',true,0,-364,'2026-12-15','2027-01-02',2,2),
  ('studio','OH Studio P2 duree >= 3 nuits','duration',true,0,-909,'2026-12-15','2027-01-02',3,4),
  ('studio','OH Studio P2 duree >= 5 nuits','duration',true,0,-1273,'2026-12-15','2027-01-02',5,6),
  ('studio','OH Studio P2 duree >= 7 nuits','duration',true,0,-1455,'2026-12-15','2027-01-02',7,13),
  ('studio','OH Studio P2 duree >= 14 nuits','duration',true,0,-2000,'2026-12-15','2027-01-02',14,20),
  ('studio','OH Studio P2 duree >= 21 nuits','duration',true,0,-2727,'2026-12-15','2027-01-02',21,27),
  ('studio','OH Studio P2 duree >= 28 nuits','duration',true,0,-3091,'2026-12-15','2027-01-02',28,null),
  ('studio','OH Studio P3 duree >= 2 nuits','duration',true,0,-625,'2027-01-03','2027-02-14',2,2),
  ('studio','OH Studio P3 duree >= 3 nuits','duration',true,0,-1250,'2027-01-03','2027-02-14',3,4),
  ('studio','OH Studio P3 duree >= 5 nuits','duration',true,0,-1667,'2027-01-03','2027-02-14',5,6),
  ('studio','OH Studio P3 duree >= 7 nuits','duration',true,0,-2292,'2027-01-03','2027-02-14',7,13),
  ('studio','OH Studio P3 duree >= 14 nuits','duration',true,0,-2708,'2027-01-03','2027-02-14',14,20),
  ('studio','OH Studio P3 duree >= 21 nuits','duration',true,0,-3125,'2027-01-03','2027-02-14',21,27),
  ('studio','OH Studio P3 duree >= 28 nuits','duration',true,0,-3333,'2027-01-03','2027-02-14',28,null),
  ('studio','OH Studio P4 duree >= 2 nuits','duration',true,0,-600,'2027-02-15','2027-02-21',2,2),
  ('studio','OH Studio P4 duree >= 3 nuits','duration',true,0,-1000,'2027-02-15','2027-02-21',3,4),
  ('studio','OH Studio P4 duree >= 5 nuits','duration',true,0,-1400,'2027-02-15','2027-02-21',5,6),
  ('studio','OH Studio P4 duree >= 7 nuits','duration',true,0,-2000,'2027-02-15','2027-02-21',7,13),
  ('studio','OH Studio P4 duree >= 14 nuits','duration',true,0,-2600,'2027-02-15','2027-02-21',14,20),
  ('studio','OH Studio P4 duree >= 21 nuits','duration',true,0,-3000,'2027-02-15','2027-02-21',21,27),
  ('studio','OH Studio P4 duree >= 28 nuits','duration',true,0,-3400,'2027-02-15','2027-02-21',28,null),
  ('studio','OH Studio P5 duree >= 2 nuits','duration',true,0,-625,'2027-02-22','2027-03-22',2,2),
  ('studio','OH Studio P5 duree >= 3 nuits','duration',true,0,-1250,'2027-02-22','2027-03-22',3,4),
  ('studio','OH Studio P5 duree >= 5 nuits','duration',true,0,-1667,'2027-02-22','2027-03-22',5,6),
  ('studio','OH Studio P5 duree >= 7 nuits','duration',true,0,-2292,'2027-02-22','2027-03-22',7,13),
  ('studio','OH Studio P5 duree >= 14 nuits','duration',true,0,-2708,'2027-02-22','2027-03-22',14,20),
  ('studio','OH Studio P5 duree >= 21 nuits','duration',true,0,-3125,'2027-02-22','2027-03-22',21,27),
  ('studio','OH Studio P5 duree >= 28 nuits','duration',true,0,-3333,'2027-02-22','2027-03-22',28,null),
  ('studio','OH Studio P6 duree >= 2 nuits','duration',true,0,-577,'2027-03-23','2027-04-19',2,2),
  ('studio','OH Studio P6 duree >= 3 nuits','duration',true,0,-1154,'2027-03-23','2027-04-19',3,4),
  ('studio','OH Studio P6 duree >= 5 nuits','duration',true,0,-1731,'2027-03-23','2027-04-19',5,6),
  ('studio','OH Studio P6 duree >= 7 nuits','duration',true,0,-2308,'2027-03-23','2027-04-19',7,13),
  ('studio','OH Studio P6 duree >= 14 nuits','duration',true,0,-2885,'2027-03-23','2027-04-19',14,20),
  ('studio','OH Studio P6 duree >= 21 nuits','duration',true,0,-3269,'2027-03-23','2027-04-19',21,27),
  ('studio','OH Studio P6 duree >= 28 nuits','duration',true,0,-3654,'2027-03-23','2027-04-19',28,null);

commit;
