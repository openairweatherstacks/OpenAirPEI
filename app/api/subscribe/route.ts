import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";

export async function POST(req: NextRequest) {
  const { email, source } = await req.json() as { email?: string; source?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !AUDIENCE_ID) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  await resend.contacts.create({
    email,
    audienceId: AUDIENCE_ID,
    unsubscribed: false,
    ...(source ? { firstName: "", lastName: "" } : {}),
  });

  // Fire to Meta CAPI as a Lead event with the email for superior match rate
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/meta-capi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "alert_subscribed", email }),
    });
  } catch {
    // Non-critical
  }

  return NextResponse.json({ ok: true });
}
