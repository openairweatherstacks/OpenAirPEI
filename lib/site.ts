const DEFAULT_SITE_URL = "https://openairpei.ca";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function isLocalUrl(value: string) {
  return /localhost|127\.0\.0\.1/i.test(value);
}

export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const normalized = trimTrailingSlash(candidate.trim());
    if (!normalized || isLocalUrl(normalized)) continue;

    return normalized;
  }

  return DEFAULT_SITE_URL;
}
