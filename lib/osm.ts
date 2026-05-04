import type { GeoJSON } from "geojson";

const OVERPASS_API = "https://overpass-api.de/api/interpreter";
const PEI_BBOX = "46.0,-64.1,47.15,-61.9";

// ── OSM Type Definitions ──────────────────────────────────────────────

interface OverpassNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
}

interface OverpassWayGeom {
  lat: number;
  lon: number;
}

interface OverpassWay {
  type: "way";
  id: number;
  nodes: number[];
  geometry: OverpassWayGeom[];
  tags?: Record<string, string>;
}

interface OverpassRelationMember {
  type: "way" | "node" | "relation";
  ref: number;
  role: string;
  geometry?: OverpassWayGeom[];
}

interface OverpassRelation {
  type: "relation";
  id: number;
  members: OverpassRelationMember[];
  tags?: Record<string, string>;
}

type OverpassElement = OverpassNode | OverpassWay | OverpassRelation;

interface OverpassResult {
  elements: OverpassElement[];
}

// ── Parsing Logic ────────────────────────────────────────────────────

function stitchWaySegments(segments: Array<[number, number][]>): [number, number][] {
  if (segments.length === 0) return [];
  if (segments.length === 1) return segments[0];

  const stitched: [number, number][] = [...segments[0]];
  const remaining = segments.slice(1);

  while (remaining.length > 0) {
    const lastCoord = stitched[stitched.length - 1];
    let bestIdx = -1;
    let bestDistance = Infinity;
    let needsReverse = false;

    for (let i = 0; i < remaining.length; i++) {
      const segment = remaining[i];
      const firstCoord = segment[0];
      const lastSegmentCoord = segment[segment.length - 1];

      // Distance from lastCoord to segment start
      const distStart =
        (lastCoord[0] - firstCoord[0]) ** 2 + (lastCoord[1] - firstCoord[1]) ** 2;

      // Distance from lastCoord to segment end
      const distEnd =
        (lastCoord[0] - lastSegmentCoord[0]) ** 2 +
        (lastCoord[1] - lastSegmentCoord[1]) ** 2;

      if (distStart < bestDistance) {
        bestDistance = distStart;
        bestIdx = i;
        needsReverse = false;
      }
      if (distEnd < bestDistance) {
        bestDistance = distEnd;
        bestIdx = i;
        needsReverse = true;
      }
    }

    if (bestIdx === -1) break;

    const segment = remaining.splice(bestIdx, 1)[0];
    const coordsToAdd = needsReverse ? [...segment].reverse() : segment;
    stitched.push(...coordsToAdd);
  }

  return stitched;
}

export function parseOSMToLineString(result: OverpassResult): GeoJSON.LineString | null {
  const ways = result.elements.filter((e): e is OverpassWay => e.type === "way" && !!e.geometry);
  const relations = result.elements.filter(
    (e): e is OverpassRelation => e.type === "relation" && !!e.members
  );

  // Prefer relation members over standalone ways
  let segments: Array<[number, number][]> = [];

  if (relations.length > 0) {
    // Extract geometries from relation members
    for (const relation of relations) {
      if (relation.members) {
        for (const member of relation.members) {
          if (member.type === "way" && member.geometry) {
            segments.push(member.geometry.map((g) => [g.lon, g.lat]));
          }
        }
      }
    }
  }

  // Fall back to standalone ways if no relation members
  if (segments.length === 0) {
    segments = ways.map((w) => w.geometry.map((g) => [g.lon, g.lat]));
  }

  if (segments.length === 0) return null;

  const coordinates = stitchWaySegments(segments);
  if (coordinates.length < 2) return null;

  return {
    type: "LineString",
    coordinates,
  };
}

// ── Fetch Functions ──────────────────────────────────────────────────

export async function fetchMainTrailGeometry(): Promise<GeoJSON.LineString | null> {
  const query = `[out:json][timeout:25];
relation["type"="route"]["route"="bicycle"]["name"~"Confederation Trail",i];
(._;>;);
out geom;`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);

    const response = await fetch(OVERPASS_API, {
      method: "POST",
      body: query,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const result: OverpassResult = await response.json();
    return parseOSMToLineString(result);
  } catch {
    return null;
  }
}

export async function fetchBranchTrailGeometry(
  routeId: string,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  nameHint: string
): Promise<GeoJSON.LineString | null> {
  const minLat = Math.min(startLat, endLat) - 0.1;
  const maxLat = Math.max(startLat, endLat) + 0.1;
  const minLng = Math.min(startLng, endLng) - 0.1;
  const maxLng = Math.max(startLng, endLng) + 0.1;

  const query = `[out:json][timeout:15][bbox:${minLat},${minLng},${maxLat},${maxLng}];
(
  way["name"~"${nameHint}",i]["highway"];
  way["name"~"Confederation",i];
);
out geom;`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch(OVERPASS_API, {
      method: "POST",
      body: query,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const result: OverpassResult = await response.json();
    return parseOSMToLineString(result);
  } catch {
    return null;
  }
}

// Legacy function for compatibility
export async function fetchConfederationTrailOSM() {
  return fetchMainTrailGeometry();
}
