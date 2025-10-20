export type LocaleMap = {
  ru: string;
  uz: string;
  en: string;
};

export type CatalogCategory = {
  slug: string;
  title: LocaleMap;
  description?: LocaleMap;
  group: "venues" | "media" | "style" | "entertainment" | "beauty" | "services";
  parent?: string;
  synonyms?: string[];
  tags?: string[];
};

export type CatalogCategoryNode = CatalogCategory & {
  children?: CatalogCategoryNode[];
};

const TREE: CatalogCategoryNode[] = [
  {
    slug: "venue",
    group: "venues",
    title: {
      ru: "Площадки",
      uz: "To'y joylari",
      en: "Venues",
    },
    description: {
      ru: "Локации для проведения церемонии и банкета.",
      uz: "Nikoh marosimi va bazm uchun joylar.",
      en: "Spaces for ceremonies and receptions.",
    },
    synonyms: ["локации", "зал", "банкетный зал", "тохона", "venue"],
    tags: ["area", "capacity", "indoor", "outdoor"],
    children: [
      {
        slug: "venue:banquet-hall",
        parent: "venue",
        group: "venues",
        title: {
          ru: "Банкетные залы",
          uz: "To'yxonalar",
          en: "Banquet halls",
        },
        description: {
          ru: "Классические площадки с полным банкетным обслуживанием.",
          uz: "To'liq taomxona xizmati bilan klassik joylar.",
          en: "Traditional halls with full catering.",
        },
        synonyms: ["ресторан", "тохона", "зал"],
        tags: ["indoor", "classic", "full-service"],
      },
      {
        slug: "venue:loft",
        parent: "venue",
        group: "venues",
        title: {
          ru: "Лофты",
          uz: "Loft joylari",
          en: "Loft venues",
        },
        description: {
          ru: "Индустриальные пространства с панорамами и современной отделкой.",
          uz: "Zamonaviy dizayndagi panoramali sanoat uslubidagi joylar.",
          en: "Industrial venues with panoramic views and modern finishes.",
        },
        synonyms: ["loft", "индастриал", "панорама"],
        tags: ["industrial", "panoramic", "urban"],
      },
      {
        slug: "venue:garden",
        parent: "venue",
        group: "venues",
        title: {
          ru: "Сады и open-air",
          uz: "Bog' va ochiq maydonlar",
          en: "Garden & open-air",
        },
        description: {
          ru: "Площадки с возможностью выездной церемонии под открытым небом.",
          uz: "Ochiq osmon ostida marosim o'tkazish imkoniyati.",
          en: "Outdoor spaces suitable for open-air ceremonies.",
        },
        synonyms: ["сад", "open air", "терраса"],
        tags: ["outdoor", "ceremony", "green"],
      },
      {
        slug: "venue:hotel",
        parent: "venue",
        group: "venues",
        title: {
          ru: "Отели",
          uz: "Mehmonxonalar",
          en: "Hotels",
        },
        description: {
          ru: "Площадки при отелях с возможностью размещения гостей.",
          uz: "Mehmonlarni joylashtirish imkoniyati bilan otel maydonlari.",
          en: "Hotel venues with guest accommodation on site.",
        },
        synonyms: ["hotel", "отель", "resort"],
        tags: ["rooms", "full-service", "premium"],
      },
    ],
  },
  {
    slug: "media",
    group: "media",
    title: {
      ru: "Фото и видео",
      uz: "Foto va video",
      en: "Photo & video",
    },
    description: {
      ru: "Подрядчики, которые документируют свадьбу.",
      uz: "To'yni hujjatlashtiruvchi mutaxassislar.",
      en: "Vendors capturing the celebration.",
    },
    synonyms: ["фото", "видео", "фотограф", "видеограф"],
    tags: ["content", "memories", "story"],
    children: [
      {
        slug: "media:photographer",
        parent: "media",
        group: "media",
        title: {
          ru: "Фотографы",
          uz: "Fotograflar",
          en: "Photographers",
        },
        description: {
          ru: "Съемка love-story, сборов и торжества.",
          uz: "Love-story, tayyorgarlik va bazmni suratga olish.",
          en: "Coverage of preparations, ceremony and reception.",
        },
        synonyms: ["фото", "photographer"],
        tags: ["photo", "story", "portrait"],
      },
      {
        slug: "media:videographer",
        parent: "media",
        group: "media",
        title: {
          ru: "Видеографы",
          uz: "Videograflar",
          en: "Videographers",
        },
        description: {
          ru: "Постановочная и репортажная видеосъемка.",
          uz: "Videorolik va reportaj tasvirga olish.",
          en: "Documentary and cinematic wedding films.",
        },
        synonyms: ["видео", "videographer"],
        tags: ["video", "film", "cinema"],
      },
      {
        slug: "media:photobooth",
        parent: "media",
        group: "media",
        title: {
          ru: "Фотобудки",
          uz: "Fotobudkalar",
          en: "Photo booths",
        },
        description: {
          ru: "Развлекательные станции для гостей и моментальные фото.",
          uz: "Mehmonlar uchun suratga olish burchaklari.",
          en: "Interactive guest experiences with instant prints.",
        },
        synonyms: ["инстапринт", "фотозона"],
        tags: ["interactive", "guest-experience"],
      },
    ],
  },
  {
    slug: "decor",
    group: "style",
    title: {
      ru: "Декор и флористика",
      uz: "Dekor va floristika",
      en: "Decor & floristry",
    },
    description: {
      ru: "Команды, которые создают оформление церемонии и банкета.",
      uz: "Marosim va bazm bezaklari uchun jamoalar.",
      en: "Vendors designing the look & feel of the event.",
    },
    synonyms: ["оформление", "цветы", "флорист", "декоратор"],
    tags: ["style", "floral", "lighting"],
    children: [
      {
        slug: "decor:florist",
        parent: "decor",
        group: "style",
        title: {
          ru: "Флористы",
          uz: "Florislar",
          en: "Florists",
        },
        description: {
          ru: "Букеты, бутоньерки и оформление арок.",
          uz: "Gullar, buketlar va arco bezagi.",
          en: "Personal florals and ceremony installations.",
        },
        synonyms: ["цветы", "букет"],
        tags: ["floral", "personal"],
      },
      {
        slug: "decor:stylist",
        parent: "decor",
        group: "style",
        title: {
          ru: "Декораторы",
          uz: "Dekoratorlar",
          en: "Decor stylists",
        },
        description: {
          ru: "Концепция, текстиль, мебель и детали.",
          uz: "Kontseptsiya, mato, mebel va detallar.",
          en: "Concept development, textiles, rentals and styling.",
        },
        synonyms: ["оформление", "декоратор"],
        tags: ["style", "rentals", "concept"],
      },
      {
        slug: "decor:lighting",
        parent: "decor",
        group: "style",
        title: {
          ru: "Свет и спецэффекты",
          uz: "Yoritish va effektlar",
          en: "Lighting & FX",
        },
        description: {
          ru: "Профессиональный свет, инсталляции и спецэффекты.",
          uz: "Professional yoritish va maxsus effektlar.",
          en: "Lighting rigs, projections and atmosphere effects.",
        },
        synonyms: ["свет", "освещение", "fx"],
        tags: ["lighting", "effects", "technical"],
      },
    ],
  },
  {
    slug: "entertainment",
    group: "entertainment",
    title: {
      ru: "Развлечения",
      uz: "Ko'ngilochar xizmatlar",
      en: "Entertainment",
    },
    description: {
      ru: "Музыка, ведущие и интерактив для гостей.",
      uz: "Musiqa, olib boruvchilar va mehmonlar uchun interaktiv dasturlar.",
      en: "Hosts, music and guest interaction.",
    },
    synonyms: ["ведущий", "музыка", "шоу", "анимация"],
    tags: ["music", "mc", "show"],
    children: [
      {
        slug: "entertainment:host",
        parent: "entertainment",
        group: "entertainment",
        title: {
          ru: "Ведущие",
          uz: "Tadbirkorlar",
          en: "Hosts & MCs",
        },
        description: {
          ru: "Построение тайминга и управление атмосферой.",
          uz: "Tadbir ssenariysi va kayfiyatni boshqarish.",
          en: "Master of ceremonies keeping the event on track.",
        },
        synonyms: ["ведущий", "тамада", "mc"],
        tags: ["mc", "timeline"],
      },
      {
        slug: "entertainment:band",
        parent: "entertainment",
        group: "entertainment",
        title: {
          ru: "Живые группы",
          uz: "Jonli guruhlar",
          en: "Live bands",
        },
        description: {
          ru: "Живая музыка для церемонии или банкета.",
          uz: "Marosim va bazm uchun jonli ijro.",
          en: "Live acts for ceremony, cocktail hour or reception.",
        },
        synonyms: ["группа", "band", "оркестр"],
        tags: ["live", "music", "band"],
      },
      {
        slug: "entertainment:dj",
        parent: "entertainment",
        group: "entertainment",
        title: {
          ru: "DJ",
          uz: "DJ",
          en: "DJs",
        },
        description: {
          ru: "Танцевальная программа и музыкальные паузы.",
          uz: "Raqs dasturi va musiqa pauzalari.",
          en: "Dance floor direction and ambience music.",
        },
        synonyms: ["ди-джей", "dj"],
        tags: ["music", "dance", "dj"],
      },
      {
        slug: "entertainment:show",
        parent: "entertainment",
        group: "entertainment",
        title: {
          ru: "Шоу-программы",
          uz: "Shou dasturlari",
          en: "Show programs",
        },
        description: {
          ru: "Артисты, интерактивы и спецэффекты для гостей.",
          uz: "Artislar, interaktiv chiqishlar va mehmonlar uchun shou.",
          en: "Artists, performances and interactive guest experiences.",
        },
        synonyms: ["шоу", "performance", "artist"],
        tags: ["show", "interactive", "performance"],
      },
    ],
  },
  {
    slug: "beauty",
    group: "beauty",
    title: {
      ru: "Красота и образ",
      uz: "Go'zallik va obraz",
      en: "Beauty & attire",
    },
    description: {
      ru: "Специалисты, которые создают образ пары.",
      uz: "Juftlik obrazini yaratuvchi mutaxassislar.",
      en: "Vendors crafting the couple's look.",
    },
    synonyms: ["макияж", "прическа", "стилист", "платье"],
    tags: ["styling", "hair", "makeup"],
    children: [
      {
        slug: "beauty:stylist",
        parent: "beauty",
        group: "beauty",
        title: {
          ru: "Стилист",
          uz: "Stilist",
          en: "Stylist",
        },
        description: {
          ru: "Подбор образа, консультации, сопровождение в день свадьбы.",
          uz: "Obraz tanlash va to'y kuni hamroh bo'lish.",
          en: "Wardrobe curation and on-the-day styling support.",
        },
        synonyms: ["image", "образ", "stylist"],
        tags: ["style", "consulting"],
      },
      {
        slug: "beauty:makeup",
        parent: "beauty",
        group: "beauty",
        title: {
          ru: "Визажисты",
          uz: "Vizajistlar",
          en: "Makeup artists",
        },
        description: {
          ru: "Пробный макияж и сопровождение в день свадьбы.",
          uz: "Sinoviy make-up va to'y kuni xizmat.",
          en: "Bridal makeup and touch-up support.",
        },
        synonyms: ["makeup", "визаж"],
        tags: ["makeup", "beauty"],
      },
      {
        slug: "beauty:hairsalon",
        parent: "beauty",
        group: "beauty",
        title: {
          ru: "Парикмахеры",
          uz: "Sartaroshlar",
          en: "Hair stylists",
        },
        description: {
          ru: "Прически, укладки, аксессуары.",
          uz: "Soch turmagi va aksessuarlar.",
          en: "Bridal hairstyles and hair accessories.",
        },
        synonyms: ["hair", "причёска"],
        tags: ["hair", "beauty"],
      },
      {
        slug: "beauty:dress",
        parent: "beauty",
        group: "beauty",
        title: {
          ru: "Свадебные платья",
          uz: "Kelinlik liboslari",
          en: "Bridal gowns",
        },
        description: {
          ru: "Салоны и дизайнеры свадебных платьев.",
          uz: "Kelinlik liboslari saloni va dizaynerlari.",
          en: "Boutiques and designers offering bridal gowns.",
        },
        synonyms: ["платье", "bridal"],
        tags: ["dress", "attire", "bridal"],
      },
    ],
  },
  {
    slug: "services",
    group: "services",
    title: {
      ru: "Сервисы",
      uz: "Xizmatlar",
      en: "Services",
    },
    description: {
      ru: "Организация, кейтеринг и вспомогательные подрядчики.",
      uz: "Tashkilotchilar, keitering va qo'shimcha xizmatlar.",
      en: "Planning, catering and supporting vendors.",
    },
    synonyms: ["организация", "кейтеринг", "транспорт", "торт"],
    tags: ["planning", "logistics", "support"],
    children: [
      {
        slug: "services:planner",
        parent: "services",
        group: "services",
        title: {
          ru: "Организаторы",
          uz: "Organizatorlar",
          en: "Planners",
        },
        description: {
          ru: "Полное сопровождение подготовки свадьбы.",
          uz: "To'liq to'yni tashkil etish va boshqarish.",
          en: "Full-service wedding planning and coordination.",
        },
        synonyms: ["организация", "planner"],
        tags: ["planning", "coordination"],
      },
      {
        slug: "services:catering",
        parent: "services",
        group: "services",
        title: {
          ru: "Кейтеринг",
          uz: "Keytering",
          en: "Catering",
        },
        description: {
          ru: "Выездное питание, фуршеты и банкетные линии.",
          uz: "Furket va servis taomlari.",
          en: "Off-site catering, buffets and dessert tables.",
        },
        synonyms: ["кейтеринг", "кейтер"],
        tags: ["food", "service"],
      },
      {
        slug: "services:confectionery",
        parent: "services",
        group: "services",
        title: {
          ru: "Торты и десерты",
          uz: "Tort va desertlar",
          en: "Cakes & desserts",
        },
        description: {
          ru: "Свадебные торты, капкейки, кенди-бар.",
          uz: "To'y tortlari, kapkeyklar, shirinliklar.",
          en: "Wedding cakes, cupcakes and dessert stations.",
        },
        synonyms: ["торт", "кондитер"],
        tags: ["dessert", "sweet"],
      },
      {
        slug: "services:transport",
        parent: "services",
        group: "services",
        title: {
          ru: "Транспорт",
          uz: "Transport",
          en: "Transport",
        },
        description: {
          ru: "Авто и автобусы для трансфера гостей и пары.",
          uz: "Mehmonlar va juftlik uchun transport xizmatlari.",
          en: "Car hire, limousines and guest shuttles.",
        },
        synonyms: ["авто", "машина", "автобус"],
        tags: ["logistics", "transport"],
      },
      {
        slug: "services:stationery",
        parent: "services",
        group: "services",
        title: {
          ru: "Полиграфия",
          uz: "Poligrafiya",
          en: "Stationery",
        },
        description: {
          ru: "Приглашения, карточки рассадки и айдентика.",
          uz: "Taklifnomalar va dizayn elementlari.",
          en: "Invitations, signage and visual identity.",
        },
        synonyms: ["приглашения", "полиграфия"],
        tags: ["stationery", "design"],
      },
    ],
  },
];

