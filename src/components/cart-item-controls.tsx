"use client";

import { setCartQuantity } from "@/app/actions/cart";
import { useTransition } from "react";

export function CartItemControls({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) {
  const [isPending, startTransition] = useTransition();

  function update(next: number) {
    startTransition(() => setCartQuantity(cartItemId, next));
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => update(quantity - 1)}
        disabled={isPending}
        aria-label={quantity === 1 ? "Remove" : "Decrease quantity"}
        className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-ink-line text-sm transition-colors duration-150 hover:border-ink hover:bg-paper-dim active:scale-90 disabled:opacity-50"
      >
        −
      </button>
      <span className="w-4 text-center text-sm">{quantity}</span>
      <button
        onClick={() => update(quantity + 1)}
        disabled={isPending}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-ink-line text-sm transition-colors duration-150 hover:border-ink hover:bg-paper-dim active:scale-90 disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}
