import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PIXEL_ID = "1123916308591546";
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;
const CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}

// Maps our internal event names to Meta standard events
const META_EVENT_MAP: Record<string, string> = {
  view_content: "ViewContent",
  conditions_checked: "ViewContent",
  pwa_installed: "Lead",
  alert_subscribed: "Lead",
  page_view: "PageView",
};

export async function POST(req: NextRequest) {
  if (!CAPI_TOKEN) {
    return NextResponse.json({ error: "CAPI not configured" }, { status: 503 });
  }

  const body = await req.json() as {
    eventName: string;
    customData?: Record<string, string | number | boolean>;
    email?: string;
  };

  const { eventName, customData, email } = body;
  const metaEventName = META_EVENT_MAP[eventName] ?? "CustomEvent";

  const userData: Record<string, string> = {
    client_ip_address: getClientIp(req),
    client_user_agent: req.headers.get("user-agent") ?? "",
  };

  if (email) {
    userData.em = hashValue(email);
  }

  const payload = {
    data: [
      {
        event_name: metaEventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: req.headers.get("referer") ?? "https://openairatlantic.com",
        user_data: userData,
        custom_data: {
          ...customData,
          // Tag custom events that don't have a standard Meta name
          ...(metaEventName === "CustomEvent" ? { custom_event_type: eventName } : {}),
        },
      },
    ],
  };

  const res = await fetch(`${CAPI_URL}?access_token=${CAPI_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json() as unknown;
  return NextResponse.json(result, { status: res.ok ? 200 : 502 });
}
