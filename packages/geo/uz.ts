export type LocaleName = {
  ru: string;
  uz: string;
  en: string;
};

export type Region = {
  slug: string;
  isoCode: string;
  type: "region" | "city" | "republic";
  name: LocaleName;
  center: string;
  population: number;
  areaKm2: number;
  lat: number;
  lon: number;
  phoneCode: string;
  timeZone: "Asia/Tashkent";
};

export type City = {
  slug: string;
  regionSlug: string;
  type: "city" | "district" | "town";
  name: LocaleName;
  population?: number;
  lat?: number;
  lon?: number;
  postalCode?: string;
  aliases?: string[];
};

const REGIONS: Region[] = [
  {
    slug: "tashkent-city",
    isoCode: "UZ-TK",
    type: "city",
    name: { ru: "Ташкент", uz: "Toshkent shahri", en: "Tashkent City" },
    center: "Tashkent",
    population: 2_694_000,
    areaKm2: 334,
    lat: 41.3111,
    lon: 69.2797,
    phoneCode: "+998 71",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "tashkent-region",
    isoCode: "UZ-TO",
    type: "region",
    name: { ru: "Ташкентская область", uz: "Toshkent viloyati", en: "Tashkent Region" },
    center: "Nurafshon",
    population: 2_970_000,
    areaKm2: 15_300,
    lat: 41.0,
    lon: 69.0,
    phoneCode: "+998 70",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "samarkand",
    isoCode: "UZ-SA",
    type: "region",
    name: { ru: "Самаркандская область", uz: "Samarqand viloyati", en: "Samarkand Region" },
    center: "Samarkand",
    population: 3_900_000,
    areaKm2: 16_800,
    lat: 39.6542,
    lon: 66.9597,
    phoneCode: "+998 66",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "bukhara",
    isoCode: "UZ-BU",
    type: "region",
    name: { ru: "Бухарская область", uz: "Buxoro viloyati", en: "Bukhara Region" },
    center: "Bukhara",
    population: 1_990_000,
    areaKm2: 39_400,
    lat: 39.7680,
    lon: 64.4550,
    phoneCode: "+998 65",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "khorezm",
    isoCode: "UZ-XO",
    type: "region",
    name: { ru: "Хорезмская область", uz: "Xorazm viloyati", en: "Khorezm Region" },
    center: "Urgench",
    population: 1_900_000,
    areaKm2: 6_100,
    lat: 41.55,
    lon: 60.63,
    phoneCode: "+998 62",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "andijan",
    isoCode: "UZ-AN",
    type: "region",
    name: { ru: "Андижанская область", uz: "Andijon viloyati", en: "Andijan Region" },
    center: "Andijan",
    population: 3_100_000,
    areaKm2: 4_300,
    lat: 40.7821,
    lon: 72.3442,
    phoneCode: "+998 74",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "namangan",
    isoCode: "UZ-NG",
    type: "region",
    name: { ru: "Наманганская область", uz: "Namangan viloyati", en: "Namangan Region" },
    center: "Namangan",
    population: 2_900_000,
    areaKm2: 7_440,
    lat: 41.0,
    lon: 71.67,
    phoneCode: "+998 69",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "fergana",
    isoCode: "UZ-FA",
    type: "region",
    name: { ru: "Ферганская область", uz: "Fargʻona viloyati", en: "Fergana Region" },
    center: "Fergana",
    population: 3_760_000,
    areaKm2: 6_800,
    lat: 40.39,
    lon: 71.78,
    phoneCode: "+998 73",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "jizzakh",
    isoCode: "UZ-JI",
    type: "region",
    name: { ru: "Джизакская область", uz: "Jizzax viloyati", en: "Jizzakh Region" },
    center: "Jizzakh",
    population: 1_420_000,
    areaKm2: 21_200,
    lat: 40.1150,
    lon: 67.8422,
    phoneCode: "+998 72",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "sirdarya",
    isoCode: "UZ-SI",
    type: "region",
    name: { ru: "Сырдарьинская область", uz: "Sirdaryo viloyati", en: "Sirdarya Region" },
    center: "Gulistan",
    population: 900_000,
    areaKm2: 5_100,
    lat: 40.4920,
    lon: 68.7891,
    phoneCode: "+998 67",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "kashkadarya",
    isoCode: "UZ-QA",
    type: "region",
    name: { ru: "Кашкадарьинская область", uz: "Qashqadaryo viloyati", en: "Kashkadarya Region" },
    center: "Karshi",
    population: 3_400_000,
    areaKm2: 28_600,
    lat: 38.8606,
    lon: 65.7891,
    phoneCode: "+998 75",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "surkhandarya",
    isoCode: "UZ-SU",
    type: "region",
    name: { ru: "Сурхандарьинская область", uz: "Surxondaryo viloyati", en: "Surkhandarya Region" },
    center: "Termez",
    population: 2_750_000,
    areaKm2: 20_100,
    lat: 37.2242,
    lon: 67.2783,
    phoneCode: "+998 76",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "navoiy",
    isoCode: "UZ-NW",
    type: "region",
    name: { ru: "Навоийская область", uz: "Navoiy viloyati", en: "Navoiy Region" },
    center: "Navoiy",
    population: 1_000_000,
    areaKm2: 111_000,
    lat: 40.0844,
    lon: 65.3792,
    phoneCode: "+998 79",
    timeZone: "Asia/Tashkent",
  },
  {
    slug: "karakalpakstan",
    isoCode: "UZ-QR",
    type: "republic",
    name: { ru: "Республика Каракалпакстан", uz: "Qoraqalpogʻiston Respublikasi", en: "Republic of Karakalpakstan" },
    center: "Nukus",
    population: 1_950_000,
    areaKm2: 166_600,
    lat: 42.4600,
    lon: 59.6100,
    phoneCode: "+998 61",
    timeZone: "Asia/Tashkent",
  },
];

