"use client";

import { Copy, CopyCheck, Facebook, Linkedin, Mail, Share2, Twitter } from "lucide-react";
import { useEffect, useState } from "react";

type SocialShareStripProps = {
  title: string;
  description: string;
  path: string;
};

const SITE_ORIGIN = "https://openairatlantic.com";

export function SocialShareStrip({ title, description, path }: SocialShareStripProps) {
  const [shareUrl, setShareUrl] = useState(`${SITE_ORIGIN}${path}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!copied) return;

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const shareText = `${title} — ${description}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl,
      });
    } catch {
      // Ignore cancelled share sheets so the page stays calm.
    }
  }

  const shareLinks = [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Share on Facebook",
      icon: Facebook,
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      label: "Share on X",
      icon: Twitter,
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "Share on LinkedIn",
      icon: Linkedin,
    },
    {
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${shareUrl}`)}`,
      label: "Share by email",
      icon: Mail,
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg text-text-primary transition hover:border-forest hover:bg-forest-light hover:text-forest"
          aria-label="Open share menu"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {shareLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg text-text-primary transition hover:border-forest hover:bg-forest-light hover:text-forest"
            aria-label={label}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 min-w-[8.5rem] items-center justify-center gap-2 rounded-full border border-border bg-bg px-4 text-sm font-medium text-text-primary transition hover:border-forest hover:bg-forest-light hover:text-forest"
          aria-live="polite"
        >
          {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
