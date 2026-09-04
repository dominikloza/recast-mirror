"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ user_id: user.id, product_id: productId, quantity: 1 });
  }

  // "layout" also busts (shop)/layout.tsx, which is where the header's
  // cart-count badge is fetched — without it the badge only catches up
  // on the next full navigation, not this one.
  revalidatePath("/cart", "layout");
}

export async function setCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient();
  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
  } else {
    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId);
  }
  revalidatePath("/cart", "layout");
}
