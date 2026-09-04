import { OAuthButtons } from "./oauth-buttons";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-paper-muted">
          Recast
        </span>
        <h1 className="display text-3xl sm:text-4xl">Sign in</h1>
        <p className="max-w-xs text-sm text-ink-muted">
          One account for your cart, your orders, and the fitting room.
        </p>
      </div>
      <OAuthButtons />
    </main>
  );
}