const CITIES: City[] = [
  {
    slug: "tashkent",
    regionSlug: "tashkent-city",
    type: "city",
    name: { ru: "Ташкент", uz: "Toshkent", en: "Tashkent" },
    population: 2_694_000,
    lat: 41.3111,
    lon: 69.2797,
    aliases: ["Toshkent", "Тошкент"],
  },
  {
    slug: "chirchiq",
    regionSlug: "tashkent-region",
    type: "city",
    name: { ru: "Чирчик", uz: "Chirchiq", en: "Chirchiq" },
    population: 168_000,
    lat: 41.4689,
    lon: 69.5822,
    aliases: ["Chirchiq", "Чирчик"],
  },
  {
    slug: "angren",
    regionSlug: "tashkent-region",
    type: "city",
    name: { ru: "Ангрен", uz: "Angren", en: "Angren" },
    population: 188_000,
    lat: 41.0167,
    lon: 70.1431,
  },
  {
    slug: "nurafshon",
    regionSlug: "tashkent-region",
    type: "city",
    name: { ru: "Нурафшан", uz: "Nurafshon", en: "Nurafshon" },
    population: 65_000,
    lat: 41.0005,
    lon: 69.2200,
  },
  {
    slug: "samarkand",
    regionSlug: "samarkand",
    type: "city",
    name: { ru: "Самарканд", uz: "Samarqand", en: "Samarkand" },
    population: 573_000,
    lat: 39.6542,
    lon: 66.9597,
    aliases: ["Samarqand", "Самарқанд"],
  },
  {
    slug: "urgut",
    regionSlug: "samarkand",
    type: "district",
    name: { ru: "Ургут", uz: "Urgut", en: "Urgut" },
    population: 220_000,
    lat: 39.4000,
    lon: 67.2500,
  },
  {
    slug: "kattakurgan",
    regionSlug: "samarkand",
    type: "city",
    name: { ru: "Каттакурган", uz: "Kattaqoʻrgʻon", en: "Kattakurgan" },
    population: 92_000,
    lat: 39.9000,
    lon: 66.2667,
  },
  {
    slug: "bukhara",
    regionSlug: "bukhara",
    type: "city",
    name: { ru: "Бухара", uz: "Buxoro", en: "Bukhara" },
    population: 280_000,
    lat: 39.7680,
    lon: 64.4550,
  },
  {
    slug: "gijduvan",
    regionSlug: "bukhara",
    type: "district",
    name: { ru: "Гиждуван", uz: "Gʻijduvon", en: "Gijduvan" },
    population: 240_000,
    lat: 40.1000,
    lon: 64.6833,
  },
  {
    slug: "karakul",
    regionSlug: "bukhara",
    type: "district",
    name: { ru: "Каракуль", uz: "Qorakoʻl", en: "Karakul" },
    population: 120_000,
  },
  {
    slug: "urgench",
    regionSlug: "khorezm",
    type: "city",
    name: { ru: "Ургенч", uz: "Urganch", en: "Urgench" },
    population: 187_000,
    lat: 41.5500,
    lon: 60.6333,
  },
  {
    slug: "khiva",
    regionSlug: "khorezm",
    type: "city",
    name: { ru: "Хива", uz: "Xiva", en: "Khiva" },
    population: 93_000,
    lat: 41.3890,
    lon: 60.3550,
  },
  {
    slug: "andijan",
    regionSlug: "andijan",
    type: "city",
    name: { ru: "Андижан", uz: "Andijon", en: "Andijan" },
    population: 425_000,
    lat: 40.7821,
    lon: 72.3442,
  },
  {
    slug: "asaka",
    regionSlug: "andijan",
    type: "city",
    name: { ru: "Асака", uz: "Asaka", en: "Asaka" },
    population: 150_000,
  },
  {
    slug: "namangan",
    regionSlug: "namangan",
    type: "city",
    name: { ru: "Наманган", uz: "Namangan", en: "Namangan" },
    population: 640_000,
    lat: 41.0,
    lon: 71.67,
  },
  {
    slug: "chartak",
    regionSlug: "namangan",
    type: "district",
    name: { ru: "Чартак", uz: "Chortoq", en: "Chartak" },
  },
  {
    slug: "fergana",
    regionSlug: "fergana",
    type: "city",
    name: { ru: "Фергана", uz: "Fargʻona", en: "Fergana" },
    population: 286_000,
    lat: 40.3890,
    lon: 71.7843,
  },
  {
    slug: "kokand",
    regionSlug: "fergana",
    type: "city",
    name: { ru: "Коканд", uz: "Qoʻqon", en: "Kokand" },
    population: 230_000,
  },
  {
    slug: "margilan",
    regionSlug: "fergana",
    type: "city",
    name: { ru: "Маргилан", uz: "Margʻilon", en: "Margilan" },
    population: 220_000,
  },
  {
    slug: "jizzakh",
    regionSlug: "jizzakh",
    type: "city",
    name: { ru: "Джизак", uz: "Jizzax", en: "Jizzakh" },
    population: 179_000,
  },
  {
    slug: "zarafshan",
    regionSlug: "navoiy",
    type: "city",
    name: { ru: "Зарафшан", uz: "Zarafshon", en: "Zarafshan" },
    population: 68_000,
  },
  {
    slug: "navoiy",
    regionSlug: "navoiy",
    type: "city",
    name: { ru: "Навои", uz: "Navoiy", en: "Navoiy" },
    population: 165_000,
  },
  {
    slug: "gulistan",
    regionSlug: "sirdarya",
    type: "city",
    name: { ru: "Гулистан", uz: "Guliston", en: "Gulistan" },
    population: 90_000,
  },
  {
    slug: "yangiyer",
    regionSlug: "sirdarya",
    type: "city",
    name: { ru: "Янгиер", uz: "Yangiyer", en: "Yangiyer" },
  },
  {
    slug: "karshi",
    regionSlug: "kashkadarya",
    type: "city",
    name: { ru: "Карши", uz: "Qarshi", en: "Karshi" },
    population: 275_000,
  },
  {
    slug: "shahrisabz",
    regionSlug: "kashkadarya",
    type: "city",
    name: { ru: "Шахрисабз", uz: "Shahrisabz", en: "Shahrisabz" },
    population: 140_000,
  },
  {
    slug: "termez",
    regionSlug: "surkhandarya",
    type: "city",
    name: { ru: "Термез", uz: "Termiz", en: "Termez" },
    population: 180_000,
    lat: 37.2242,
    lon: 67.2783,
  },
  {
    slug: "denov",
    regionSlug: "surkhandarya",
    type: "city",
    name: { ru: "Денау", uz: "Denov", en: "Denov" },
  },
  {
    slug: "nukus",
    regionSlug: "karakalpakstan",
    type: "city",
    name: { ru: "Нукус", uz: "Nukus", en: "Nukus" },
    population: 330_000,
    lat: 42.4600,
    lon: 59.6100,
  },
  {
    slug: "moynak",
    regionSlug: "karakalpakstan",
    type: "town",
    name: { ru: "Муйнак", uz: "Moʻynoq", en: "Muynak" },
  },
];

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

