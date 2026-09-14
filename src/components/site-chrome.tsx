import { Link, useRouterState } from "@tanstack/react-router";
import { Calculator, Factory, MessageCircle, Phone } from "lucide-react";
import { SHOP } from "@/lib/shop";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-tight text-ink">{SHOP.name}</span>
          <span className="mt-0.5 text-[10px] tracking-[0.22em] text-gold-deep">{SHOP.nameEn}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className={cn("text-sm hover:text-ink", pathname === "/" ? "text-ink" : "text-ink-soft")}>
            홈
          </Link>
          <a href="/#calculator" className="text-sm text-ink-soft hover:text-ink">
            금값 계산
          </a>
          <Link
            to="/sell"
            className={cn("text-sm hover:text-ink", pathname === "/sell" ? "text-ink" : "text-ink-soft")}
          >
            금 매입
          </Link>
          <Link
            to="/shop"
            className={cn("text-sm hover:text-ink", pathname.startsWith("/shop") ? "text-ink" : "text-ink-soft")}
          >
            구매
          </Link>
          <Link
            to="/visit"
            className={cn("text-sm hover:text-ink", pathname === "/visit" ? "text-ink" : "text-ink-soft")}
          >
            방문
          </Link>
        </nav>
        <a
          href={SHOP.phoneHref}
          className="hidden h-10 items-center rounded-md bg-ink px-3 text-sm text-ivory md:inline-flex"
        >
          {SHOP.phone}
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{SHOP.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{SHOP.tagline}</p>
        </div>
        <div className="text-sm text-ink-soft">
          <p>{SHOP.address}</p>
          <p className="mt-1">{SHOP.addressLine2}</p>
          <p className="mt-1">{SHOP.hours}</p>
          <p className="mt-1">{SHOP.parking}</p>
        </div>
        <div className="text-sm">
          <a className="block text-ink hover:underline" href={SHOP.phoneHref}>
            {SHOP.phone}
          </a>
          <a className="mt-2 block text-gold-deep hover:underline" href={SHOP.naverPlace}>
            네이버 플레이스
          </a>
          <Link to="/manage" className="mt-4 block text-xs text-muted hover:text-ink">
            오늘의 시세 관리
          </Link>
        </div>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        표시 가격은 예상가입니다. 순도·중량·공임 감정 후 최종 확정 · {SHOP.name}
      </p>
    </footer>
  );
}

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-4">
        <a href="/#calculator" className="flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-ink">
          <Calculator className="size-4" />
          계산기
        </a>
        <button
          type="button"
          data-open-consult="general"
          className="flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-ink"
        >
          <MessageCircle className="size-4" />
          일반 상담
        </button>
        <button
          type="button"
          data-open-consult="factory"
          className="shine-sweep flex h-14 flex-col items-center justify-center gap-0.5 bg-night text-[11px] text-gold-bright"
        >
          <Factory className="relative z-10 size-4" />
          <span className="relative z-10">공장 상담</span>
        </button>
        <a
          href={SHOP.phoneHref}
          className="flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-ink"
        >
          <Phone className="size-4" />
          전화
        </a>
      </div>
    </div>
  );
}
