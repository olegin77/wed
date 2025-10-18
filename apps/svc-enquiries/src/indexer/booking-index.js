import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const startOfDayUtc = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const slotLabel = (startAt, endAt) =>
  `${startAt.toISOString().slice(11, 16)}-${endAt.toISOString().slice(11, 16)}`;

export async function updateIndex(vendorId, startAt, endAt) {
  if (!vendorId || !(startAt instanceof Date) || !(endAt instanceof Date)) {
    return;
  }

  const day = startOfDayUtc(startAt);
  const label = slotLabel(startAt, endAt);

  const existing = await prisma.bookingIndex.findUnique({
    where: { vendorId_day: { vendorId, day } },
  });

  let slots = [];
  if (existing?.slots) {
    try {
      const parsed = JSON.parse(existing.slots);
      if (Array.isArray(parsed)) {
        slots = parsed;
      }
    } catch (error) {
      console.warn("booking_index_parse_error", error);
    }
  }

  if (!slots.includes(label)) {
    slots.push(label);
  }

  const data = { vendorId, day, slots: JSON.stringify(slots) };

  if (existing) {
    await prisma.bookingIndex.update({ where: { vendorId_day: { vendorId, day } }, data });
  } else {
    await prisma.bookingIndex.create({ data });
  }
}
