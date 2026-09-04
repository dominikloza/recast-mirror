"use server";

import { getCartItems } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// No payment processor behind this on purpose (see BRIEF: mocked
// checkout). Placing an order writes it as already "paid" and clears
// the cart — there's nothing left to fail once you reach this point.
export async function placeOrder() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items = await getCartItems();
  if (items.length === 0) redirect("/cart");

  const total_cents = items.reduce(
    (sum, item) => sum + item.product.price_cents * item.quantity,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total_cents })
    .select("id")
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      unit_price_cents: item.product.price_cents,
      quantity: item.quantity,
    })),
  );

  if (itemsError) throw itemsError;

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  // Bust the shared (shop) layout too, so the header's cart-count badge
  // reflects the now-empty cart on the very next page it renders,
  // instead of only after a separate reload.
  revalidatePath("/", "layout");

  redirect(`/orders/${order.id}`);
}
