export interface UtmSession {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

const DEFAULT_UTM: UtmSession = {
  utm_source: "direct",
  utm_medium: "none",
  utm_campaign: "none",
};

export function normalize(query: Record<string, unknown>): UtmSession {
  const source = String(query.utm_source ?? DEFAULT_UTM.utm_source).trim() || DEFAULT_UTM.utm_source;
  const medium = String(query.utm_medium ?? DEFAULT_UTM.utm_medium).trim() || DEFAULT_UTM.utm_medium;
  const campaign = String(query.utm_campaign ?? DEFAULT_UTM.utm_campaign).trim() || DEFAULT_UTM.utm_campaign;
  return {
    utm_source: source.toLowerCase(),
    utm_medium: medium.toLowerCase(),
    utm_campaign: campaign.toLowerCase(),
  };
}
