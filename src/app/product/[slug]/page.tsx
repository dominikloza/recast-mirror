import { AddToCartButton } from "@/components/add-to-cart-button";
import { FittingRoom } from "@/components/fitting-room";
import { formatPrice, getProductBySlug, getVtonCategory } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, product] = await Promise.all([
    supabase.auth.getUser(),
    getProductBySlug(slug),
  ]);

  if (!product) notFound();

  return (
    <main className="flex-1 px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:gap-16">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-paper-dim">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="flex max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-paper-muted">
              {product.category}
            </span>
            <h1 className="display text-3xl">{product.name}</h1>
            <span className="text-lg font-bold">
              {formatPrice(product.price_cents)}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <AddToCartButton productId={product.id} isLoggedIn={!!user} />

          {product.image_url && getVtonCategory(product.category) && (
            <FittingRoom
              slug={product.slug}
              name={product.name}
              imageUrl={product.image_url}
            />
          )}
        </div>
      </div>
    </main>
  );
}
