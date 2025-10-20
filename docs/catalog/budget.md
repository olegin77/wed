# Budget and guest presets

`packages/catalog/budget.ts` captures reusable budget tiers and guest-count segments that help planners, vendors, and marketing
tools generate realistic estimates for Uzbek weddings.

## Guest segments

| Slug | Range | RU label | UZ label | Notes |
| --- | --- | --- | --- | --- |
| micro | 0–40 | До 40 гостей | 40 tagacha mehmon | Cameral dinners and microweddings |
| intimate | 41–90 | 41–90 гостей | 41–90 mehmon | Family banquets with close friends |
| standard | 91–180 | 91–180 гостей | 91–180 mehmon | Standard celebrations with a full show |
| grand | 181–300 | 181–300 гостей | 181–300 mehmon | Larger venues with zoning |
| ultra | 301–500 | 301–500 гостей | 301–500 mehmon | Extended guest lists and multi-day events |
| mega | 500+ | 500+ гостей | 500+ mehmon | National-scale weddings |

`resolveGuestSegment(count)` returns the matching segment for a raw guest count.

## Budget tiers

Each tier provides:

- Localised label/description (RU/UZ/EN)
- Recommended baseline range in millions of UZS
- Average per-guest spend assumption for scaling with guest counts

| Slug | Range (UZS) | Per guest (UZS) |
| --- | --- | --- |
| lean | 35–70 млн | 550 000 |
| balanced | 60–120 млн | 750 000 |
| premium | 110–220 млн | 1 050 000 |
| luxury | 200–420 млн | 1 550 000 |

`recommendBudget({ guests, tier, city })` applies a regional multiplier (Tashkent, Samarkand, etc.) and returns a structured
estimate with min/max spend, per-guest cost, and the detected guest segment. This enables UI wizards and analytics tools to
produce quick recommendations without duplicating heuristics.
