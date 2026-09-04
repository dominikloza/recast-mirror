import { CartItemControls } from "@/components/cart-item-controls";
import { getCartItems } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cart");

  const items = await getCartItems();
  const total = items.reduce(
    (sum, item) => sum + item.product.price_cents * item.quantity,
    0,
  );

  return (
    <main className="flex-1 px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-paper-muted">
            Your Bag
          </span>
          <h1 className="display text-4xl">Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-muted">Your cart is empty.</p>
            <Link
              href="/shop"
              className="w-fit rounded-[3px] bg-lime px-6 py-3 text-xs font-bold uppercase tracking-wide text-lime-ink"
            >
              Browse the range
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col divide-y divide-paper-line">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-5">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[3px] bg-paper-dim">
                    {item.product.image_url && (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-bold uppercase">
                      {item.product.name}
                    </span>
                    <span className="text-xs text-paper-muted">
                      {formatPrice(item.product.price_cents)}
                    </span>
                  </div>
                  <CartItemControls
                    cartItemId={item.id}
                    quantity={item.quantity}
                  />
                  <span className="w-14 text-right text-sm font-bold">
                    {formatPrice(item.product.price_cents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-ink pt-5">
              <span className="text-sm font-bold uppercase">Total</span>
              <span className="text-lg font-bold">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full rounded-[3px] bg-lime px-6 py-4 text-center text-sm font-bold uppercase tracking-wide text-lime-ink"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
