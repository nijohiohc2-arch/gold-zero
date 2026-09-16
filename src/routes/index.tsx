import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Factory, Scale, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Calculator } from "@/components/calculator";
import { useConsult } from "@/components/consult-context";
import { HotBadge, Spark } from "@/components/hot-badge";
import { PriceBoard } from "@/components/price-board";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/products";
import { SHOP } from "@/lib/shop";
import { useShopStore } from "@/lib/store";
import { cn, formatWon } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { openConsult } = useConsult();
  const rates = useShopStore((s) => s.rates);
  const featured = PRODUCTS.slice(0, 6);

  return (
    <main>
      <section className="bg-night text-ivory">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          <p className="text-xs tracking-[0.28em] text-gold">SONGPA · CHEONHO · FACTORY</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["예물", "반지", "목걸이", "팔찌"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-gold-bright/50 bg-night/40 px-3 py-1 text-[11px] tracking-[0.14em] text-gold-bright"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm tracking-wide text-gold-bright">브랜드 디자인 맞춤 가능</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl leading-[1.05] sm:text-7xl">
            오늘 금값으로
            <br />
            투명하게.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/75 sm:text-base">
            {SHOP.tagline}. 순금 1돈 살 때{" "}
            <span className="tabular-nums text-ivory">{formatWon(rates.gold24Buy)}</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#calculator">내 금 지금 얼마인지 계산</a>
            </Button>
            <Button asChild size="lg" variant="cream">
              <Link to="/shop">오늘 시세로 구매 견적</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 py-10 sm:px-6 md:grid-cols-3">
        <Feature
          icon={<Scale className="size-5" />}
          title="금 팔기"
          text="시세·순도·중량·공제를 계산기로 먼저 보여드립니다."
          href="/sell"
        />
        <Feature
          icon={<Sparkles className="size-5" />}
          title="금 구매 · 맞춤"
          text="14K·18K·24K 공장 제작. 오늘 재료비+공임으로 견적."
          href="/shop"
        />
        <a
          href="#factory"
          className="gold-border-glow gold-wash shine-sweep relative rounded-lg p-5 text-ivory"
        >
          <Spark className="absolute right-5 top-5" />
          <Spark className="absolute bottom-6 right-10" />
          <Spark className="absolute right-16 top-10 size-1" />
          <div className="flex items-center gap-2">
            <HotBadge />
            <span className="text-[10px] tracking-[0.18em] text-gold-bright">FACTORY</span>
          </div>
          <div className="mt-3 text-gold-bright">
            <Factory className="size-5" />
          </div>
          <h2 className="mt-3 font-display text-2xl text-gold-bright">공장 직영</h2>
          <p className="mt-2 text-sm leading-relaxed text-ivory/80">
            중간 유통이 없습니다. 상담하시면{" "}
            <strong className="font-medium text-gold-bright">공장가</strong>로 맞춰 드립니다.
          </p>
        </a>
      </section>

      <section id="calculator" className="scroll-mt-24 bg-paper py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <PriceBoard />
          <div>
            <p className="text-xs tracking-[0.2em] text-gold-deep">CALCULATOR</p>
            <h2 className="mt-2 font-display text-4xl">내 금 계산기</h2>
            <p className="mt-3 mb-6 max-w-md text-sm leading-relaxed text-muted">
              계산기가 돈을 버는 게 아닙니다. 정확한 감정과 방문으로 연결합니다.
            </p>
            <Calculator
              onConsult={(payload) =>
                openConsult({
                  type: payload.type,
                  message: payload.message,
                  estimate: payload.estimate,
                })
              }
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-gold-deep">READY TO ORDER</p>
            <h2 className="mt-2 font-display text-4xl">오늘 시세로 맞추기</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-ink">
            전체 보기 <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section id="factory" className="scroll-mt-24 bg-night text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="shine-sweep gold-border-glow relative overflow-hidden rounded-lg">
            <img
              src="/atelier.jpg"
              alt="황금시대 공방"
              className="aspect-video w-full object-cover"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <HotBadge />
              <span className="rounded-full bg-night/70 px-3 py-1 text-[11px] tracking-[0.14em] text-gold-bright">
                공장 직영
              </span>
            </div>
            <Spark className="absolute right-6 top-6" />
            <Spark className="absolute bottom-8 right-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <HotBadge />
              <p className="text-xs tracking-[0.2em] text-gold-bright">FACTORY DIRECT</p>
            </div>
            <h2 className="mt-3 font-display text-4xl text-gold-bright">
              공장에서 바로 맞추면
              <br />
              가격이 달라집니다.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ivory/75">
              도매·소매를 한 번 더 거치지 않습니다. 상담만 주시면 재료비+공임 기준으로
              <span className="text-gold-bright"> 공장가 견적</span>을 냅니다. 같은 중량이어도
              일반 금은방보다 상당히 저렴하게 제작할 수 있습니다.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border border-ivory/12 bg-night-2 px-4 py-3">
                <p className="text-[11px] tracking-wide text-ivory/45">일반 금은방</p>
                <p className="mt-1 text-ivory/70">유통 마진 + 매장 마진</p>
              </div>
              <div className="gold-border-glow rounded-md bg-night-2 px-4 py-3">
                <p className="text-[11px] tracking-wide text-gold-bright">황금시대 공장 직영</p>
                <p className="mt-1 text-ivory">재료비 + 공임만</p>
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-ivory/80">
              <li>소량 · 맞춤 · OEM 제작</li>
              <li>커플링 · 예물 · 돌반지 공장가</li>
              <li>보유 금으로 리셋팅 · 교환</li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="shine-sweep border-0 bg-night text-gold-bright hover:bg-night"
                data-open-consult="factory"
                type="button"
              >
                공장가 상담 받기
              </Button>
              <Button asChild size="lg" variant="cream">
                <Link to="/visit">매장 방문 예약</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
  href,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a href={href} className={cn("rounded-lg border border-line bg-cream p-5 hover:border-gold")}>
      <div className="text-gold-deep">{icon}</div>
      <h2 className="mt-3 font-display text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </a>
  );
}
