import { ORG_ID, SITE_URL, locationId } from "@/lib/seo/identity";
import type { Location } from "@/lib/types";

interface Props {
  location: Location;
  imageUrl?: string;
}

const TYPE_TO_SCHEMA: Record<Location["type"], string> = {
  beach: "Beach",
  city: "City",
  community: "Place",
  park: "Park",
  trail: "TouristAttraction",
  bridge: "Bridge",
  landmark: "LandmarksOrHistoricalBuildings",
  airport: "Airport",
  golf: "GolfCourse",
  campground: "Campground",
};

// Maps a Location's amenities into schema.org LocationFeatureSpecification
// items. Google's local rich results read these to surface "accessibility",
// "pet friendly", and "parking" badges in the SERP.
function amenityFeatures(location: Location) {
  const features: Array<Record<string, unknown>> = [];
  const a = location.amenities;
  if (!a) return features;

  features.push({
    "@type": "LocationFeatureSpecification",
    name: "Parking",
    value: a.parking !== "none",
    ...(a.parkingNote ? { description: a.parkingNote } : {}),
  });

  features.push({
    "@type": "LocationFeatureSpecification",
    name: "Pet friendly",
    value: a.petFriendly,
    ...(a.petNote ? { description: a.petNote } : {}),
  });

  features.push({
    "@type": "LocationFeatureSpecification",
    name: "Wheelchair accessible",
    value: a.wheelchairAccessible,
    ...(a.wheelchairNote ? { description: a.wheelchairNote } : {}),
  });

  features.push({
    "@type": "LocationFeatureSpecification",
    name: "Washrooms",
    value: a.washrooms,
    ...(a.washroomNote ? { description: a.washroomNote } : {}),
  });

  return features;
}

export function LocationJsonLd({ location, imageUrl }: Props) {
  const schemaType = TYPE_TO_SCHEMA[location.type] ?? "TouristAttraction";
  const url = `${SITE_URL}/location/${location.id}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": locationId(location.id),
    name: location.name,
    description: location.tagline,
    url,
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.lat,
      longitude: location.lng,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "PE",
      addressCountry: "CA",
      addressLocality:
        location.id === "charlottetown" || location.id.includes("charlottetown")
          ? "Charlottetown"
          : location.id === "summerside"
            ? "Summerside"
            : undefined,
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Prince Edward Island",
      address: {
        "@type": "PostalAddress",
        addressRegion: "PE",
        addressCountry: "CA",
      },
    },
    publicAccess: true,
    isAccessibleForFree: true,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(location.amenities
      ? { amenityFeature: amenityFeatures(location) }
      : {}),
    ...(location.amenities?.wheelchairAccessible !== undefined
      ? { accessibilityFeature: location.amenities.wheelchairAccessible ? ["wheelchairAccessible"] : [] }
      : {}),
    publisher: { "@id": ORG_ID },
    inLanguage: "en-CA",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
