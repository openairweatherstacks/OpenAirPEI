export const LOCATION_IMAGES: Record<string, string> = {
  cavendish: "/get-images/cavendish.jpg",
  "cavendish-campground": "/get-images/cavendishcamp.jpg",
  charlottetown: "/charlotttetowncity.jpeg",
  "confederation-trail": "/get-images/confederation-trail.jpg",
  "confederation-bridge": "/get-images/confederationbridege.jpg",
  greenwich: "/get-images/dunes.jpg",
  "fox-meadow-golf": "/get-images/fooxmeadow.jpg",
  "belvedere-golf": "/get-images/Belvedere.webp",
  "north-cape": "/get-images/northcape.jpg",
  "basin-head": "/get-images/singing sands.webp",
  "stanhope-campground": "/get-images/stanhope.jpg",
  "pondside-park": "/pondside.jpeg",
  summerside: "/sumersidehero.jpg",
  "victoria-park": "/victoria.png",
};

export function getLocationImage(locationId: string): string | null {
  return LOCATION_IMAGES[locationId] ?? null;
}
