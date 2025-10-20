type VenueSchemaInput = {
  name: string;
  city: string;
  capacity: number;
  url: string;
};

export function venueSchema({ name, city, capacity, url }: VenueSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name,
    address: city,
    maximumAttendeeCapacity: capacity,
    url,
  } as const;
}
