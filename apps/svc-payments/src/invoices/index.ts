import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Allowed lifecycle states for an invoice inside the payments service.
 */
export type InvoiceStatus =
  | "draft"
  | "issued"
  | "partially_paid"
  | "paid"
  | "void";

/**
 * Single line item that contributes to the invoice total.
 */
export interface InvoiceLine {
  /**
   * Human-readable description of the line item.
   */
  description: string;
  /**
   * Quantity of units sold (defaults to one when omitted).
   */
  quantity: number;
  /**
   * Price per unit in the invoice currency.
   */
  unitPrice: number;
  /**
   * Quantity multiplied by the unit price.
   */
  total: number;
  /**
   * Additional structured metadata preserved for downstream integrations.
   */
  metadata?: Record<string, unknown>;
}

/**
 * Recorded payment that contributes to settling the invoice.
 */
export interface PaymentRecord {
  /**
   * Unique identifier of the payment record for traceability.
   */
  id: string;
  /**
   * Amount captured with the payment record.
   */
  amount: number;
  /**
   * ISO-8601 timestamp describing when the payment happened.
   */
  paidAt: string;
  /**
   * External reference (transaction id, PSP reference, etc.).
   */
  reference?: string;
  /**
   * Optional operator notes captured during manual reconciliation.
   */
  note?: string;
}

/**
 * Representation of an invoice tracked by the service.
 */
export interface Invoice {
  /**
   * Primary identifier of the invoice.
   */
  id: string;
  /**
   * Related booking identifier (if applicable).
   */
  bookingId: string;
  /**
   * Total amount expected from the customer.
   */
  amount: number;
  /**
   * Three-letter currency code of the invoice.
   */
  currency: string;
  /**
   * Current lifecycle status.
   */
  status: InvoiceStatus;
  /**
   * Outstanding balance after accounting for captured payments.
   */
  balanceDue: number;
  /**
   * Timestamp of invoice issuance.
   */
  issuedAt: string;
  /**
   * Optional due date to surface in reminders.
   */
  dueAt?: string;
  /**
   * Timestamp of final settlement.
   */
  paidAt?: string;
  /**
   * Timestamp of voiding (if the invoice has been voided).
   */
  voidedAt?: string;
  /**
   * Collection of line items.
   */
  lines: InvoiceLine[];
  /**
   * Historical payment records applied to the invoice.
   */
  payments: PaymentRecord[];
  /**
   * Optional structured metadata associated with the invoice.
   */
  metadata: Record<string, unknown>;
  /**
   * Operator-supplied reason for voiding the invoice.
   */
  voidReason?: string;
}

/**
 * Input payload accepted when issuing a new invoice.
 */
export interface InvoiceDraft {
  bookingId: string;
  currency: string;
  lines: Array<
    Pick<InvoiceLine, "description" | "quantity" | "unitPrice" | "metadata">
  >;
  dueAt?: string | Date;
  metadata?: Record<string, unknown>;
}

/**
 * Filtering parameters supported by the invoice listing endpoint.
 */
export interface InvoiceListFilter {
  bookingId?: string;
  status?: InvoiceStatus;
}

/**
 * Payload accepted when registering a payment against an invoice.
 */
export interface PaymentInput {
  amount: number;
  paidAt?: string | Date;
  reference?: string;
  note?: string;
}

/**
 * Domain-specific error raised by the invoice service so the HTTP adapter
 * can map it to a proper response code.
 */
export class InvoiceError extends Error {
  /** Machine-friendly error code. */
  readonly code: string;
  /** Optional context describing the failure. */
  readonly details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "InvoiceError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Minimal persistence interface to keep the service decoupled from storage.
 */
export interface InvoiceStore {
  save(invoice: Invoice): Promise<void>;
  getById(id: string): Promise<Invoice | undefined>;
  list(): Promise<Invoice[]>;
}

/**
 * In-memory store used for tests, local development and documentation.
 */
class MemoryInvoiceStore implements InvoiceStore {
  private readonly storage = new Map<string, Invoice>();

