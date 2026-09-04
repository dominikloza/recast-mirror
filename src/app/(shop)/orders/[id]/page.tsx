import { formatPrice } from "@/lib/products";
import { getOrderById } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/orders/${id}`);

  // RLS already scopes this to the caller's own orders — a stranger's
  // order id simply returns nothing here, same as a typo'd id.
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <main className="flex-1 px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-ink">
            Order Confirmed
          </span>
          <h1 className="display text-4xl">Thank you</h1>
          <p className="text-sm text-ink-muted">
            Order #{order.id.slice(0, 8)} ·{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <ul className="flex flex-col divide-y divide-paper-line">
          {order.order_items.map((item) => (
            <li
              key={item.id}
              className="flex items-baseline justify-between gap-4 py-4"
            >
              <span className="text-sm">
                {item.product_name}{" "}
                <span className="text-paper-muted">× {item.quantity}</span>
              </span>
              <span className="text-sm font-bold">
                {formatPrice(item.unit_price_cents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-ink py-4">
          <span className="text-sm font-bold uppercase">Total</span>
          <span className="text-lg font-bold">
            {formatPrice(order.total_cents)}
          </span>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            href="/shop"
            className="rounded-[3px] bg-lime px-6 py-3 text-xs font-bold uppercase tracking-wide text-lime-ink"
          >
            Keep shopping
          </Link>
          <Link
            href="/orders"
            className="rounded-[3px] border border-ink-line px-6 py-3 text-xs font-bold uppercase tracking-wide"
          >
            My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
