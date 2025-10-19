import type { BundlePresetDefinition } from "./types";

const locale = (ru: string, uz: string, en: string) => ({ ru, uz, en });

/**
 * Curated presets that combine hall, decor and music vendors into ready-to-pitch bundles.
 */
export const bundlePresets: BundlePresetDefinition[] = [
  {
    slug: "classic-evening",
    label: locale("Классический банкет", "Klassik ziyofat", "Classic banquet"),
    description: locale(
      "Уютный зал с элегантным декором и дуэтом ведущий+DJ.",
      "Yorug' zal, nafis dekor va boshlovchi hamda DJ dueti.",
      "Warm banquet hall with tasteful decor and host plus DJ duo."
    ),
    recommendedTier: "balanced",
    targetSegment: "standard",
    inclusions: [
      locale("Меню на 3 блюда", "3 ta taomli menyu", "Three-course menu"),
      locale("Базовая подсветка и фотозона", "Asosiy yorug'lik va fotoszona", "Ambient lighting and photo corner"),
      locale("6 часов музыкального сопровождения", "6 soatlik musiqa xizmati", "Six-hour music programme"),
    ],
    components: [
      {
        slug: "banquet-hall",
        kind: "venue",
        label: locale("Банкетный зал", "Banket zali", "Banquet hall"),
        description: locale(
          "Зал до 200 гостей, парковка и отдельная гримерка.",
          "200 tagacha mehmon, avtoturargoh va alohida tayyorgarlik xonasi.",
          "Hall for up to 200 guests with parking and dressing room."
        ),
        categories: ["venues:banquet_hall", "venues:restaurant"],
        share: { min: 0.55, max: 0.62 },
        floor: 55_000_000,
        deliverables: [
          locale("Аренда зала на 8 часов", "Zalni 8 soat ijaraga olish", "Eight-hour hall rental"),
          locale("Меню с сервировкой", "Servis bilan menyu", "Menu with full service"),
        ],
      },
      {
        slug: "decor-classic",
        kind: "decor",
        label: locale("Классический декор", "Klassik dekor", "Classic decor"),
        description: locale(
          "Центральная композиция, оформление стола пары и фотозона.",
          "Asosiy kompozitsiya, juftlik stoli va fotoszona bezagi.",
          "Centerpieces, sweetheart table styling and photo zone."
        ),
        categories: ["decor:floral", "decor:light"],
        share: { min: 0.2, max: 0.26 },
        floor: 18_000_000,
        deliverables: [
          locale("Флористика и аренда декора", "Gullash va dekor ijarasi", "Florals and decor rental"),
          locale("Световой дизайн", "Yorug'lik dizayni", "Lighting design"),
        ],
      },
      {
        slug: "music-duo",
        kind: "music",
        label: locale("Ведущий + DJ", "Boshlovchi va DJ", "Host & DJ"),
        description: locale(
          "Динамичный ведущий и DJ с подборкой по жанрам гостей.",
          "Faol boshlovchi va mehmonlar janrlariga mos DJ.",
          "Energetic host with DJ tailoring genres to guests."
        ),
        categories: ["music:dj", "music:host"],
        share: { min: 0.14, max: 0.19 },
        floor: 12_000_000,
        deliverables: [
          locale("Ведение программы", "Dastur boshqaruvi", "Programme hosting"),
          locale("Подборка треков и плейлисты", "Treklar va pleylistlar tanlovi", "Curated playlists"),
        ],
      },
    ],
    note: locale(
      "Лучше всего для пар со средней вместимостью и классическим сценарием.",
      "O'rtacha mehmonlar va klassik ssenariyli juftliklar uchun mos.",
      "Best suited for medium guest counts and traditional flow."
    ),
  },
  {
    slug: "garden-soiree",
    label: locale("Садовая вечеринка", "Bog'dagi ziyofat", "Garden soiree"),
    description: locale(
      "Открытая веранда, природный декор и живая музыка трио.",
      "Ochiq veranda, tabiatdan ilhomlangan dekor va jonli trio musiqasi.",
      "Open-air veranda with nature-inspired decor and live trio."
    ),
    recommendedTier: "premium",
    targetSegment: "intimate",
    inclusions: [
      locale("Альтернативное меню фуршета", "Furshet menyusi", "Cocktail-style menu"),
      locale("Гармоничный свет и свечи", "Muvozanatli yorug'lik va shamlar", "Soft lighting and candles"),
      locale("Живой сет на welcome и банкет", "Welcome va banket uchun jonli set", "Live sets for welcome and dinner"),
    ],
    components: [
      {
        slug: "garden-venue",
        kind: "venue",
        label: locale("Загородная усадьба", "Shahar tashqarisidagi hovli", "Country estate"),
        description: locale(
          "Открытая площадка с зонированием и шатрами.",
          "Zona bo'lingan ochiq maydon va chodirlar.",
          "Outdoor grounds with zoning and marquees."
        ),
        categories: ["venues:garden", "venues:terrace"],
        share: { min: 0.5, max: 0.58 },
        floor: 68_000_000,
        deliverables: [
          locale("Аренда террасы и шатров", "Teras va chodir ijarasi", "Terrace and marquee rental"),
          locale("Трансфер для пары", "Juftlik uchun transfer", "Couple transfer"),
        ],
      },
      {
        slug: "decor-botanical",
        kind: "decor",
        label: locale("Ботанический декор", "Botanik dekor", "Botanical decor"),
        description: locale(
          "Живые композиции, подвесные инсталляции и свечи.",
          "Jonli kompozitsiyalar, osma installyatsiyalar va shamlar.",
          "Lush florals, hanging installations and candles."
        ),
        categories: ["decor:floral", "decor:lighting", "decor:rental"],
        share: { min: 0.24, max: 0.3 },
        floor: 28_000_000,
        deliverables: [
          locale("Цветочные композиции", "Gul kompozitsiyalari", "Floral compositions"),
          locale("Текстиль и аренда мебели", "To'qimachilik va mebel ijarasi", "Textiles and rental furniture"),
        ],
      },
      {
        slug: "music-trio",
        kind: "music",
        label: locale("Акустическое трио", "Akustik trio", "Acoustic trio"),
        description: locale(
          "Скрипка, кахон и вокал для welcome+банкет.",
          "Skripka, kaxon va vokal welcome hamda banket uchun.",
          "Violin, cajon and vocal set for welcome and dinner."
        ),
        categories: ["music:band", "music:live"],
        share: { min: 0.16, max: 0.22 },
        floor: 20_000_000,
        deliverables: [
          locale("2 сета по 45 минут", "Har biri 45 daqiqalik 2 ta set", "Two 45-minute live sets"),
          locale("Фоновый плейлист", "Fon pleylist", "Background playlist"),
        ],
      },
    ],
    note: locale(
      "Идеально для камерных свадеб на свежем воздухе летом.",
      "Yozgi ochiq havodagi kamtarona to'ylar uchun ideal.",
      "Ideal for small outdoor summer celebrations."
    ),
  },
  {
    slug: "grand-signature",
    label: locale("Подписной гала-вечер", "Imzoli gala kecha", "Signature gala"),
    description: locale(
      "Флагманский зал, инсталляции-декорации и шоу-бэнд.",
      "Flagman zal, installyatsion dekor va shou guruhi.",
      "Flagship hall, immersive decor and show band."
    ),
    recommendedTier: "luxury",
    targetSegment: "grand",
    inclusions: [
      locale("Премиальное меню + live cooking", "Premium menyu va live cooking", "Premium menu with live cooking"),
      locale("Пиротехника и сценический свет", "Pirotexnika va sahna yoritish", "Pyro and stage lighting"),
      locale("Afterparty с DJ и перкуссией", "DJ va perkussiya bilan afterparty", "Afterparty with DJ & percussion"),
    ],
    components: [
      {
        slug: "palace-venue",
        kind: "venue",
        label: locale("Торжественный зал", "Hashamatli zal", "Grand ballroom"),
        description: locale(
          "Пространство на 350+ гостей, сцена и LED-экраны.",
          "350+ mehmon, sahna va LED ekranlari bilan maydon.",
          "Space for 350+ guests with stage and LED walls."
        ),
        categories: ["venues:palace", "venues:ballroom"],
        share: { min: 0.58, max: 0.66 },
        floor: 140_000_000,
        deliverables: [
          locale("Аренда с монтажом/демонтажем", "Montaj/demontaj bilan ijara", "Rental with setup/teardown"),
          locale("Технический продакшн", "Texnik prodakshn", "Technical production crew"),
        ],
      },
      {
        slug: "decor-immersive",
        kind: "decor",
        label: locale("Иммерсивный декор", "Immersiv dekor", "Immersive decor"),
        description: locale(
          "Сценография, потолочные инсталляции и бренд-зоны.",
          "Sahna grafikalari, shift installyatsiyalari va brend zonalar.",
          "Scenography, ceiling installations and branded zones."
        ),
        categories: ["decor:production", "decor:light", "decor:floral"],
        share: { min: 0.22, max: 0.28 },
        floor: 60_000_000,
        deliverables: [
          locale("Проект и 3D-визуализация", "Loyiha va 3D vizualizatsiya", "Project and 3D render"),
          locale("Монтаж подрядчиков", "Pudratchilar montaji", "Contractor coordination"),
        ],
      },
      {
        slug: "music-showband",
        kind: "music",
        label: locale("Шоу-бэнд", "Shou guruh", "Show band"),
        description: locale(
          "7-ми музыкантов, фронт-вокал и light-show.",
          "7 nafar musiqachi, bosh vokal va yorug'lik shousi.",
          "Seven-piece band with lead vocal and light show."
        ),
        categories: ["music:band", "music:show"],
        share: { min: 0.14, max: 0.2 },
        floor: 45_000_000,
        deliverables: [
          locale("Live-сеты и выходы артистов", "Jonli setlar va artistlar chiqishlari", "Live sets and artist acts"),
          locale("Звукорежиссёр и backline", "Tovush rejissyori va backline", "Sound engineer and backline"),
        ],
      },
    ],
    note: locale(
      "Подходит для масштабных свадеб с акцентом на шоу.",
      "Shouga urg'u berilgan katta to'ylar uchun mos.",
      "Designed for large weddings focused on show experience."
    ),
  },
];
