/**
 * Demo payment provider for development and testing.
 * This is a mock implementation that simulates payment operations.
 */

let intentCounter = 1;
const intents = new Map();

export const DemoProvider = {
  /**
   * Creates a payment intent
   * @param {{ amount: number; currency: string }} options
   * @returns {Promise<{ ok: boolean; id: string; clientSecret: string; amount: number; currency: string; status: string }>}
   */
  async createIntent({ amount, currency }) {
    const id = `pi_demo_${intentCounter++}`;
    const clientSecret = `secret_demo_${id}`;
    
    const intent = {
      ok: true,
      id,
      clientSecret,
      amount,
      currency,
      status: "requires_capture"
    };
    
    intents.set(id, intent);
    return intent;
  },

  /**
   * Captures a payment intent
   * @param {string} id - Payment intent ID
   * @returns {Promise<{ ok: boolean; status: string; id: string }>}
   */
  async capture(id) {
    const intent = intents.get(id);
    if (!intent) {
      return { ok: false, status: "not_found", id };
    }
    
    intent.status = "succeeded";
    return { ok: true, status: "succeeded", id };
  },

  /**
   * Refunds a payment
   * @param {string} id - Payment intent ID
   * @returns {Promise<{ ok: boolean; status: string; id: string }>}
   */
  async refund(id) {
    const intent = intents.get(id);
    if (!intent) {
      return { ok: false, status: "not_found", id };
    }
    
    intent.status = "refunded";
    return { ok: true, status: "refunded", id };
  }
};
