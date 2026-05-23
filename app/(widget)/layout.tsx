import type { ReactNode } from "react";

export default function WidgetLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
          background-image: none !important;
          overflow: hidden;
        }
        /* Hide every site-chrome element that comes from the root layout */
        header, footer, nav,
        [data-widget-hide],
        .bottom-nav,
        .beta-banner,
        .cookie-banner,
        .install-prompt { display: none !important; }
        /* Reset the min-h-screen wrapper added by root layout */
        body > div { min-height: 0 !important; }
        body > div > main { padding: 0 !important; }
      `}</style>
      {children}
    </>
  );
}
