"use client";

import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RangeItemCartButton({
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
      className="range-item__cart"
      type="button"
      disabled={isPending}
      onClick={handleClick}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
