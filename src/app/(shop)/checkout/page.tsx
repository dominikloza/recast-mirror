import { placeOrder } from "@/app/actions/checkout";
import { getCartItems } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PlaceOrderButton } from "./place-order-button";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/checkout");

  const items = await getCartItems();
  if (items.length === 0) redirect("/cart");

  const total = items.reduce(
    (sum, item) => sum + item.product.price_cents * item.quantity,
    0,
  );

  return (
    <main className="flex-1 px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-paper-muted">
              Secure Checkout
            </span>
            <h1 className="display text-3xl">Payment</h1>
          </div>

          {/* No payment processor behind this — a mocked, read-only
              method display, not a form collecting real card details. */}
          <div className="flex items-center justify-between rounded-[3px] border border-ink-line px-5 py-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase">
                Visa •••• 4242
              </span>
              <span className="text-xs text-paper-muted">Expires 12/29</span>
            </div>
            <span className="rounded-full border border-paper-line px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper-muted">
              Demo card
            </span>
          </div>

          <p className="text-xs leading-relaxed text-paper-muted">
            This is a portfolio build — checkout is mocked and no real
            payment is charged. Placing an order writes it to your account
            as paid.
          </p>

          <form action={placeOrder}>
            <PlaceOrderButton label={`Place Order — ${formatPrice(total)}`} />
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-paper-muted">
            Order Summary
          </span>
          <ul className="flex flex-col divide-y divide-paper-line">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <span className="text-sm">
                  {item.product.name}{" "}
                  <span className="text-paper-muted">× {item.quantity}</span>
                </span>
                <span className="text-sm font-bold">
                  {formatPrice(item.product.price_cents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-ink pt-4">
            <span className="text-sm font-bold uppercase">Total</span>
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
