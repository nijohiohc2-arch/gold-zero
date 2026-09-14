import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({ component: ShopPage });

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "14K", label: "14K" },
  { id: "18K", label: "18K" },
  { id: "24K", label: "24K" },
  { id: "couple", label: "커플·예물" },
  { id: "gift", label: "선물" },
];

function ShopPage() {
  const [filter, setFilter] = useState<Category>("all");
  const list = useMemo(
    () =>
      filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category.includes(filter)),
    [filter],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-gold-deep">SHOP</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">오늘 시세로 구매</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        가격은 당일 순금 시세에 재료비·공임·부가세를 더한 예상가입니다. 결제 전 카톡·전화로
        확정한 뒤 방문 수령합니다.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "h-10 rounded-full border px-4 text-sm",
              filter === f.id ? "border-ink bg-ink text-ivory" : "border-line text-ink-soft",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </main>
  );
}
