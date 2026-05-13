import { ORG_ID, SITE_URL, locationId } from "@/lib/seo/identity";
import type { Location, WeatherSnapshot } from "@/lib/types";

interface Props {
  location: Location;
  weather: WeatherSnapshot;
}

// Marks the live weather observation as a schema.org Dataset.
// This is rare in the wild — most weather sites don't bother. Signals to
// Google that you publish original measurement data, which is a trust
// signal that compounds with E-E-A-T ranking factors over time.
//
// We use Observation inside the Dataset so the temporalCoverage and the
// measured properties are linked to the specific moment of measurement.
export function ObservationJsonLd({ location, weather }: Props) {
  const datasetUrl = `${SITE_URL}/location/${location.id}#observation`;
  const observationTime = new Date(weather.observationTime).toISOString();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": datasetUrl,
    name: `Live outdoor conditions — ${location.name}`,
    description: `Real-time temperature, wind, humidity, UV, air quality (AQHI), and pressure observations for ${location.name}, Prince Edward Island.`,
    url: `${SITE_URL}/location/${location.id}`,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "weather observation",
      "PEI weather",
      location.name,
      "AQHI",
      "real-time conditions",
      "outdoor recreation",
    ],
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    spatialCoverage: {
      "@type": "Place",
      "@id": locationId(location.id),
      name: location.name,
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.lat,
        longitude: location.lng,
      },
    },
    temporalCoverage: observationTime,
    dateModified: observationTime,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/html",
      contentUrl: `${SITE_URL}/location/${location.id}`,
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        propertyID: "temperature",
        name: "Air temperature",
        unitCode: "CEL",
        unitText: "°C",
        value: weather.temperature,
      },
      {
        "@type": "PropertyValue",
        propertyID: "feels_like",
        name: "Apparent temperature",
        unitCode: "CEL",
        unitText: "°C",
        value: weather.feelsLike,
      },
      {
        "@type": "PropertyValue",
        propertyID: "wind_speed",
        name: "Wind speed",
        unitCode: "KMH",
        unitText: "km/h",
        value: weather.windSpeed,
      },
      {
        "@type": "PropertyValue",
        propertyID: "wind_direction",
        name: "Wind direction",
        value: weather.windDirection,
      },
      {
        "@type": "PropertyValue",
        propertyID: "humidity",
        name: "Relative humidity",
        unitCode: "P1",
        unitText: "%",
        value: weather.humidity,
      },
      {
        "@type": "PropertyValue",
        propertyID: "uv_index",
        name: "UV index",
        value: weather.uvIndex,
      },
      {
        "@type": "PropertyValue",
        propertyID: "aqhi",
        name: "Air Quality Health Index",
        value: weather.aqhi,
        description: "Environment Canada AQHI scale 1–10+ (1 = best)",
      },
      {
        "@type": "PropertyValue",
        propertyID: "pressure",
        name: "Atmospheric pressure",
        unitCode: "HPA",
        unitText: "hPa",
        value: weather.pressure,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
