#!/usr/bin/env node
const path = require('path');
const { execSync } = require('child_process');

if (!process.env.PRISMA_SCHEMA_PATH) {
  process.env.PRISMA_SCHEMA_PATH = path.resolve(
    __dirname,
    '..',
    '..',
    'packages',
    'prisma',
    'schema.prisma'
  );
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/wt?schema=public';
  console.warn('[seed] DATABASE_URL was not set. Falling back to local development instance.');
}

let PrismaClient;
try {
  ({ PrismaClient } = require('@prisma/client'));
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND' || /prisma generate/.test(err.message)) {
    console.info('[seed] Prisma client not generated, running pnpm prisma:generate...');
    execSync('pnpm prisma:generate', { stdio: 'inherit' });
    ({ PrismaClient } = require('@prisma/client'));
  } else {
    throw err;
  }
}

const prisma = new PrismaClient();

async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { id: 'seed-admin-user' },
    update: {
      email: 'admin@weddingtech.uz',
      phone: '+998711112233',
      role: 'ADMIN',
      locale: 'ru',
      passwordHash: 'hashed-admin',
    },
    create: {
      id: 'seed-admin-user',
      email: 'admin@weddingtech.uz',
      phone: '+998711112233',
      role: 'ADMIN',
      locale: 'ru',
      passwordHash: 'hashed-admin',
    },
  });

  const coupleUser = await prisma.user.upsert({
    where: { id: 'seed-couple-user' },
    update: {
      email: 'aliya@couple.uz',
      phone: '+998901112233',
      role: 'PAIR',
      locale: 'ru',
      passwordHash: 'hashed-pair',
    },
    create: {
      id: 'seed-couple-user',
      email: 'aliya@couple.uz',
      phone: '+998901112233',
      role: 'PAIR',
      locale: 'ru',
      passwordHash: 'hashed-pair',
    },
  });

  const vendorUser = await prisma.user.upsert({
    where: { id: 'seed-vendor-user' },
    update: {
      email: 'vendor@weddingtech.uz',
      phone: '+998951234567',
      role: 'VENDOR',
      locale: 'ru',
      passwordHash: 'hashed-vendor',
    },
    create: {
      id: 'seed-vendor-user',
      email: 'vendor@weddingtech.uz',
      phone: '+998951234567',
      role: 'VENDOR',
      locale: 'ru',
      passwordHash: 'hashed-vendor',
    },
  });

  return { admin, coupleUser, vendorUser };
}

