"use client";

import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AddToCartButton({
  productId,
  isLoggedIn,
}: {
  productId: string;
  isLoggedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    startTransition(async () => {
      await addToCart(productId);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="btn-lift w-full rounded-[3px] bg-lime px-5 py-3 text-xs font-bold tracking-wide text-lime-ink uppercase transition-opacity disabled:opacity-60"
    >
      {added ? "Added ✓" : isPending ? "Adding…" : "Add to Cart"}
    </button>
  );
}
