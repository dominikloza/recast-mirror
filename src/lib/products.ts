import { createClient } from "@/lib/supabase/server";

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

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