async function seedCouple(coupleUser) {
  const couple = await prisma.couple.upsert({
    where: { id: 'seed-couple' },
    update: {
      weddingDate: new Date('2025-06-15T12:00:00.000Z'),
      city: 'Ташкент',
      preferences: {
        style: 'modern',
        budget: 'medium',
      },
    },
    create: {
      id: 'seed-couple',
      userId: coupleUser.id,
      weddingDate: new Date('2025-06-15T12:00:00.000Z'),
      city: 'Ташкент',
      preferences: {
        style: 'modern',
        budget: 'medium',
      },
    },
  });

  const table = await prisma.table.upsert({
    where: { id: 'seed-table-top' },
    update: {
      name: 'Главный стол',
      seats: 8,
      sort: 1,
    },
    create: {
      id: 'seed-table-top',
      coupleId: couple.id,
      name: 'Главный стол',
      seats: 8,
      sort: 1,
    },
  });

  const guests = await Promise.all([
    prisma.guest.upsert({
      where: { id: 'seed-guest-aliya' },
      update: {
        name: 'Алия Нурматова',
        phone: '+998901112233',
        email: 'aliya@example.com',
        status: 'GOING',
        tableId: table.id,
      },
      create: {
        id: 'seed-guest-aliya',
        coupleId: couple.id,
        name: 'Алия Нурматова',
        phone: '+998901112233',
        email: 'aliya@example.com',
        status: 'GOING',
        tableId: table.id,
      },
    }),
    prisma.guest.upsert({
      where: { id: 'seed-guest-bekzod' },
      update: {
        name: 'Бекзод Рахимов',
        phone: '+998931234567',
        email: 'bekzod@example.com',
        status: 'INVITED',
      },
      create: {
        id: 'seed-guest-bekzod',
        coupleId: couple.id,
        name: 'Бекзод Рахимов',
        phone: '+998931234567',
        email: 'bekzod@example.com',
        status: 'INVITED',
      },
    }),
  ]);

  const budgetItems = await Promise.all([
    prisma.budgetItem.upsert({
      where: { id: 'seed-budget-venue' },
      update: {
        category: 'venue',
        planned: 4000,
        actual: 4200,
        note: 'Включено оформление зала',
      },
      create: {
        id: 'seed-budget-venue',
        coupleId: couple.id,
        category: 'venue',
        planned: 4000,
        actual: 4200,
        note: 'Включено оформление зала',
      },
    }),
    prisma.budgetItem.upsert({
      where: { id: 'seed-budget-photo' },
      update: {
        category: 'photography',
        planned: 1500,
        actual: 1500,
      },
      create: {
        id: 'seed-budget-photo',
        coupleId: couple.id,
        category: 'photography',
        planned: 1500,
        actual: 1500,
      },
    }),
  ]);

  const website = await prisma.website.upsert({
    where: { id: 'seed-website' },
    update: {
      slug: 'aliya-i-bekzod',
      themeId: 'classic',
      isPublished: true,
      rsvpPublicEnabled: true,
    },
    create: {
      id: 'seed-website',
      coupleId: couple.id,
      slug: 'aliya-i-bekzod',
      themeId: 'classic',
      isPublished: true,
      rsvpPublicEnabled: true,
    },
  });

  const rsvp = await prisma.rSVP.upsert({
    where: { id: 'seed-rsvp-bekzod' },
    update: {
      websiteId: website.id,
      guestId: guests[1].id,
      name: 'Бекзод Рахимов',
      contact: 'bekzod@example.com',
      response: 'INVITED',
    },
    create: {
      id: 'seed-rsvp-bekzod',
      websiteId: website.id,
      guestId: guests[1].id,
      name: 'Бекзод Рахимов',
      contact: 'bekzod@example.com',
      response: 'INVITED',
    },
  });

  return { couple, table, guests, budgetItems, website, rsvp };
}

