import { createClient } from "@/lib/supabase/server";

export { formatPrice } from "@/lib/format";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  image_url: string | null;
};

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price_cents, category, image_url")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price_cents, category, image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// IDM-VTON only knows how to place a garment on a torso or legs — cap,
// bag, socks and sunglasses aren't garments in that sense, so those
// categories get no fitting-room UI at all rather than a nonsense result.
const VTON_CATEGORY: Record<string, "upper_body" | "lower_body"> = {
  Hoodie: "upper_body",
  Jacket: "upper_body",
  Tee: "upper_body",
  Pants: "lower_body",
};

export function getVtonCategory(category: string): "upper_body" | "lower_body" | null {
  return VTON_CATEGORY[category] ?? null;
}
