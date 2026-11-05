-- Penthouse: grille à plat depuis le 2026-11-06.
-- 1600 ILS/nuit en semaine (Sam-Mer), 2500 ILS/nuit le week-end (Jeu+Ven). Ménage en sus (inchangé).
-- S'applique à toutes les saisons du penthouse sauf p7 (Nouvel An, 2800 conservé).
-- Les remises par durée (pricing_adjustment_rules) ne sont pas touchées.
-- A coller dans Supabase Studio (SQL editor). Re-exécutable.
begin;

update public.pricing_tiers
   set target_price = case day_type when 'weekday' then 1600 when 'weekend' then 2500 end
 where listing_id = 'penthouse'
   and is_active = true
   and season_type <> 'p7'
   and day_type in ('weekday','weekend');

-- Contrôle : toutes les lignes (hors p7) doivent afficher 1600 / 2500.
select season_type, day_type, min_nights, max_nights, target_price
  from public.pricing_tiers
 where listing_id = 'penthouse' and is_active = true
 order by season_type, day_type, min_nights;

commit;
