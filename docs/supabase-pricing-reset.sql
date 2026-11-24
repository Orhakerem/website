-- Pricing reset for the Penthouse and Studio listings.
-- Run this in the Supabase SQL editor for the Or Hakerem project.
-- Last revised 2026-08-31; reflects the grid currently live in production.
--
-- Pricing model: a flat nightly rate per listing (no weekend or season
-- surcharge), with two duration discount tiers applied on top by
-- src/lib/pricing-adjustments.ts:
--
--   Listing (id)          Nightly    7-27 nights        28 nights and up
--   Luxury Penthouse       2500 ILS   -10% -> 2250 ILS   -18% -> 2050 ILS
--   (penthouse)
--   Spacious & Cosy Apt     500 ILS   -12% ->  440 ILS   -15% ->  425 ILS
--   (studio)
--
-- The upper tier is open-ended: min_nights = 28, max_nights = NULL, so it
-- covers 28 nights and everything above (a 91-night stay prices at 2050/425
-- a night, same as a 28-night one). Do not put a ceiling on it.
--
-- KNOWN AND ACCEPTED: the total is not monotonic at the 27/28 boundary
--
-- Because the lower tier stops at 27 nights, the per-night rate drops sharply
-- at night 28 and the totals cross over:
--
--   Penthouse:  27 nights -> 60750     28 nights -> 57400   (-3350)
--   Studio:     27 nights -> 11880     28 nights -> 11900     (+20)
--
-- So a 28-night penthouse booking is 3350 ILS CHEAPER than a 27-night one,
-- and the studio gains only 20 ILS for a whole extra night. This is a
-- deliberate commercial choice to push stays toward the full month, not a
-- bug — leave it alone unless the owner asks.
--
-- If the boundary ever does need smoothing, the levers are: deepen the lower
-- tier, soften the upper one (the penthouse turns monotonic at about -13%),
-- or drop the lower tier's ceiling so one uncapped rate covers 7+ nights.
-- Note the last option cannot preserve today's 28+ totals: with a single rate
-- you cannot cut long stays without cutting the 7-27 band by as much.
--
-- MUST HOLD: the two duration tiers stay contiguous and never overlap
--
-- selectPricingAdjustmentRules keeps only ONE rule per rule_type per night,
-- and when two duration rules match the same night the tie is broken on a
-- UUID comparison — i.e. arbitrarily. The tiers below are contiguous by
-- construction (7-27, then 28-NULL). If you edit the night ranges, keep the
-- upper tier's min_nights exactly one above the lower tier's max_nights:
-- an overlap prices unpredictably, a gap silently bills full price.
--
-- Requires the src/lib/pricing-engine.ts fix that filters pricing_tiers on
-- is_active = true (merged to main in PR #36). Without that fix, the `delete`
-- below is still correct, but a tier deactivated afterwards (is_active =
-- false) would silently keep charging the old rate.
--
-- The /admin/pricing editor has been removed from the back office: pricing
-- tiers, seasons and adjustment rules are now edited in Supabase only.
--
-- NOTE: "last_minute" / "early_booking" rules are NOT touched by this script.
-- Adjustments of different rule types stack additively (see
-- applyPricingAdjustments in src/lib/pricing-adjustments.ts), so an active
-- last-minute discount would combine with the duration discounts below. There
-- were none on these two listings as of 2026-08-31; the verification query at
-- the end re-checks this.

begin;

-- 1. Flat nightly base price. This column is DISPLAY ONLY: getPricingBreakdown
--    selects just (id, cleaning_fee, currency) from listings, so what guests
--    are actually charged comes from pricing_tiers.target_price in step 2.
--    Changing a rate here alone looks applied and bills the old price —
--    always change both, and keep them equal.
update public.listings set base_price = 2500 where id = 'penthouse';
update public.listings set base_price = 500  where id = 'studio';

-- 2. Replace the pricing tier grid with a single open-ended tier per
--    season/day-type combination, at the flat nightly rate. Deleting (not
--    deactivating) avoids leaving old, more-specific tiers around that
--    would otherwise win over the new one.
delete from public.pricing_tiers where listing_id in ('penthouse', 'studio');

insert into public.pricing_tiers
  (listing_id, season_type, day_type, min_nights, max_nights, target_price, is_active, priority)
values
  ('penthouse', 'current', 'weekday', 1, null, 2500, true, 0),
  ('penthouse', 'current', 'weekend', 1, null, 2500, true, 0),
  ('penthouse', 'low',     'weekday', 1, null, 2500, true, 0),
  ('penthouse', 'low',     'weekend', 1, null, 2500, true, 0),
  ('penthouse', 'high',    'weekday', 1, null, 2500, true, 0),
  ('penthouse', 'high',    'weekend', 1, null, 2500, true, 0),
  ('studio',    'current', 'weekday', 1, null, 500,  true, 0),
  ('studio',    'current', 'weekend', 1, null, 500,  true, 0),
  ('studio',    'low',     'weekday', 1, null, 500,  true, 0),
  ('studio',    'low',     'weekend', 1, null, 500,  true, 0),
  ('studio',    'high',    'weekday', 1, null, 500,  true, 0),
  ('studio',    'high',    'weekend', 1, null, 500,  true, 0);

-- 3. Replace the duration discount rules for these two listings. Every
--    duration rule is removed first, by rule_type rather than by name, so
--    this is safe to re-run over any earlier revision of the grid (including
--    the single-tier "long-stay discount (7+ nights)" shape) without leaving
--    a stale rule behind under a superseded name.
delete from public.pricing_adjustment_rules
where listing_id in ('penthouse', 'studio')
  and rule_type = 'duration';

insert into public.pricing_adjustment_rules
  (listing_id, name, rule_type, is_active, priority, adjustment_basis_points, min_nights, max_nights)
values
  ('penthouse', 'Penthouse weekly discount',  'duration', true, 0, -1000, 7,  27),
  ('penthouse', 'Penthouse monthly discount', 'duration', true, 0, -1800, 28, null),
  ('studio',    'Studio weekly discount',     'duration', true, 0, -1200, 7,  27),
  ('studio',    'Studio monthly discount',    'duration', true, 0, -1500, 28, null);

commit;

-- Verification (run separately, after commit):
--
-- select id, base_price from public.listings where id in ('penthouse', 'studio');
--   -> penthouse 2500, studio 500
--
-- select listing_id, season_type, day_type, min_nights, max_nights, target_price, is_active
-- from public.pricing_tiers
-- where listing_id in ('penthouse', 'studio')
-- order by listing_id, season_type, day_type;
--   -> 12 rows, all is_active = true, min_nights 1, max_nights null
--
-- select listing_id, name, rule_type, is_active, adjustment_basis_points, min_nights, max_nights
-- from public.pricing_adjustment_rules
-- order by listing_id, rule_type, min_nights;
--   -> exactly 4 rows, all rule_type 'duration', two per listing, night ranges
--      7-27 then 28-NULL with no overlap and no gap (see MUST HOLD above).
--      Any extra row with rule_type in ('last_minute', 'early_booking') and
--      is_active = true stacks additively with the duration discount.
--
-- End-to-end check against the public pricing API (no auth required):
--
--   curl -s -X POST https://www.orhakerem.com/api/calculate-price \
--     -H 'Content-Type: application/json' \
--     -d '{"listing_id":"penthouse","check_in":"2026-10-05","check_out":"2026-11-04"}'
--
-- Expected night_total (excludes the cleaning fee):
--
--   penthouse   2 nights ->  5000     studio   2 nights ->  1000
--   penthouse   7 nights -> 15750     studio   7 nights ->  3080
--   penthouse  27 nights -> 60750     studio  27 nights -> 11880
--   penthouse  28 nights -> 57400     studio  28 nights -> 11900
--   penthouse  30 nights -> 61500     studio  30 nights -> 12750
--
-- The 28-night figures being below (penthouse) or barely above (studio) the
-- 27-night ones is the accepted boundary behaviour documented at the top.
