import Link from "next/link";

const LINKS = [
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Data Sources", href: "/data-sources" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/60 pb-28 pt-8 backdrop-blur md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg text-text-primary">OpenAir Atlantic</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Real-time nature insights for Atlantic Canada
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-text-secondary transition hover:text-forest"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} OpenAir Atlantic. Environmental data from Environment and
            Climate Change Canada, Fisheries & Oceans Canada, and CIOOS Atlantic — all open
            government sources.{" "}
            <Link href="/data-sources" className="underline hover:text-forest">
              Full source list →
            </Link>
          </p>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs leading-5 text-text-muted">
            OpenAir Atlantic operates on the ancestral and unceded territory of the Mi&apos;kmaq
            people — Epekwitk (Prince Edward Island), Siknikt, Eskikewa&apos;kik, and the broader
            Mi&apos;kma&apos;ki homeland. We acknowledge the Mi&apos;kmaq as the original stewards
            of this land and water, and we are grateful to share it.
          </p>
        </div>
      </div>
    </footer>
  );
}
