export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceLike {
  id: string;
  total: number;
  items?: ReceiptItem[];
}

export function makeReceipt(invoice: InvoiceLike) {
  return {
    id: invoice.id,
    total: invoice.total,
    items: invoice.items ?? [],
    issuedAt: new Date().toISOString(),
  };
}
