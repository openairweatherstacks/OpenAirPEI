interface Props {
  name: string
  description: string
  url: string
  lat: number
  lng: number
  imageUrl?: string
}

export function LocationJsonLd({ name, description, url, lat, lng, imageUrl }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    description,
    url,
    geo: {
      "@type": "GeoCoordinates",
      latitude: lat,
      longitude: lng,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
    address: {
      "@type": "PostalAddress",
      addressRegion: "PE",
      addressCountry: "CA",
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Prince Edward Island",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
