"use client";

import { useState } from "react";

interface Props {
  source?: string;
}

export function SubscribeStrip({ source = "unknown" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });

    setStatus(res.ok ? "done" : "error");
  }

  return (
    <section className="rounded-[1.75rem] border border-[#D4E8CC] bg-[#F2F8EE] p-6 space-y-4">
      <div className="space-y-1">
        <p className="font-serif text-lg font-bold text-[#1A1A1A]">
          Know before you go
        </p>
        <p className="text-sm text-[#4A4A4A] leading-relaxed">
          Weekly PEI conditions intel — we&apos;ll tell you when it&apos;s worth heading out.
        </p>
      </div>

      {status === "done" ? (
        <p className="text-sm font-semibold text-[#3A8C2F]">
          → You&apos;re in. First update coming soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-[#C8DEC0] bg-white px-4 py-2.5 text-sm text-[#2A2A2A] placeholder:text-[#9BA696] focus:outline-none focus:ring-2 focus:ring-[#3A8C2F]/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full shrink-0 rounded-xl bg-[#2D6E24] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1F5018] disabled:opacity-60 sm:w-auto"
          >
            {status === "loading" ? "..." : "Notify me →"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-xs text-[#C0392B]">Something went wrong — try again.</p>
      )}

      <p className="text-[11px] text-[#9BA696]">No spam. Unsubscribe any time.</p>
    </section>
  );
}
