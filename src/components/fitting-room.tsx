"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type State =
  | { phase: "idle" }
  | { phase: "processing" }
  | { phase: "succeeded"; output: string }
  | { phase: "failed" };

const POLL_MS = 2000;
const TIMEOUT_MS = 90_000;

export function FittingRoom({
  slug,
  name,
  imageUrl,
}: {
  slug: string;
  name: string;
  imageUrl: string;
}) {
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ phase: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
      if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    };
  }, []);

  function stopPolling() {
    if (pollTimer.current) clearInterval(pollTimer.current);
    if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
  }

  function pollPrediction(predictionId: string) {
    pollTimer.current = setInterval(async () => {
      const res = await fetch(`/api/fitting-room/${predictionId}`);
      const data = await res.json();

      if (data.status === "succeeded" && data.output) {
        stopPolling();
        setState({ phase: "succeeded", output: data.output });
      } else if (data.status === "failed" || data.status === "canceled") {
        stopPolling();
        setState({ phase: "failed" });
      }
      // otherwise still starting/processing — keep polling
    }, POLL_MS);

    timeoutTimer.current = setTimeout(() => {
      stopPolling();
      setState((s) => (s.phase === "processing" ? { phase: "failed" } : s));
    }, TIMEOUT_MS);
  }

  async function handleFile(file: File) {
    setState({ phase: "processing" });

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("slug", slug);

    try {
      const res = await fetch("/api/fitting-room", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.predictionId) {
        setState({ phase: "failed" });
        return;
      }
      pollPrediction(data.predictionId);
    } catch {
      setState({ phase: "failed" });
    }
  }

  function reset() {
    setState({ phase: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-4 rounded-[3px] border border-ink-line p-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-lime-ink">
          Fitting Room
        </span>
        <p className="text-xs leading-relaxed text-paper-muted">
          Upload a photo to see {name} on you. It&apos;s sent to our AI
          preview model for this one preview and isn&apos;t stored anywhere
          afterward.
        </p>
      </div>

      {state.phase === "idle" && (
        <>
          <label className="flex items-start gap-2 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            I agree to send my photo to the fitting-room AI model for this
            one preview.
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={!consent}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="text-xs file:mr-3 file:rounded-[3px] file:border-0 file:bg-lime file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-lime-ink disabled:opacity-50"
          />
        </>
      )}

      {state.phase === "processing" && (
        <div className="flex items-center gap-3 py-6">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-line border-t-lime" />
          <span className="text-xs text-ink-muted">
            Scanning your photo and mapping the fit…
          </span>
        </div>
      )}

      {state.phase === "succeeded" && (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-paper-dim">
            <Image
              src={state.output}
              alt={`${name} on you`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            onClick={reset}
            className="w-fit text-xs font-semibold uppercase tracking-wide text-ink-muted underline"
          >
            Try another photo
          </button>
        </div>
      )}

      {state.phase === "failed" && (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-paper-dim">
            <Image src={imageUrl} alt={name} fill className="object-cover" />
            <span className="absolute left-2 top-2 rounded-full bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
              Example — preview unavailable
            </span>
          </div>
          <p className="text-xs text-paper-muted">
            The live preview didn&apos;t come through this time.
          </p>
          <button
            onClick={reset}
            className="w-fit rounded-[3px] bg-lime px-5 py-2 text-xs font-bold uppercase tracking-wide text-lime-ink"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
