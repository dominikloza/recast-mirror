"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function OAuthButtons() {
  const [pending, setPending] = useState<"google" | "github" | null>(null);

  async function signIn(provider: "google" | "github") {
    setPending(provider);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <button
        onClick={() => signIn("google")}
        disabled={pending !== null}
        className="rounded-[3px] bg-lime px-7 py-4 text-sm font-bold tracking-wide text-lime-ink uppercase disabled:opacity-60"
      >
        {pending === "google" ? "Redirecting…" : "Continue with Google"}
      </button>
      <button
        onClick={() => signIn("github")}
        disabled={pending !== null}
        className="rounded-[3px] border-[1.5px] border-ink px-7 py-4 text-sm font-bold tracking-wide text-ink uppercase disabled:opacity-60"
      >
        {pending === "github" ? "Redirecting…" : "Continue with GitHub"}
      </button>
    </div>
  );
}