const cityIndex = new Map<string, City>(CITIES.map((city) => [city.slug, city]));
const regionIndex = new Map<string, Region>(REGIONS.map((region) => [region.slug, region]));

export const regions = REGIONS;
export const cities = CITIES;

export function getRegion(slug: string): Region | undefined {
  return regionIndex.get(slug);
}

export function getCity(slug: string): City | undefined {
  return cityIndex.get(slug);
}

export function citiesByRegion(regionSlug: string): City[] {
  return CITIES.filter((city) => city.regionSlug === regionSlug);
}

export function searchCities(query: string): City[] {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) {
    return [];
  }
  return CITIES.filter((city) => {
    const candidates = [
      city.name.ru,
      city.name.uz,
      city.name.en,
      ...(city.aliases ?? []),
    ]
      .filter(Boolean)
      .map((value) => normalize(value));
    return candidates.some((candidate) => candidate.includes(normalizedQuery));
  });
}

export function searchRegions(query: string): Region[] {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) {
    return [];
  }
  return REGIONS.filter((region) => {
    const candidates = [region.name.ru, region.name.uz, region.name.en, region.center];
    return candidates.map(normalize).some((candidate) => candidate.includes(normalizedQuery));
  });
}

export function listRegionalCenters(): City[] {
  return CITIES.filter((city) => {
    const region = regionIndex.get(city.regionSlug);
    return region?.center === city.name.en || region?.center === city.name.ru || region?.center === city.name.uz;
  });
}
