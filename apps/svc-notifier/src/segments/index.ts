export const segments = {
  newCouples: (u: any) => u.createdDays < 14,
  highIntent: (u: any) => u.enquiries > 0 && u.siteViews > 3,
};
