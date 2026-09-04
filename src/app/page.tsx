import "./scrollcraft.css";
import "./mirror-page.css";
import { MirrorPeak } from "./mirror-peak";
import { RangeItemCartButton } from "./range-item-cart-button";
import { ScrollcraftMount } from "./scrollcraft-mount";
import { formatPrice, getProductBySlug, getProducts } from "@/lib/products";
import { getCartCount } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

// Presentation-only copy for the Range grid — the DB holds the long-form
// product description shown on /product/[slug]; this page's cards want
// the shorter colorway/material line the scrollcraft build shipped with.
const RANGE_ORDER = [
  "echo-hoodie",
  "shift-track-jacket",
  "half-time-cap",
  "loop-tee",
  "drift-cargo-pant",
  "squint-sunglasses",
  "carry-tote",
  "trail-socks",
];
const RANGE_BLURB: Record<string, string> = {
  "echo-hoodie": "Bone. 320gsm fleece.",
  "shift-track-jacket": "Moss. Water-resistant shell.",
  "half-time-cap": "Rust.",
  "loop-tee": "Chalk.",
  "drift-cargo-pant": "Slate. Wide leg.",
  "squint-sunglasses": "Ink.",
  "carry-tote": "Coated canvas.",
  "trail-socks": "Two-pack.",
};

