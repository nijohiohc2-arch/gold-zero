import { Link, useRouterState } from "@tanstack/react-router";
import { Calculator, Factory, MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SHOP } from "@/lib/shop";
import { cn } from "@/lib/utils";

function NavLinks({ pathname, light }: { pathname: string; light?: boolean }) {
  const idle = light ? "text-ivory/80 hover:text-gold-bright" : "text-ivory/80 hover:text-gold-bright";
  const on = "text-gold-bright";
  return (
    <>
      <Link to="/" className={cn("text-sm", pathname === "/" ? on : idle)}>
        홈
      </Link>
      <a href="/#calculator" className={cn("text-sm", idle)}>
        금값 계산
      </a>
      <Link to="/sell" className={cn("text-sm", pathname === "/sell" ? on : idle)}>
        금 매입
      </Link>
      <Link to="/shop" className={cn("text-sm", pathname.startsWith("/shop") ? on : idle)}>
        구매
      </Link>
      <Link to="/visit" className={cn("text-sm", pathname === "/visit" ? on : idle)}>
        방문
      </Link>
      <a
        href={SHOP.phoneHref}
        className="inline-flex h-9 items-center rounded-md border border-gold-bright/40 px-3 text-sm text-gold-bright"
      >
        {SHOP.phone}
      </a>
    </>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const photoRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = photoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header ref={photoRef} className="relative bg-night">
        <img
          src="/brand.webp"
          alt="천호황금시대"
          width={1400}
          height={788}
          fetchPriority="high"
          decoding="async"
          className="mx-auto block h-auto w-full"
        />
        <nav className="absolute inset-x-0 top-0 hidden items-center justify-end gap-5 px-6 pt-4 md:flex">
          <NavLinks pathname={pathname} light />
        </nav>
      </header>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-gold-bright/15 bg-night/96 backdrop-blur-md transition-transform duration-200",
          compact ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-display text-[1.35rem] tracking-[0.06em] text-gold-bright">
            천호황금시대
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLinks pathname={pathname} />
          </nav>
        </div>
      </div>
    </>
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