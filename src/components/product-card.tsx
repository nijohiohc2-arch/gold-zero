import { Link } from "@tanstack/react-router";
import { estimateBuy } from "@/lib/gold";
import type { Product } from "@/lib/products";
import { useShopStore } from "@/lib/store";
import { formatWon } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const rates = useShopStore((s) => s.rates);
  const price = estimateBuy({
    karat: product.karat,
    grams: product.grams,
    labor: product.labor,
    rates,
  });

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="group block overflow-hidden rounded-lg border border-line bg-cream"
    >
      <div className="aspect-square overflow-hidden bg-night">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-4">
        <p className="text-xs tracking-[0.14em] text-gold-deep">
          {product.karat} · {product.grams}g
        </p>
        <h3 className="mt-1 font-display text-xl text-ink">{product.name}</h3>
        <p className="mt-2 font-medium tabular-nums text-ink">{formatWon(price.total)}</p>
        <p className="mt-1 text-xs text-muted">오늘 시세 예상가 · {product.leadDays}</p>
      </div>
    </Link>
  );
}
