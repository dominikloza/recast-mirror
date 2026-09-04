import { createClient } from "@/lib/supabase/server";

export type OrderSummary = {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  item_count: number;
};

export type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

export type OrderDetail = {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  order_items: OrderItem[];
};

export async function getOrders(): Promise<OrderSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, status, total_cents, created_at, order_items(quantity)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((order) => ({
    id: order.id,
    status: order.status,
    total_cents: order.total_cents,
    created_at: order.created_at,
    item_count: order.order_items.reduce(
      (sum: number, i: { quantity: number }) => sum + i.quantity,
      0,
    ),
  }));
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, total_cents, created_at, order_items(id, product_id, product_name, unit_price_cents, quantity)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
