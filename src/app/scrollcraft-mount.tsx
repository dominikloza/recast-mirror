"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Element) => void };
  }
}

export function ScrollcraftMount() {
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".folio a[data-folio]"),
    );
    const titleEl = document.querySelector("[data-folio-title]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const sections = links.map((a) =>
      document.querySelector(a.getAttribute("href")!),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = sections.indexOf(entry.target);
          if (idx === -1) continue;
          links.forEach((l) => l.classList.remove("is-current"));
          links[idx].classList.add("is-current");
          if (titleEl) titleEl.innerHTML = links[idx].dataset.title ?? "";
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <Script
      src="/scrollcraft.js"
      strategy="afterInteractive"
      onReady={() => window.ScrollCraft?.mount(document.body)}
    />
  );
}
