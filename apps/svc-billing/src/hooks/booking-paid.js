import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * Marks a booking as paid after the capture step succeeds.
 *
 * @param {string} bookingId - Identifier of the booking that was charged.
 * @returns {Promise<{ ok: boolean; bookingId?: string; reason?: string }>} Result of the update attempt.
 */
export async function markPaid(bookingId) {
  if (!bookingId) {
    return { ok: false, reason: "missing_booking_id" };
  }

  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
    });

    return { ok: true, bookingId: updated.id };
  } catch (error) {
    if (error.code === "P2025") {
      return { ok: false, reason: "booking_not_found" };
    }

    console.error("mark_paid_failed", error);
    return { ok: false, reason: "unexpected_error" };
  }
}
