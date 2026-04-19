import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="panel max-w-3xl p-8">
        <p className="eyebrow mb-3">Lost in the fog</p>
        <h1 className="section-title">That island outlook does not exist.</h1>
        <p className="section-copy mt-4">
          The location may have moved or the route is not wired up yet. Head back to the main map to
          pick another PEI stop.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-forest-deep px-5 py-3 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
