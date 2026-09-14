import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/shop";

export const Route = createFileRoute("/visit")({ component: VisitPage });

function VisitPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-gold-deep">VISIT</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">방문 · 상담</h1>
      <p className="mt-3 max-w-lg text-sm text-muted">
        계산과 견적은 온라인, 확정은 천호 매장에서. 감정 저울을 앞에서 보여드립니다.
      </p>

      <div className="mt-10 max-w-xl rounded-lg border border-line bg-cream p-6">
        <p className="font-display text-3xl">{SHOP.name}</p>
        <ul className="mt-6 space-y-4 text-sm text-ink-soft">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 text-gold-deep" />
            <span>
              {SHOP.address}
              <br />
              {SHOP.addressLine2}
            </span>
          </li>
          <li className="flex gap-3">
            <Clock className="mt-0.5 size-4 text-gold-deep" />
            <span>
              {SHOP.hours}
              <br />
              {SHOP.hoursNote}
            </span>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 size-4 text-gold-deep" />
            <a href={SHOP.phoneHref} className="underline-offset-2 hover:underline">
              {SHOP.phone}
            </a>
          </li>
        </ul>
        <p className="mt-6 text-sm text-muted">{SHOP.parking}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" type="button" data-open-consult="general">
            방문 예약하기
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={SHOP.naverPlace} target="_blank" rel="noreferrer">
              네이버 길찾기
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
