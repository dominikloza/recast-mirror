import { signOut } from "@/app/actions/auth";
import Link from "next/link";

export function ShopHeader({
  cartCount,
  isLoggedIn,
}: {
  cartCount: number;
  isLoggedIn: boolean;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-paper-line bg-paper/90 px-6 py-4 backdrop-blur-sm sm:px-10">
      <Link href="/" className="display text-lg">
        Recast
      </Link>

      <nav className="flex items-center gap-5 text-xs font-semibold uppercase tracking-wide">
        <Link href="/shop" className="text-ink-muted hover:text-ink">
          Shop
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/orders" className="text-ink-muted hover:text-ink">
              My Orders
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-ink-muted hover:text-ink">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="text-ink-muted hover:text-ink">
            Sign in
          </Link>
        )}

        <Link href="/cart" className="relative flex items-center" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8h12l-1 13H7L6 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-lime px-1 text-[10px] font-bold text-lime-ink">
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
