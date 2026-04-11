import { Sparkles } from "lucide-react";

export function MeteorologistInsight({ text }: { text: string }) {
  return (
    <div className="rounded-[1.9rem] border border-forest/15 bg-gradient-to-br from-forest-light via-white to-sun-light/70 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-forest">
        <Sparkles className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">Insight of the day</p>
      </div>
      <p className="font-serif text-2xl leading-tight text-text-primary">{text}</p>
    </div>
  );
}
