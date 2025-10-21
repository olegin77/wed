import { PrismaClient } from "@prisma/client";

/**
 * Prisma client reused across seed routines.
 */
const prisma = new PrismaClient();

/**
 * Canonical marketplace cities showcased in the demo dataset. The list stays small
 * on purpose so local environments can quickly explore filtering by geography.
 */
const catalogCities = [
  {
    id: "seed-city-tashkent",
    slug: "tashkent",
    title: "Ташкент",
    region: "Ташкентская область",
    countryCode: "UZ",
    description: "Столица и крупнейший город Узбекистана — основной рынок площадок.",
  },
  {
    id: "seed-city-samarkand",
    slug: "samarkand",
    title: "Самарканд",
    region: "Самаркандская область",
    countryCode: "UZ",
    description: "Исторический центр, популярный для культурных свадеб и фотосессий.",
  },
  {
    id: "seed-city-bukhara",
    slug: "bukhara",
    title: "Бухара",
    region: "Бухарская область",
    countryCode: "UZ",
    description: "Аутентичные дворики и бутик-отели для камерных мероприятий.",
  },
];

/**
 * Core catalogue categories that appear throughout demo fixtures. Every entry
 * includes a slug (for URLs), a human readable title and an optional summary
 * that can power UI tooltips.
 */
const catalogCategories = [
  {
    id: "seed-category-venues",
    slug: "venues",
    title: "Площадки",
    summary: "Залы, рестораны и пространства для основного торжества.",
    icon: "building",
  },
  {
    id: "seed-category-catering",
    slug: "catering",
    title: "Кейтеринг",
    summary: "Команды, отвечающие за банкет, фуршет и welcome-зону.",
    icon: "utensils",
  },
  {
    id: "seed-category-photo",
    slug: "photo",
    title: "Фото и видео",
    summary: "Фотографы и видеографы, сохраняющие воспоминания о дне свадьбы.",
    icon: "camera",
  },
];

type DemoVendorSeed = {
  owner: {
    id: string;
    email: string;
    phone: string;
  };
  vendor: {
    id: string;
    title: string;
    type: string;
    city: string;
    address: string;
    priceFrom: number;
    rating: number;
    verified: boolean;
    profileScore: number;
    media: Record<string, unknown>;
  };
  venue: {
    id: string;
    title: string;
    capacityMin: number;
    capacityMax: number;
    features: Record<string, unknown>;
  };
  offer: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
};

type DemoAgencyMemberSeed = {
  user: {
    id: string;
    email: string;
    phone: string;
  };
  role: "OWNER" | "AGENT";
};

type DemoAgencySeed = {
  agency: {
    id: string;
    title: string;
  };
  vendorIds: string[];
  members: ReadonlyArray<DemoAgencyMemberSeed>;
};

/**
 * Specification for each demo vendor. The structure keeps IDs deterministic so
 * rerunning the seed reconciles records without creating duplicates.
 */
const demoVendors: ReadonlyArray<DemoVendorSeed> = [
  {
    owner: {
      id: "seed-owner-royal-hall",
      email: "royal.hall@demo.uz",
      phone: "+998 90 000 0001",
    },
    vendor: {
      id: "seed-vendor-royal-hall",
      title: "Royal Hall",
      type: "venues",
      city: "Ташкент",
      address: "ул. Нукус, 12",
      priceFrom: 3500,
      rating: 4.8,
      verified: true,
      profileScore: 92,
      media: {
        gallery: [
          "https://images.example.com/royal-hall/main.jpg",
          "https://images.example.com/royal-hall/hall.jpg",
        ],
      },
    },
    venue: {
      id: "seed-venue-royal-hall",
      title: "Royal Hall — Главный зал",
      capacityMin: 80,
      capacityMax: 260,
      features: { parking: true, liveMusic: true, outdoor: false },
    },
    offer: {
      id: "seed-offer-royal-hall",
      title: "Пакет «Классический банкет»",
      description: "Аренда зала, банкет и оформление welcome зоны.",
      price: 4800,
    },
  },
  {
    owner: {
      id: "seed-owner-samarkand-catering",
      email: "oriental.table@demo.uz",
      phone: "+998 90 000 0002",
    },
    vendor: {
      id: "seed-vendor-oriental-table",
      title: "Oriental Table",
      type: "catering",
      city: "Самарканд",
      address: "проспект Регистан, 5",
      priceFrom: 1800,
      rating: 4.5,
      verified: true,
      profileScore: 84,
      media: {
        gallery: [
          "https://images.example.com/oriental-table/buffet.jpg",
          "https://images.example.com/oriental-table/dessert.jpg",
        ],
      },
    },
    venue: {
      id: "seed-venue-oriental-table",
      title: "Oriental Table — Кейтеринг",
      capacityMin: 30,
      capacityMax: 200,
      features: { halal: true, liveCooking: true, bar: true },
    },
    offer: {
      id: "seed-offer-oriental-table",
      title: "Фуршет на 100 гостей",
      description: "Региональные закуски, горячие блюда и десертная станция.",
      price: 2600,
    },
  },
  {
    owner: {
      id: "seed-owner-aurora-studio",
      email: "aurora.studio@demo.uz",
      phone: "+998 90 000 0003",
    },
    vendor: {
      id: "seed-vendor-aurora-studio",
      title: "Aurora Studio",
      type: "photo",
      city: "Бухара",
      address: "ул. Ибн Сина, 22",
      priceFrom: 950,
      rating: 4.7,
      verified: false,
      profileScore: 78,
      media: {
        gallery: [
          "https://images.example.com/aurora-studio/portrait.jpg",
          "https://images.example.com/aurora-studio/team.jpg",
        ],
      },
    },
    venue: {
      id: "seed-venue-aurora-studio",
      title: "Aurora Studio — Фотостудия",
      capacityMin: 2,
      capacityMax: 12,
      features: { daylight: true, props: true, stylist: true },
    },
    offer: {
      id: "seed-offer-aurora-studio",
      title: "Love Story в Бухаре",
      description: "Выездная съёмка в старом городе и постобработка 60 фотографий.",
      price: 1350,
    },
  },
];

