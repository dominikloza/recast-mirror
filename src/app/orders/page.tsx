import { formatPrice } from "@/lib/products";
import { getOrders } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/orders");

  const orders = await getOrders();

  return (
    <main className="flex-1 px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-paper-muted">
            Account
          </span>
          <h1 className="display text-4xl">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-muted">No orders yet.</p>
            <Link
              href="/shop"
              className="w-fit rounded-[3px] bg-lime px-6 py-3 text-xs font-bold uppercase tracking-wide text-lime-ink"
            >
              Browse the range
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-paper-line">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 py-5"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-paper-muted">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {order.item_count}{" "}
                      {order.item_count === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-lime-ink">
                      {order.status}
                    </span>
                    <span className="text-sm font-bold">
                      {formatPrice(order.total_cents)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
