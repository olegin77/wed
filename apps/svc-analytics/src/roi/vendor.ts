export interface VendorRoiInput {
  views: number;
  enquiries: number;
  won: number;
}

export interface VendorRoi extends VendorRoiInput {
  /** Conversion from enquiries to won deals in % */
  enquiryToWonRatio: number;
  /** Conversion from views to enquiries in % */
  viewToEnquiryRatio: number;
}

function toPercent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export function calculateVendorRoi(input: VendorRoiInput): VendorRoi {
  const { views, enquiries, won } = input;
  return {
    views,
    enquiries,
    won,
    enquiryToWonRatio: toPercent(won, enquiries),
    viewToEnquiryRatio: toPercent(enquiries, views),
  };
}
