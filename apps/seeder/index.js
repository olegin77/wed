#!/usr/bin/env node
/**
 * Primitive seeding script that prepares demo data for local development.
 *
 * The script relies on Prisma `upsert` operations, therefore it is safe to run
 * multiple times — each invocation reconciles the data with the desired state
 * instead of creating duplicates.
 */
const path = require('path');
const { execSync } = require('child_process');

/**
 * Default to the repository Prisma schema when the consumer does not specify
 * an explicit path. This mirrors what `pnpm prisma:generate` uses by default
 * inside the monorepo.
 */
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

/**
 * Fall back to the conventional local Postgres instance so the script remains
 * useful right after cloning the repository.
 */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5434/wt?schema=public';
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

/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient();

/**
 * Ensures the three core platform users exist: an admin, a couple owner and
 * a vendor owner. Each record is reconciled via `upsert`.
 *
 * @returns {Promise<{admin: import('@prisma/client').User, coupleUser: import('@prisma/client').User, vendorUser: import('@prisma/client').User}>}
 */
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

/**
 * Creates a showcase couple with associated guests, table, budget and public
 * website so that other services have meaningful demo data to display.
 *
 * @param {import('@prisma/client').User} coupleUser - Owner user for the couple profile.
 * @returns {Promise<{couple: import('@prisma/client').Couple, table: import('@prisma/client').Table, guests: import('@prisma/client').Guest[], budgetItems: import('@prisma/client').BudgetItem[], website: import('@prisma/client').Website, rsvp: import('@prisma/client').RSVP}>}
 */
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

/**
 * Creates a sample vendor with an associated venue, availability slot, offer
 * and ranking signal so marketplace flows have representative fixtures.
 *
 * @param {import('@prisma/client').User} vendorUser - Owner account for the vendor entity.
 * @returns {Promise<{vendor: import('@prisma/client').Vendor, venue: import('@prisma/client').Venue, slot: import('@prisma/client').AvailabilitySlot, offer: import('@prisma/client').Offer, rankSignal: import('@prisma/client').RankSignal, document: import('@prisma/client').VendorDocument}>}
 */
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

  // Reconcile a verified compliance document to showcase vendor onboarding.
  const document = await prisma.vendorDocument.upsert({
    where: { id: 'seed-vendor-document' },
    update: {
      vendorId: vendor.id,
      title: 'Лицензия на организацию мероприятий',
      url: 'https://example.com/docs/vendor-license.pdf',
      verified: true,
    },
    create: {
      id: 'seed-vendor-document',
      vendorId: vendor.id,
      title: 'Лицензия на организацию мероприятий',
      url: 'https://example.com/docs/vendor-license.pdf',
      verified: true,
    },
  });

  return { vendor, venue, slot, offer, rankSignal, document };
}

/**
 * Connects the couple with the vendor through an enquiry, adds internal
 * collaboration artifacts (notes, reviews and audit trail) and keeps the
 * dataset realistic.
 *
 * @param {import('@prisma/client').Couple} couple - The seeded couple entity.
 * @param {import('@prisma/client').Vendor} vendor - The seeded vendor entity.
 * @param {import('@prisma/client').Venue} venue - Venue linked to the enquiry.
 * @param {import('@prisma/client').User} admin - Admin user to author the note.
 * @param {import('@prisma/client').User} coupleUser - Couple owner to attribute audit trail.
 * @returns {Promise<{enquiry: import('@prisma/client').Enquiry, note: import('@prisma/client').EnquiryNote, review: import('@prisma/client').Review, auditEvent: import('@prisma/client').AuditEvent, channel: import('@prisma/client').EnquiryChannel}>}
 */
async function seedEnquiry(couple, vendor, venue, admin, coupleUser) {
  const enquiry = await prisma.enquiry.upsert({
    where: { id: 'seed-enquiry' },
    update: {
      coupleId: couple.id,
      userId: coupleUser.id,
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
      userId: coupleUser.id,
      vendorId: vendor.id,
      venueId: venue.id,
      eventDate: new Date('2025-06-15T12:00:00.000Z'),
      guests: 180,
      budget: 5000,
      status: 'QUOTE_SENT',
    },
  });

  const channel = await prisma.enquiryChannel.upsert({
    where: { enquiryId: enquiry.id },
    update: {
      coupleId: couple.id,
      vendorId: vendor.id,
      coupleUserId: coupleUser.id,
      primaryVendorUserId: vendor.ownerUserId,
    },
    create: {
      id: 'seed-enquiry-channel',
      enquiryId: enquiry.id,
      coupleId: couple.id,
      vendorId: vendor.id,
      coupleUserId: coupleUser.id,
      primaryVendorUserId: vendor.ownerUserId,
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

  return { enquiry, note, review, auditEvent, channel };
}

/**
 * Entrypoint that orchestrates all seeding steps and prints a concise summary
 * highlighting the most relevant demo entities.
 */
async function main() {
  try {
    console.info('[seed] Starting data seeding');
    const { admin, coupleUser, vendorUser } = await seedUsers();
    const coupleData = await seedCouple(coupleUser);
    const vendorData = await seedVendor(vendorUser);
    const enquiryData = await seedEnquiry(
      coupleData.couple,
      vendorData.vendor,
      vendorData.venue,
      admin,
      coupleUser
    );

    // Ensure the couple bookmarks the vendor for catalogue demo flows.
    const favourite = await prisma.favourite.upsert({
      where: { id: 'seed-favourite' },
      update: {
        userId: coupleUser.id,
        vendorId: vendorData.vendor.id,
      },
      create: {
        id: 'seed-favourite',
        userId: coupleUser.id,
        vendorId: vendorData.vendor.id,
      },
    });

    console.info('[seed] Seed summary:', {
      users: ['admin', 'couple', 'vendor'],
      couple: coupleData.couple.id,
      guests: coupleData.guests.map((guest) => guest.name),
      table: coupleData.table.name,
      budget: coupleData.budgetItems.map((item) => ({ category: item.category, actual: item.actual })),
      website: coupleData.website.slug,
      rsvp: coupleData.rsvp.id,
      vendor: vendorData.vendor.title,
      venue: vendorData.venue.title,
      offers: [vendorData.offer.title],
      availability:
        vendorData.slot.date instanceof Date
          ? vendorData.slot.date.toISOString()
          : vendorData.slot.date,
      rankSignal: vendorData.rankSignal.signalType,
      vendorDocument: vendorData.document.title,
      enquiry: enquiryData.enquiry.id,
      enquiryChannel: {
        id: enquiryData.channel.id,
        coupleUser: coupleUser.email,
        vendorOwner: vendorUser.email,
      },
      favourite: favourite.id,
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
