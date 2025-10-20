export type CountryCode = "UZ" | "KZ" | "KG" | "AZ";

/**
 * Country-specific phone number masks using spaces to denote grouping.
 */
export const phoneMasks: Record<CountryCode, string> = {
  UZ: "+998 ## ### ## ##",
  KZ: "+7 ### ### ## ##",
  KG: "+996 ### ### ###",
  AZ: "+994 ## ### ## ##",
};

export interface AddressFormat {
  order: Array<"postalCode" | "region" | "city" | "street" | "building">;
  separator: string;
}

/**
 * Minimal address format hints used when rendering input forms for CIS markets.
 */
export const addressFormats: Record<CountryCode, AddressFormat> = {
  UZ: { order: ["region", "city", "street", "building"], separator: ", " },
  KZ: { order: ["region", "city", "street", "building"], separator: ", " },
  KG: { order: ["region", "city", "street", "building"], separator: ", " },
  AZ: { order: ["city", "street", "building"], separator: ", " },
};

/**
 * Helper returning the preferred address format, falling back to Uzbekistan
 * defaults when the country is unknown.
 */
export function getAddressFormat(code: CountryCode | string): AddressFormat {
  return addressFormats[(code as CountryCode) ?? "UZ"] ?? addressFormats.UZ;
}
