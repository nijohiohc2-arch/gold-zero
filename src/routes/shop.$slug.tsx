import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useConsult } from "@/components/consult-context";
import { Button } from "@/components/ui/button";
import { estimateBuy } from "@/lib/gold";
import { getProduct } from "@/lib/products";
import { useShopStore } from "@/lib/store";
import { formatWon } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  component: ProductPage,
  notFoundComponent: () => (
    <main className="px-6 py-20 text-center">
      <h1 className="font-display text-3xl">상품을 찾을 수 없습니다</h1>
      <Link to="/shop" className="mt-4 inline-block text-sm text-gold-deep">
        목록으로
      </Link>
    </main>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  const { openConsult } = useConsult();
  const rates = useShopStore((s) => s.rates);
  if (!product) throw notFound();

  const price = estimateBuy({
    karat: product.karat,
    grams: product.grams,
    labor: product.labor,
    rates,
  });

  const estimate = `${product.name} · ${product.karat} ${product.grams}g · 예상 ${formatWon(price.total)}`;

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <img
        src={product.image}
        alt={product.name}
        className="aspect-square w-full rounded-lg object-cover"
      />
      <div className="lg:py-6">
        <Link to="/shop" className="text-sm text-muted hover:text-ink">
          구매 목록
        </Link>
        <p className="mt-4 text-xs tracking-[0.16em] text-gold-deep">
          {product.karat} · {product.grams}g · {product.stock === "ready" ? "재고" : "주문제작"}
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{product.summary}</p>
        <p className="mt-6 font-display text-4xl tabular-nums">{formatWon(price.total)}</p>
        <p className="mt-1 text-sm text-muted">오늘 시세 예상가 · 제작 {product.leadDays}</p>

        <dl className="mt-8 space-y-2 text-sm">
          <Row k="재료비" v={formatWon(price.material)} />
          <Row k="공임" v={formatWon(price.labor)} />
          <Row k="부가세 10%" v={formatWon(price.vat)} />
          {product.options ? <Row k="옵션" v={product.options} /> : null}
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="flex-1"
            onClick={() =>
              openConsult({
                type: "buy",
                productSlug: product.slug,
                estimate,
                message: estimate,
              })
            }
          >
            오늘 시세로 구매 문의
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() =>
              openConsult({
                type: "visit",
                productSlug: product.slug,
                message: `${product.name} 실물 보고 싶습니다.`,
              })
            }
          >
            방문하고 실물 보기
          </Button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          온라인 즉시 결제는 다음 단계입니다. 지금은 견적 확정 후 방문 수령 또는 예약금으로
          진행합니다.
        </p>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line py-2">
      <dt className="text-muted">{k}</dt>
      <dd className="tabular-nums text-ink">{v}</dd>
    </div>
  );
}