/**
 * Agency fixtures emulate multi-account usage when several agents collaborate on
 * the same vendor portfolio. The members list intentionally reuses vendor
 * owners so personal accounts remain linked to their original profiles while
 * new operator identities demonstrate shared access.
 */
const demoAgencies: ReadonlyArray<DemoAgencySeed> = [
  {
    agency: {
      id: "seed-agency-royal-collective",
      title: "Royal Collective",
    },
    vendorIds: ["seed-vendor-royal-hall"],
    members: [
      {
        user: {
          id: "seed-owner-royal-hall",
          email: "royal.hall@demo.uz",
          phone: "+998 90 000 0001",
        },
        role: "OWNER",
      },
      {
        user: {
          id: "seed-agent-royal-ops",
          email: "royal.ops@demo.uz",
          phone: "+998 90 000 0500",
        },
        role: "AGENT",
      },
    ],
  },
  {
    agency: {
      id: "seed-agency-samarkand-bureau",
      title: "Samarkand Events Bureau",
    },
    vendorIds: ["seed-vendor-oriental-table", "seed-vendor-aurora-studio"],
    members: [
      {
        user: {
          id: "seed-owner-samarkand-catering",
          email: "oriental.table@demo.uz",
          phone: "+998 90 000 0002",
        },
        role: "OWNER",
      },
      {
        user: {
          id: "seed-agent-nargiza",
          email: "nargiza.events@demo.uz",
          phone: "+998 90 000 0501",
        },
        role: "AGENT",
      },
    ],
  },
];

/**
 * Seeds catalogue cities using deterministic identifiers so reruns simply update
 * metadata. The routine returns the reconciled records to compose a short summary.
 */
async function seedCatalogCities() {
  const results = [] as { id: string; slug: string }[];

  for (const city of catalogCities) {
    const record = await prisma.catalogCity.upsert({
      where: { id: city.id },
      create: {
        id: city.id,
        slug: city.slug,
        title: city.title,
        region: city.region,
        countryCode: city.countryCode,
        description: city.description,
      },
      update: {
        slug: city.slug,
        title: city.title,
        region: city.region,
        countryCode: city.countryCode,
        description: city.description,
      },
    });

    results.push({ id: record.id, slug: record.slug });
  }

  return results;
}

/**
 * Seeds catalogue categories. Each entry is idempotent and preserves iconography
 * so UI clients can rely on consistent identifiers between runs.
 */
async function seedCatalogCategories() {
  const results = [] as { id: string; slug: string }[];

  for (const category of catalogCategories) {
    const record = await prisma.catalogCategory.upsert({
      where: { id: category.id },
      create: {
        id: category.id,
        slug: category.slug,
        title: category.title,
        summary: category.summary,
        icon: category.icon,
      },
      update: {
        slug: category.slug,
        title: category.title,
        summary: category.summary,
        icon: category.icon,
      },
    });

    results.push({ id: record.id, slug: record.slug });
  }

  return results;
}

/**
 * Seeds demo vendors together with their venues, highlighted offer and a single
 * availability slot. Users are created alongside the vendor to keep ownership
 * relations intact.
 */
