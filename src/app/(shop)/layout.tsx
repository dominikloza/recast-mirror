import { ShopHeader } from "./shop-header";
import { getCartCount } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [{ data: { user } }, cartCount] = await Promise.all([
    supabase.auth.getUser(),
    getCartCount(),
  ]);

  return (
    <>
      <ShopHeader cartCount={cartCount} isLoggedIn={!!user} />
      {children}
    </>
  );
}