export default async function Home() {
  const supabase = await createClient();
  const [{ data: { user } }, mirrorProduct, allProducts, cartCount] = await Promise.all([
    supabase.auth.getUser(),
    getProductBySlug("echo-hoodie"),
    getProducts(),
    getCartCount(),
  ]);

  const rangeProducts = RANGE_ORDER.map((slug) =>
    allProducts.find((p) => p.slug === slug),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <span data-sc-progress></span>
      <div className="sc-grain" aria-hidden="true"></div>

      <nav className="folio" aria-label="Chapters">
        <span className="folio__title" data-folio-title>01 &middot; The Guess</span>
        <div className="folio__nums">
          <a href="#ch-01" data-folio data-title="01 &middot; The Guess" aria-label="Chapter 1, The Guess">01</a>
          <a href="#ch-02" data-folio data-title="02 &middot; The Turn" aria-label="Chapter 2, The Turn">02</a>
          <a href="#ch-03" data-folio data-title="03 &middot; Substance" aria-label="Chapter 3, Substance">03</a>
          <a href="#ch-04" data-folio data-title="04 &middot; Range" aria-label="Chapter 4, Range">04</a>
          <a href="#ch-05" data-folio data-title="05 &middot; Commitment" aria-label="Chapter 5, Commitment">05</a>
        </div>
      </nav>

      <nav
        aria-label="Shop"
        style={{
          position: "fixed",
          top: "var(--sc-4)",
          right: "var(--sc-4)",
          zIndex: "var(--sc-z-chrome)",
          display: "flex",
          alignItems: "center",
          gap: "var(--sc-3)",
          background: "color-mix(in oklab, var(--sc-canvas) 78%, transparent)",
          backdropFilter: "blur(8px)",
          padding: "10px 14px",
          borderRadius: "var(--sc-r-pill)",
          fontFamily: "var(--sc-font-text)",
          fontSize: "var(--sc-t-xs)",
          letterSpacing: "var(--sc-track-wide)",
          textTransform: "uppercase",
        }}
      >
        <Link href="/shop" style={{ color: "var(--sc-ink-soft)" }}>Shop</Link>
        <Link href="/cart" style={{ color: "var(--sc-ink-soft)", position: "relative" }}>
          Cart
          {cartCount > 0 && (
            <span
              style={{
                marginLeft: 6,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 16,
                height: 16,
                borderRadius: 999,
                background: "var(--sc-accent)",
                color: "var(--sc-accent-ink)",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </nav>

      <main id="top">
        <section className="prologue">
          <video className="prologue__bg" src="/00-hero.mp4" poster="/00-hero-poster.webp" autoPlay loop muted playsInline aria-hidden="true"></video>
          <div className="prologue__scrim" aria-hidden="true"></div>
          <div className="prologue__fade" aria-hidden="true"></div>
          <div className="prologue__inner sc-stack" data-sc-in>
            <span className="chapter__label">Recast</span>
            <h1 className="sc-display" data-sc-kinetic="lines">You&apos;ve never seen it on you.</h1>
            <p>Every fit, guessed. Until now.</p>
          </div>
        </section>

        <section className="chapter sc-section" id="ch-01" data-sc-act="flow">
          <div className="sc-wrap spread">
            <div className="spread__text sc-stack" data-sc-in data-sc-stagger="60">
              <span className="chapter__label">01 &middot; The Guess</span>
              <h2 className="sc-display">The cost of buying blind.</h2>
              <div className="lines">
                <p>Ordered online.</p>
                <p>Wrong size.</p>
                <p>Sent it back.</p>
                <p>Ordered again.</p>
                <p>Nobody buys clothes blind. They just pretend to.</p>
              </div>
            </div>
            <figure className="spread__media framed" data-sc-reveal="left" data-sc-reveal-at="0.1 0.55">
              <img src="/01-tension.webp" width={1920} height={1066} alt="A steel rail of hooded sweatshirts and jackets hanging in a dim room at night." />
              <figcaption>A rack, after hours. Nobody&apos;s sure yet.</figcaption>
            </figure>
          </div>
        </section>

        <section id="ch-02" data-sc-act="pin" data-sc-span="3.6">
          <div data-sc-stage className="mirror-stage">
            <div className="mirror-stage__head sc-stack" data-sc-cue="0 0.5 0">
              <span className="chapter__label">02 &middot; The Turn</span>
              <h2 className="sc-display">A mirror that knows what you own.</h2>
              <p>Upload one photo. Watch it happen, right here.</p>
            </div>

            {mirrorProduct && (
              <MirrorPeak
                slug={mirrorProduct.slug}
                name={mirrorProduct.name}
                priceCents={mirrorProduct.price_cents}
                colorway="Bone"
                imageUrl={mirrorProduct.image_url ?? ""}
              />
            )}

            <p className="mirror-note">
              Your photo is sent to our AI preview model for this one match,
              then forgotten &mdash; nothing is stored.
            </p>
          </div>
        </section>

        <section className="chapter chapter--surface sc-section" id="ch-03" data-sc-act="flow">
          <div className="sc-wrap spread spread--reverse">
            <div className="spread__text sc-stack" data-sc-in data-sc-stagger="60">
              <span className="chapter__label">03 &middot; Substance</span>
              <h2 className="sc-display">Real fabric. Real fit math.</h2>
              <div className="lines">
                <p>320gsm cotton fleece.</p>
                <p>Mapped to your frame in seconds.</p>
                <p>Nothing stored beyond that one match.</p>
              </div>
            </div>
            <figure className="spread__media framed" data-sc-reveal="up" data-sc-reveal-at="0.1 0.55">
              <img src="/03-fabric.webp" width={1200} height={1590} alt="Extreme macro of heavyweight cotton fleece with one lime-green stitched seam." />
              <figcaption>Weave, magnified.</figcaption>
            </figure>
          </div>
        </section>

        <section className="chapter sc-section" id="ch-04" data-sc-act="flow" data-sc-drift="#17140F">
          <div className="sc-wrap">
            <div className="range-head sc-stack" data-sc-in>
              <span className="chapter__label">04 &middot; Range</span>
              <h2 className="sc-display">The set.</h2>
              <p>Eight pieces, ready to try.</p>
            </div>
            <div className="range-grid" data-sc-in data-sc-stagger="60">
              {rangeProducts.map((product) => (
                <article className="range-item" key={product.id}>
                  <div className="range-item__frame" data-sc-tilt="6">
                    {product.image_url && <img src={product.image_url} alt={product.name} />}
                  </div>
                  <h3>{product.name}</h3>
                  <p>
                    {RANGE_BLURB[product.slug]} {formatPrice(product.price_cents)}
                  </p>
                  <RangeItemCartButton productId={product.id} isLoggedIn={!!user} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ch-05" data-sc-act="pin" data-sc-span="1.15">
          <div data-sc-stage className="close">
            <video className="close__bg" src="/05-close.mp4" poster="/05-close-poster.webp" autoPlay loop muted playsInline aria-hidden="true"></video>
            <div className="close__scrim" aria-hidden="true"></div>
            <div className="close__fade" aria-hidden="true"></div>
            <div className="close__inner">
              <span className="chapter__label" data-sc-cue="0 1 0 0">05 &middot; Commitment</span>
              <h2 className="sc-display" data-sc-cue="0 1 0 0">Try it before it&apos;s yours.</h2>
              <a className="close__cta" href="#ch-02" data-sc-cue="0 1 0 0">Start your fit &rarr;</a>
              <div className="close__mark" data-sc-cue="0 1 0 0">
                <strong>Recast</strong>
                <span>Drop No. 014 &middot; Fit, not guessed.</span>
              </div>
            </div>
            <span className="close__fine">&copy; 2026 Recast</span>
          </div>
        </section>
      </main>

      <ScrollcraftMount />
    </>
  );
}
