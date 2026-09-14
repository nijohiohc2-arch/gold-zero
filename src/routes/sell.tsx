import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/calculator";
import { useConsult } from "@/components/consult-context";
import { PriceBoard } from "@/components/price-board";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/shop";

export const Route = createFileRoute("/sell")({ component: SellPage });

function SellPage() {
  const { openConsult } = useConsult();

  return (
    <main>
      <section className="bg-night px-4 py-16 text-ivory sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-gold">SELL GOLD</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-6xl">금 매입</h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/70">
            최고가 구호보다 계산 과정을 공개합니다. 오늘 시세, 순도, 중량, 품목 공제를 먼저
            보여드린 뒤 감정합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <PriceBoard />
        <Calculator
          onConsult={(payload) =>
            openConsult({
              type: "sell",
              message: payload.message,
              estimate: payload.estimate,
            })
          }
        />
      </section>

      <section className="bg-paper py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-4">
          {[
            { n: "01", t: "계산", d: "순도·중량을 넣어 예상 매입가를 확인합니다." },
            { n: "02", t: "사진 상담", d: "각인·스톤·마모가 보이면 더 정확합니다." },
            { n: "03", t: "방문 감정", d: "저울과 시세를 앞에서 보여드립니다." },
            { n: "04", t: "당일 입금", d: "확정가 동의 후 바로 정산합니다." },
          ].map((s) => (
            <div key={s.n}>
              <p className="text-xs tracking-[0.16em] text-gold-deep">{s.n}</p>
              <h2 className="mt-2 font-display text-2xl">{s.t}</h2>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl">매입 가능</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "금반지 · 목걸이 · 팔찌 · 귀걸이",
            "돌반지 · 백일반지 · 돌 선물 세트",
            "골드바 · 골드코인",
            "금니 · 치과 폐금 (감정 후)",
            "18K / 14K 주얼리",
            "깨지거나 낡은 장신구",
          ].map((item) => (
            <p key={item} className="border-b border-line py-3 text-sm">
              {item}
            </p>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          도금·합금·스톤 무게는 공제됩니다. 주소 {SHOP.address}
        </p>
        <Button
          className="mt-8"
          size="lg"
          onClick={() => openConsult({ type: "sell", message: "금 매입 상담 원합니다." })}
        >
          사진 보내고 정확한 견적
        </Button>
      </section>
    </main>
  );
}
