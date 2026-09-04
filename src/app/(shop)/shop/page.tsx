import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice, getProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function ShopPage() {
  const supabase = await createClient();
  const [{ data: { user } }, products] = await Promise.all([
    supabase.auth.getUser(),
    getProducts(),
  ]);

  return (
    <main className="flex-1 px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-paper-muted">
            Shop All
          </span>
          <h1 className="display text-4xl">The Range</h1>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <Link
                href={`/product/${product.slug}`}
                className="relative block aspect-[3/4] overflow-hidden rounded-[3px] bg-paper-dim"
              >
                {product.image_url && (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="flex flex-col gap-1">
                <Link href={`/product/${product.slug}`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-bold uppercase">
                      {product.name}
                    </span>
                    <span className="text-sm font-bold">
                      {formatPrice(product.price_cents)}
                    </span>
                  </div>
                </Link>
                <span className="text-xs text-paper-muted">
                  {product.category}
                </span>
              </div>
              <AddToCartButton productId={product.id} isLoggedIn={!!user} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