  constructor(initial: Invoice[] = []) {
    for (const invoice of initial) {
      this.storage.set(invoice.id, cloneInvoice(invoice));
    }
  }

  async save(invoice: Invoice): Promise<void> {
    this.storage.set(invoice.id, cloneInvoice(invoice));
  }

  async getById(id: string): Promise<Invoice | undefined> {
    const invoice = this.storage.get(id);
    return invoice ? cloneInvoice(invoice) : undefined;
  }

  async list(): Promise<Invoice[]> {
    return Array.from(this.storage.values()).map(cloneInvoice);
  }
}

/**
 * Builds an in-memory store optionally pre-populated with invoices.
 */
export function createInMemoryInvoiceStore(initial: Invoice[] = []): InvoiceStore {
  return new MemoryInvoiceStore(initial);
}

/**
 * Public contract of the invoice service.
 */
export interface InvoiceService {
  issueInvoice(input: InvoiceDraft): Promise<Invoice>;
  listInvoices(filter?: InvoiceListFilter): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  recordPayment(id: string, payment: PaymentInput): Promise<Invoice>;
  voidInvoice(id: string, reason?: string): Promise<Invoice>;
}

/**
 * Produces the core invoice service with validation, state transitions and
 * persistence abstraction.
 */
export function createInvoiceService(store: InvoiceStore = createInMemoryInvoiceStore()): InvoiceService {
  /**
   * Persists and returns a defensive copy of the invoice.
   */
  async function persist(invoice: Invoice): Promise<Invoice> {
    await store.save(invoice);
    return cloneInvoice(invoice);
  }

  return {
    async issueInvoice(input: InvoiceDraft): Promise<Invoice> {
      if (!input || typeof input !== "object") {
        throw new InvoiceError("validation_error", "invoice payload must be an object");
      }

      if (!input.bookingId || typeof input.bookingId !== "string") {
        throw new InvoiceError("validation_error", "bookingId is required", {
          field: "bookingId",
        });
      }

      const currency = String(input.currency || "").trim().toUpperCase();
      if (currency.length !== 3) {
        throw new InvoiceError("validation_error", "currency must be a 3-letter code", {
          field: "currency",
        });
      }

      const lines: InvoiceLine[] = [];
      if (!Array.isArray(input.lines) || input.lines.length === 0) {
        throw new InvoiceError("validation_error", "invoice must contain at least one line", {
          field: "lines",
        });
      }

      for (let i = 0; i < input.lines.length; i += 1) {
        lines.push(normalizeLine(input.lines[i]!, i));
      }

      const amount = Number(lines.reduce((sum, line) => sum + line.total, 0));
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new InvoiceError("validation_error", "invoice amount must be greater than zero");
      }

      const issuedAt = new Date().toISOString();
      const dueAt = input.dueAt ? ensureIsoDate(input.dueAt, "dueAt") : undefined;

      const invoice: Invoice = {
        id: randomUUID(),
        bookingId: input.bookingId,
        currency,
        amount,
        balanceDue: amount,
        status: "issued",
        issuedAt,
        dueAt,
        lines,
        payments: [],
        metadata: input.metadata ?? {},
      };

      return persist(invoice);
    },

    async listInvoices(filter: InvoiceListFilter = {}): Promise<Invoice[]> {
      const all = await store.list();
      return all
        .filter((invoice) => {
          if (filter.bookingId && invoice.bookingId !== filter.bookingId) {
            return false;
          }
          if (filter.status && invoice.status !== filter.status) {
            return false;
          }
          return true;
        })
        .map(cloneInvoice);
    },

    async getInvoice(id: string): Promise<Invoice | undefined> {
      if (!id) return undefined;
      const invoice = await store.getById(id);
      return invoice ? cloneInvoice(invoice) : undefined;
    },

    async recordPayment(id: string, payment: PaymentInput): Promise<Invoice> {
      const invoice = await store.getById(id);
      if (!invoice) {
        throw new InvoiceError("invoice_not_found", "invoice not found", { id });
      }
      if (invoice.status === "void") {
        throw new InvoiceError("invoice_void", "cannot record payment for a void invoice", { id });
      }
      if (invoice.status === "paid") {
        throw new InvoiceError("invoice_settled", "invoice already settled", { id });
      }

      const amount = Number(payment.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new InvoiceError("validation_error", "payment amount must be a positive number", {
          field: "amount",
        });
      }

      const paidAt = payment.paidAt ? ensureIsoDate(payment.paidAt, "paidAt") : new Date().toISOString();
      const record: PaymentRecord = {
        id: randomUUID(),
        amount,
        paidAt,
        reference: payment.reference,
        note: payment.note,
      };

      const payments = invoice.payments.concat(record);
      const captured = payments.reduce((sum, item) => sum + item.amount, 0);
      if (captured - invoice.amount > 0.01) {
        throw new InvoiceError("overpayment", "captured amount exceeds invoice total", {
          invoiceAmount: invoice.amount,
          captured,
        });
      }

      const balanceDue = Math.max(0, Number((invoice.amount - captured).toFixed(2)));
      let status: InvoiceStatus = balanceDue === 0 ? "paid" : "partially_paid";

      const updated: Invoice = {
        ...invoice,
        payments,
        balanceDue,
        status,
        paidAt: status === "paid" ? paidAt : invoice.paidAt,
      };

      return persist(updated);
    },

    async voidInvoice(id: string, reason?: string): Promise<Invoice> {
      const invoice = await store.getById(id);
      if (!invoice) {
        throw new InvoiceError("invoice_not_found", "invoice not found", { id });
      }
      if (invoice.status === "paid") {
        throw new InvoiceError("invoice_settled", "paid invoice cannot be voided", { id });
      }
      if (invoice.status === "void") {
        return cloneInvoice(invoice);
      }

      const voidedAt = new Date().toISOString();
      const updated: Invoice = {
        ...invoice,
        status: "void",
        voidedAt,
        voidReason: reason,
        balanceDue: invoice.balanceDue,
      };

      return persist(updated);
    },
  };
}

