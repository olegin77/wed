export const canReview = (enquiry: { status: string }) =>
  ["WON", "CONTRACT_SIGNED"].includes(enquiry.status);
