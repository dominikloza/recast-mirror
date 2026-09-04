// Seeds the product catalog. Uses the service role key to bypass RLS
// (products has no client-side insert policy on purpose).
// Run with: node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const products = [
  {
    slug: "echo-hoodie",
    name: "Echo Hoodie",
    description:
      "A heavyweight fleece hoodie with a relaxed, boxy cut. Garment-washed for a broken-in feel from day one.",
    price_cents: 6800,
    category: "Hoodie",
    image_url: "/products/echo-hoodie.webp",
  },
  {
    slug: "shift-track-jacket",
    name: "Shift Track Jacket",
    description:
      "A lightweight track jacket in brushed moss twill. Full-zip, ribbed cuffs, cut to layer over anything.",
    price_cents: 9200,
    category: "Jacket",
    image_url: "/products/shift-track-jacket.webp",
  },
  {
    slug: "loop-tee",
    name: "Loop Tee",
    description:
      "A midweight cotton tee with a slightly dropped shoulder. The everyday piece the rest of the range is built around.",
    price_cents: 3400,
    category: "Tee",
    image_url: "/products/loop-tee.webp",
  },
  {
    slug: "drift-cargo-pant",
    name: "Drift Cargo Pant",
    description:
      "A tapered cargo pant in slate ripstop. Six pockets, drawcord hem, built for movement.",
    price_cents: 7800,
    category: "Pants",
    image_url: "/products/drift-cargo-pant.webp",
  },
  {
    slug: "half-time-cap",
    name: "Half-Time Cap",
    description:
      "A structured six-panel cap in washed rust twill. Curved brim, adjustable strap back.",
    price_cents: 2800,
    category: "Cap",
    image_url: "/products/half-time-cap.webp",
  },
  {
    slug: "carry-tote",
    name: "Carry Tote",
    description:
      "A heavy canvas tote in bone with a coral interior lining. One long strap, room for a day's worth of everything.",
    price_cents: 4200,
    category: "Bag",
    image_url: "/products/carry-tote.webp",
  },
  {
    slug: "trail-socks",
    name: "Trail Socks (2pk)",
    description:
      "Cushioned crew socks in a moss and bone twist. Two pairs, arch support built in.",
    price_cents: 1500,
    category: "Socks",
    image_url: "/products/trail-socks.webp",
  },
  {
    slug: "squint-sunglasses",
    name: "Squint Sunglasses",
    description:
      "A coral acetate frame with polarized lenses. Made to be worn, not babied.",
    price_cents: 3200,
    category: "Accessories",
    image_url: "/products/squint-sunglasses.webp",
  },
];

const { data, error } = await supabase
  .from("products")
  .upsert(products, { onConflict: "slug" })
  .select("slug");

if (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}

console.log(`Seeded ${data.length} products:`, data.map((p) => p.slug).join(", "));
