"use client";

import { formatPrice } from "@/lib/format";
import { useEffect, useRef, useState } from "react";

type State =
  | { phase: "upload" }
  | { phase: "processing"; localPreview: string }
  | { phase: "result"; output: string }
  | { phase: "failed" };

const POLL_MS = 2000;
const TIMEOUT_MS = 90_000;

export function MirrorPeak({
  slug,
  name,
  priceCents,
  colorway,
  imageUrl,
}: {
  slug: string;
  name: string;
  priceCents: number;
  colorway: string;
  imageUrl: string;
}) {
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ phase: "upload" });
  const inputRef = useRef<HTMLInputElement>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
      if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    },
    [],
  );

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
        setState({ phase: "result", output: data.output });
      } else if (data.status === "failed" || data.status === "canceled") {
        stopPolling();
        setState({ phase: "failed" });
      }
    }, POLL_MS);

    timeoutTimer.current = setTimeout(() => {
      stopPolling();
      setState((s) => (s.phase === "processing" ? { phase: "failed" } : s));
    }, TIMEOUT_MS);
  }

  async function handleFile(file: File) {
    setState({ phase: "processing", localPreview: URL.createObjectURL(file) });

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("slug", slug);

    try {
      const res = await fetch("/api/fitting-room", { method: "POST", body: formData });
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

  function retake() {
    setState({ phase: "upload" });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
    <div className="mirror" data-mirror>
      <div className="mirror__bracket mirror__bracket--tl"></div>
      <div className="mirror__bracket mirror__bracket--tr"></div>
      <div className="mirror__bracket mirror__bracket--bl"></div>
      <div className="mirror__bracket mirror__bracket--br"></div>

      {state.phase === "upload" && (
        <div className="mirror__panel">
          <label
            className="dropzone"
            style={!consent ? { opacity: 0.45, pointerEvents: "none" } : undefined}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              disabled={!consent}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <span className="mirror__shutter">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16220A" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7 9.5 4h5L16 7"/><circle cx="12" cy="13.5" r="3.5"/></svg>
            </span>
            <span className="mirror__hint">
              <strong>Upload your photo</strong>
              Full body, plain background, even light.
            </span>
          </label>
        </div>
      )}

      {state.phase === "processing" && (
        <div className="mirror__panel" data-state="processing">
          <img className="mirror__img" src={state.localPreview} alt="" />
          <div className="mirror__scan"></div>
          <svg className="mirror__spin" style={{ position: "relative", zIndex: 3, width: 32, height: 32 }} viewBox="0 0 24 24" fill="none" stroke="#C6F542" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
          <span className="mirror__processing-label" style={{ position: "relative", zIndex: 3 }}>Analyzing fit&hellip;</span>
        </div>
      )}

      {state.phase === "result" && (
        <div className="mirror__panel" data-state="result">
          <img className="mirror__img" src={state.output} alt={`${name} on you`} />
          <span className="mirror__badge">AI Fit Preview</span>
          <div className="mirror__sheet">
            <div className="mirror__sheet-row">
              <div>
                <strong>{name}</strong>
                <span>{colorway} &middot; {formatPrice(priceCents)}</span>
              </div>
              <span className="mirror__pill">True to size</span>
            </div>
            <div className="mirror__actions">
              <a className="mirror__btn mirror__btn--primary" href={`/product/${slug}`} style={{ textAlign: "center", textDecoration: "none" }}>Add to Bag</a>
              <button className="mirror__btn mirror__btn--ghost" type="button" onClick={retake}>Retake</button>
            </div>
          </div>
        </div>
      )}

      {state.phase === "failed" && (
        <div className="mirror__panel" data-state="result">
          <img className="mirror__img" src={imageUrl} alt={name} />
          <span className="mirror__badge">Example &middot; preview unavailable</span>
          <div className="mirror__sheet">
            <div className="mirror__sheet-row">
              <div>
                <strong>{name}</strong>
                <span>The live preview didn&apos;t come through this time.</span>
              </div>
            </div>
            <div className="mirror__actions">
              <button className="mirror__btn mirror__btn--primary" type="button" onClick={retake}>Try again</button>
            </div>
          </div>
        </div>
      )}
    </div>

    {state.phase === "upload" && (
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          maxWidth: "min(30rem, 90vw)",
          marginTop: "var(--sc-4)",
          fontSize: "11px",
          lineHeight: 1.4,
          color: "var(--sc-ink-soft)",
        }}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          style={{ marginTop: 2, flexShrink: 0 }}
        />
        I agree to send my photo to the fitting-room AI model for this one
        preview.
      </label>
    )}
    </>
  );
}
