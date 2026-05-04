// Overpass API queries for OSM cycling infrastructure
// Can be used later to enrich route geometries with actual GPS data

const OVERPASS_API = "https://overpass-api.de/api/interpreter";

// PEI bounding box
const PEI_BBOX = "46.0,-64.1,47.15,-61.9";

export async function fetchConfederationTrailOSM() {
  const query = `
    [bbox:${PEI_BBOX}];
    (
      way["name"~"Confederation"];
      relation["name"~"Confederation"];
    );
    out geom;
  `;

  try {
    const response = await fetch(OVERPASS_API, {
      method: "POST",
      body: query,
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
