import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/products";

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export async function getCartItems(): Promise<CartItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      "id, quantity, product:products(id, slug, name, description, price_cents, category, image_url)",
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as CartItem[];
}

export async function getCartCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase.from("cart_items").select("quantity");
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + row.quantity, 0);
}