/**
 * HTTP handler that exposes the invoice service through a minimal REST API.
 */
export function createInvoicesHttpHandler(service: InvoiceService) {
  return function handler(req: IncomingMessage, res: ServerResponse) {
    Promise.resolve()
      .then(async () => {
        if (!req.url) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "invalid_url" }));
          return;
        }

        const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
        const normalizedPath = normalizePath(url.pathname);
        const method = req.method ?? "GET";

        if (method === "GET" && normalizedPath === "/invoices") {
          const statusParam = url.searchParams.get("status") ?? undefined;
          const bookingId = url.searchParams.get("bookingId") ?? undefined;
          const status = isInvoiceStatus(statusParam) ? statusParam : undefined;
          const invoices = await service.listInvoices({ bookingId: bookingId ?? undefined, status });
          respondJson(res, 200, { ok: true, invoices });
          return;
        }

        if (method === "POST" && normalizedPath === "/invoices") {
          const body = await readJson(req);
          const invoice = await service.issueInvoice(body as InvoiceDraft);
          respondJson(res, 201, { ok: true, invoice });
          return;
        }

        const parts = normalizedPath.split("/").filter(Boolean);
        if (parts[0] !== "invoices" || !parts[1]) {
          respondJson(res, 404, { ok: false, error: "not_found" });
          return;
        }

        const invoiceId = parts[1];

        if (method === "GET" && parts.length === 2) {
          const invoice = await service.getInvoice(invoiceId);
          if (!invoice) {
            respondJson(res, 404, { ok: false, error: "invoice_not_found" });
            return;
          }
          respondJson(res, 200, { ok: true, invoice });
          return;
        }

        if (method === "POST" && parts.length === 3 && parts[2] === "pay") {
          const payload = await readJson(req);
          const invoice = await service.recordPayment(invoiceId, payload as PaymentInput);
          respondJson(res, 200, { ok: true, invoice });
          return;
        }

        if (method === "POST" && parts.length === 3 && parts[2] === "void") {
          const payload = await readJson(req);
          const invoice = await service.voidInvoice(invoiceId, typeof payload?.reason === "string" ? payload.reason : undefined);
          respondJson(res, 200, { ok: true, invoice });
          return;
        }

        respondJson(res, 405, { ok: false, error: "method_not_allowed" });
      })
      .catch((error) => {
        if (error instanceof InvoiceError) {
          const status = errorStatus(error.code);
          respondJson(res, status, {
            ok: false,
            error: error.code,
            message: error.message,
            details: error.details,
          });
          return;
        }

        console.error("invoice_http_error", error);
        respondJson(res, 500, { ok: false, error: "internal_error" });
      });
  };
}