async function seedDemoVendors() {
  const summary: { vendorId: string; venueId: string }[] = [];

  for (const spec of demoVendors) {
    const owner = await prisma.user.upsert({
      where: { id: spec.owner.id },
      create: {
        id: spec.owner.id,
        email: spec.owner.email,
        phone: spec.owner.phone,
        role: "VENDOR",
        locale: "ru",
        passwordHash: "seed-owner",
      },
      update: {
        email: spec.owner.email,
        phone: spec.owner.phone,
        role: "VENDOR",
        locale: "ru",
      },
    });

    const vendor = await prisma.vendor.upsert({
      where: { id: spec.vendor.id },
      create: {
        id: spec.vendor.id,
        ownerUserId: owner.id,
        title: spec.vendor.title,
        type: spec.vendor.type,
        city: spec.vendor.city,
        address: spec.vendor.address,
        priceFrom: spec.vendor.priceFrom,
        rating: spec.vendor.rating,
        verified: spec.vendor.verified,
        profileScore: spec.vendor.profileScore,
        media: spec.vendor.media,
      },
      update: {
        ownerUserId: owner.id,
        title: spec.vendor.title,
        type: spec.vendor.type,
        city: spec.vendor.city,
        address: spec.vendor.address,
        priceFrom: spec.vendor.priceFrom,
        rating: spec.vendor.rating,
        verified: spec.vendor.verified,
        profileScore: spec.vendor.profileScore,
        media: spec.vendor.media,
      },
    });

    const venue = await prisma.venue.upsert({
      where: { id: spec.venue.id },
      create: {
        id: spec.venue.id,
        vendorId: vendor.id,
        title: spec.venue.title,
        capacityMin: spec.venue.capacityMin,
        capacityMax: spec.venue.capacityMax,
        features: spec.venue.features,
      },
      update: {
        vendorId: vendor.id,
        title: spec.venue.title,
        capacityMin: spec.venue.capacityMin,
        capacityMax: spec.venue.capacityMax,
        features: spec.venue.features,
      },
    });

    await prisma.offer.upsert({
      where: { id: spec.offer.id },
      create: {
        id: spec.offer.id,
        vendorId: vendor.id,
        title: spec.offer.title,
        description: spec.offer.description,
        price: spec.offer.price,
        isHighlighted: true,
      },
      update: {
        vendorId: vendor.id,
        title: spec.offer.title,
        description: spec.offer.description,
        price: spec.offer.price,
        isHighlighted: true,
      },
    });

    await prisma.availabilitySlot.upsert({
      where: { id: `${spec.vendor.id}-slot` },
      create: {
        id: `${spec.vendor.id}-slot`,
        vendorId: vendor.id,
        venueId: venue.id,
        date: new Date("2025-06-15T12:00:00.000Z"),
        status: "OPEN",
      },
      update: {
        vendorId: vendor.id,
        venueId: venue.id,
        date: new Date("2025-06-15T12:00:00.000Z"),
        status: "OPEN",
      },
    });

    summary.push({ vendorId: vendor.id, venueId: venue.id });
  }

  return summary;
}

/**
 * Seeds demo agencies with deterministic identifiers, ensuring members are
 * linked to the relevant organisations and that shared vendor ownership is
 * reflected through the new relation.
 */
async function seedDemoAgencies() {
  const summary: { agencyId: string; memberCount: number; vendorCount: number }[] = [];

  for (const spec of demoAgencies) {
    const agency = await prisma.agency.upsert({
      where: { id: spec.agency.id },
      create: {
        id: spec.agency.id,
        title: spec.agency.title,
      },
      update: {
        title: spec.agency.title,
      },
    });

    let members = 0;

    for (const member of spec.members) {
      const user = await prisma.user.upsert({
        where: { id: member.user.id },
        create: {
          id: member.user.id,
          email: member.user.email,
          phone: member.user.phone,
          role: "VENDOR",
          locale: "ru",
          passwordHash: member.role === "OWNER" ? "seed-owner" : "seed-agent",
        },
        update: {
          email: member.user.email,
          phone: member.user.phone,
          role: "VENDOR",
          locale: "ru",
        },
      });

      await prisma.agencyMember.upsert({
        where: { id: `${agency.id}-${user.id}` },
        create: {
          id: `${agency.id}-${user.id}`,
          agencyId: agency.id,
          userId: user.id,
          role: member.role,
        },
        update: {
          role: member.role,
        },
      });

      members += 1;
    }

    if (spec.vendorIds.length > 0) {
      await prisma.vendor.updateMany({
        where: { id: { in: spec.vendorIds } },
        data: { agencyId: agency.id },
      });
    }

    summary.push({
      agencyId: agency.id,
      vendorCount: spec.vendorIds.length,
      memberCount: members,
    });
  }

  return summary;
}

/**
 * Executes seed routines sequentially and prints a compact summary so developers
 * can immediately confirm which fixtures were reconciled.
 */
async function main() {
  try {
    const [cities, categories] = await Promise.all([
      seedCatalogCities(),
      seedCatalogCategories(),
    ]);

    const vendors = await seedDemoVendors();
    const agencies = await seedDemoAgencies();

    console.log("[seed] Catalogue cities:");
    console.table(cities);

    console.log("[seed] Catalogue categories:");
    console.table(categories);

    console.log("[seed] Demo vendors and venues:");
    console.table(vendors);

    console.log("[seed] Agencies and members:");
    console.table(agencies);
  } catch (error) {
    console.error("[seed] Failed to populate demo data", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();

await db.promoCode.upsert({
  where:{code:"WELCOME10"},
  update:{},
  create:{code:"WELCOME10",discount:10,validTill:new Date(Date.now()+30*86400000)}
});

await db.promoCode.upsert({
  where:{code:"WELCOME10"},
  update:{},
  create:{code:"WELCOME10",discount:10,validTill:new Date(Date.now()+30*86400000)}
});
