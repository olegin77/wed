# Uzbekistan regions and cities

`packages/geo/uz.ts` now exposes structured data for Uzbekistan's regions and key cities, complete with locale-specific titles,
ISO codes, geo-coordinates, and helper utilities for search, filtering, and analytics.

## What is included

- **Regions (viloyatlar + Karakalpakstan + Tashkent city)** – area, population, ISO codes, phone prefixes, and map coordinates.
- **Cities/districts** – regional centres and major municipalities with population estimates and aliases for search.
- **Helpers** – `getRegion`, `getCity`, `citiesByRegion`, `searchRegions`, `searchCities`, and `listRegionalCenters` to power
  onboarding flows, catalogue filters, and analytics dashboards.

## Example usage

```ts
import { regions, searchCities, citiesByRegion } from "@wt/geo/uz";

const tashkent = searchCities("toshkent");
const samarkandCities = citiesByRegion("samarkand");
```

The exported data is intentionally lightweight so it can be consumed in both Node.js services and browser bundles without pulling
in additional dependencies.
