export const signals = {
  manyEnquiriesShortTime(user: { eqLastHour: number }) {
    return user.eqLastHour > 5;
  },
  ipMismatch(user: { regIpCountry?: string; txIpCountry?: string }) {
    if (!user.regIpCountry || !user.txIpCountry) return false;
    return user.regIpCountry !== user.txIpCountry;
  },
};