async function seedVendor(vendorUser) {
  const vendor = await prisma.vendor.upsert({
    where: { id: 'seed-vendor' },
    update: {
      title: 'Royal Hall',
      type: 'venue',
      city: 'Ташкент',
      address: 'ул. Нукус, 12',
      priceFrom: 3500,
      rating: 4.6,
      verified: true,
      profileScore: 85,
      media: { gallery: ['https://example.com/hall-1.jpg'] },
    },
    create: {
      id: 'seed-vendor',
      ownerUserId: vendorUser.id,
      title: 'Royal Hall',
      type: 'venue',
      city: 'Ташкент',
      address: 'ул. Нукус, 12',
      priceFrom: 3500,
      rating: 4.6,
      verified: true,
      profileScore: 85,
      media: { gallery: ['https://example.com/hall-1.jpg'] },
    },
  });

  const venue = await prisma.venue.upsert({
    where: { id: 'seed-vendor-venue' },
    update: {
      title: 'Royal Hall — Главный зал',
      capacityMin: 80,
      capacityMax: 250,
      features: { parking: true, liveMusic: true },
    },
    create: {
      id: 'seed-vendor-venue',
      vendorId: vendor.id,
      title: 'Royal Hall — Главный зал',
      capacityMin: 80,
      capacityMax: 250,
      features: { parking: true, liveMusic: true },
    },
  });

  const slot = await prisma.availabilitySlot.upsert({
    where: { id: 'seed-availability-slot' },
    update: {
      vendorId: vendor.id,
      venueId: venue.id,
      date: new Date('2025-06-15T12:00:00.000Z'),
      status: 'OPEN',
    },
    create: {
      id: 'seed-availability-slot',
      vendorId: vendor.id,
      venueId: venue.id,
      date: new Date('2025-06-15T12:00:00.000Z'),
      status: 'OPEN',
    },
  });

  const offer = await prisma.offer.upsert({
    where: { id: 'seed-offer' },
    update: {
      vendorId: vendor.id,
      title: 'Летний свадебный пакет',
      description: 'Аренда зала + обслуживание + welcome зона',
      price: 4800,
      validFrom: new Date('2025-01-01T00:00:00.000Z'),
      validTo: new Date('2025-12-31T00:00:00.000Z'),
      isHighlighted: true,
    },
    create: {
      id: 'seed-offer',
      vendorId: vendor.id,
      title: 'Летний свадебный пакет',
      description: 'Аренда зала + обслуживание + welcome зона',
      price: 4800,
      validFrom: new Date('2025-01-01T00:00:00.000Z'),
      validTo: new Date('2025-12-31T00:00:00.000Z'),
      isHighlighted: true,
    },
  });

  const rankSignal = await prisma.rankSignal.upsert({
    where: { id: 'seed-rank-signal' },
    update: {
      vendorId: vendor.id,
      venueId: venue.id,
      signalType: 'profile_score',
      weight: 0.9,
      ttl: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
    create: {
      id: 'seed-rank-signal',
      vendorId: vendor.id,
      venueId: venue.id,
      signalType: 'profile_score',
      weight: 0.9,
      ttl: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  return { vendor, venue, slot, offer, rankSignal };
}

async function seedEnquiry(couple, vendor, venue, admin, coupleUser) {
  const enquiry = await prisma.enquiry.upsert({
    where: { id: 'seed-enquiry' },
    update: {
      coupleId: couple.id,
      vendorId: vendor.id,
      venueId: venue.id,
      eventDate: new Date('2025-06-15T12:00:00.000Z'),
      guests: 180,
      budget: 5000,
      status: 'QUOTE_SENT',
    },
    create: {
      id: 'seed-enquiry',
      coupleId: couple.id,
      vendorId: vendor.id,
      venueId: venue.id,
      eventDate: new Date('2025-06-15T12:00:00.000Z'),
      guests: 180,
      budget: 5000,
      status: 'QUOTE_SENT',
    },
  });

  const note = await prisma.enquiryNote.upsert({
    where: { id: 'seed-enquiry-note' },
    update: {
      enquiryId: enquiry.id,
      authorId: admin.id,
      text: 'Отправлено коммерческое предложение.',
    },
    create: {
      id: 'seed-enquiry-note',
      enquiryId: enquiry.id,
      authorId: admin.id,
      text: 'Отправлено коммерческое предложение.',
    },
  });

  const review = await prisma.review.upsert({
    where: { id: 'seed-review' },
    update: {
      enquiryId: enquiry.id,
      rating: 5,
      text: 'Отличная площадка и команда!',
      isPublished: true,
      moderationStatus: 'approved',
    },
    create: {
      id: 'seed-review',
      enquiryId: enquiry.id,
      rating: 5,
      text: 'Отличная площадка и команда!',
      isPublished: true,
      moderationStatus: 'approved',
    },
  });

  const auditEvent = await prisma.auditEvent.upsert({
    where: { id: 'seed-audit-event' },
    update: {
      entity: 'Enquiry',
      entityId: enquiry.id,
      type: 'STATUS_CHANGE',
      data: { previous: 'NEW', next: 'QUOTE_SENT', actor: coupleUser.id },
      byUserId: coupleUser.id,
    },
    create: {
      id: 'seed-audit-event',
      entity: 'Enquiry',
      entityId: enquiry.id,
      type: 'STATUS_CHANGE',
      data: { previous: 'NEW', next: 'QUOTE_SENT', actor: coupleUser.id },
      byUserId: coupleUser.id,
    },
  });

  return { enquiry, note, review, auditEvent };
}

async function main() {
  try {
    console.info('[seed] Starting data seeding');
    const { admin, coupleUser, vendorUser } = await seedUsers();
    const { couple, guests, website } = await seedCouple(coupleUser);
    const { vendor, venue } = await seedVendor(vendorUser);
    const enquiryData = await seedEnquiry(couple, vendor, venue, admin, coupleUser);
    console.info('[seed] Demo vendors seeded');

    console.info('[seed] Seed summary:', {
      users: ['admin', 'couple', 'vendor'],
      couple: couple.id,
      guests: guests.map((guest) => guest.name),
      website: website.slug,
      vendor: vendor.title,
      enquiry: enquiryData.enquiry.id,
    });
    console.info('[seed] Completed successfully');
  } catch (error) {
    console.error('[seed] Failed to seed database');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
