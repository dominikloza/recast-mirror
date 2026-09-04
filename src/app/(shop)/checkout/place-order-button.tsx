"use client";

import { useFormStatus } from "react-dom";

export function PlaceOrderButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-[3px] bg-lime px-6 py-4 text-sm font-bold uppercase tracking-wide text-lime-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:shadow-none disabled:translate-y-0 disabled:opacity-80"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-lime-ink/30 border-t-lime-ink" />
          Placing order&hellip;
        </span>
      ) : (
        label
      )}
    </button>
  );
}