function flatten(nodes: CatalogCategoryNode[], parent?: string): CatalogCategory[] {
  const result: CatalogCategory[] = [];
  for (const node of nodes) {
    const entry: CatalogCategory = {
      slug: node.slug,
      title: node.title,
      description: node.description,
      group: node.group,
      parent: node.parent ?? parent,
      synonyms: node.synonyms,
      tags: node.tags,
    };
    result.push(entry);
    if (node.children?.length) {
      result.push(...flatten(node.children, node.slug));
    }
  }
  return result;
}

export const categories = flatten(TREE);

const categoryIndex = new Map<string, CatalogCategory>(categories.map((category) => [category.slug, category]));

export type CatalogCategorySlug = (typeof categories)[number]["slug"];

export function listRootCategories(): CatalogCategory[] {
  return TREE.map(({ children, ...root }) => ({
    ...root,
    parent: undefined,
  }));
}

export function listChildren(slug: string): CatalogCategory[] {
  return categories.filter((category) => category.parent === slug);
}

export function getCategory(slug: string): CatalogCategory | undefined {
  return categoryIndex.get(slug);
}

export function getCategoryPath(slug: string): CatalogCategory[] {
  const path: CatalogCategory[] = [];
  let current = getCategory(slug);
  const safety = categories.length;
  let steps = 0;
  while (current && steps < safety) {
    path.unshift(current);
    steps += 1;
    if (!current.parent) {
      break;
    }
    current = getCategory(current.parent);
  }
  return path;
}

export function searchCategories(query: string): CatalogCategory[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  const matches: CatalogCategory[] = [];
  for (const category of categories) {
    const tokens = [
      category.title.ru,
      category.title.uz,
      category.title.en,
      ...(category.synonyms ?? []),
      ...(category.tags ?? []),
    ]
      .filter(Boolean)
      .map((value) => value.toLowerCase());
    if (tokens.some((token) => token.includes(normalized))) {
      matches.push(category);
    }
  }
  return matches;
}

export const tree = TREE;