/**
 * Normalizes a request path by removing trailing slashes.
 */
function normalizePath(pathname: string) {
  if (pathname === "/") return "/";
  const stripped = pathname.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

/**
 * Serializes a JSON response with the provided status code.
 */
function respondJson(res: ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

/**
 * Reads a JSON body from the request stream with a 1 MiB safeguard.
 */
async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of req) {
    const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
    bytes += buffer.length;
    if (bytes > 1_048_576) {
      throw new InvoiceError("payload_too_large", "request body exceeds 1 MiB");
    }
    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new InvoiceError("invalid_json", "request body is not valid JSON", {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Ensures the provided value can be converted to an ISO timestamp.
 */
function ensureIsoDate(value: string | Date, field: string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new InvoiceError("validation_error", `${field} must be a valid date`, { field });
  }
  return date.toISOString();
}

/**
 * Converts a draft line into a normalized invoice line with calculated total.
 */
function normalizeLine(
  draft: Pick<InvoiceLine, "description" | "quantity" | "unitPrice" | "metadata">,
  index: number,
): InvoiceLine {
  const description = String(draft.description ?? "").trim();
  if (!description) {
    throw new InvoiceError("validation_error", "line description is required", {
      field: `lines[${index}]`,
    });
  }

  const quantityRaw = draft.quantity ?? 1;
  const quantity = Number(quantityRaw);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new InvoiceError("validation_error", "line quantity must be a positive number", {
      field: `lines[${index}].quantity`,
    });
  }

  const unitPrice = Number(draft.unitPrice ?? 0);
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    throw new InvoiceError("validation_error", "line unit price must be a positive number", {
      field: `lines[${index}].unitPrice`,
    });
  }

  const total = Number((quantity * unitPrice).toFixed(2));

  return {
    description,
    quantity,
    unitPrice,
    total,
    metadata: draft.metadata ?? undefined,
  };
}

/**
 * Clones an invoice to avoid leaking internal references.
 */
function cloneInvoice(invoice: Invoice): Invoice {
  return JSON.parse(JSON.stringify(invoice)) as Invoice;
}

/**
 * Maps domain error codes to HTTP status codes.
 */
function errorStatus(code: string): number {
  switch (code) {
    case "validation_error":
    case "invalid_json":
      return 400;
    case "invoice_not_found":
      return 404;
    case "invoice_settled":
    case "invoice_void":
    case "overpayment":
      return 409;
    case "payload_too_large":
      return 413;
    default:
      return 500;
  }
}

/**
 * Type guard that checks whether a string corresponds to a valid status.
 */
function isInvoiceStatus(value: string | null | undefined): value is InvoiceStatus {
  return value === "draft" || value === "issued" || value === "partially_paid" || value === "paid" || value === "void";
}
