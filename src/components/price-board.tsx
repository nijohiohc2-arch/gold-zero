import { useShopStore } from "@/lib/store";
import { formatWon, formatWonShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceBoard({ tone = "light" }: { tone?: "light" | "dark" }) {
  const rates = useShopStore((s) => s.rates);
  const live = useShopStore((s) => s.live);
  const dark = tone === "dark";
  const buyDelta = rates.gold24Buy - rates.prevGold24Buy;
  const sellDelta = rates.gold24Sell - rates.prevGold24Sell;

  const rows = [
    { name: "순금 24K", buy: rates.gold24Buy, sell: rates.gold24Sell },
    { name: "18K", buy: Math.round(rates.gold24Buy * 0.75), sell: rates.gold18Sell },
    { name: "14K", buy: Math.round(rates.gold24Buy * 0.585), sell: rates.gold14Sell },
    { name: "백금", buy: null as number | null, sell: rates.platinumSell },
    { name: "은", buy: null, sell: rates.silverSell },
  ];

  return (
    <section className={cn("rounded-xl border p-4 sm:p-6", dark ? "border-ivory/12 bg-night-2" : "border-line bg-cream")}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className={cn("text-xs tracking-[0.18em]", dark ? "text-gold" : "text-gold-deep")}>
            TODAY · 1돈(3.75g)
          </p>
          <h2 className={cn("font-display text-2xl", dark ? "text-ivory" : "text-ink")}>오늘 금값</h2>
        </div>
        <p className={cn("text-right text-xs", dark ? "text-ivory/55" : "text-muted")}>
          <span className="inline-flex items-center justify-end gap-1.5">
            {live ? (
              <>
                <span className="size-1.5 rounded-full bg-up" />
                실시간
              </>
            ) : (
              "매장 적용가"
            )}
          </span>
          <br />
          {rates.updatedAt}
        </p>
      </div>

      <div className="mb-4">
        <p className={cn("font-display text-4xl tabular-nums sm:text-5xl", dark ? "text-ivory" : "text-ink")}>
          {formatWon(rates.gold24Buy)}
        </p>
        <p className={cn("mt-1 text-sm", dark ? "text-ivory/70" : "text-muted")}>
          순금 살 때 · {deltaLabel(buyDelta)} · 팔 때 {formatWonShort(rates.gold24Sell)}원{" "}
          {deltaLabel(sellDelta)}
        </p>
      </div>

      <div className={cn("grid grid-cols-3 gap-2 text-xs", dark ? "text-ivory/50" : "text-muted")}>
        <span>구분</span>
        <span className="text-right">살 때</span>
        <span className="text-right">팔 때</span>
      </div>
      <div className="mt-2 space-y-2">
        {rows.map((row) => (
          <div
            key={row.name}
            className={cn(
              "grid grid-cols-3 gap-2 border-t py-2 text-sm tabular-nums",
              dark ? "border-ivory/10" : "border-line",
            )}
          >
            <span className={dark ? "text-ivory" : "text-ink"}>{row.name}</span>
            <span className={cn("text-right", dark ? "text-ivory/80" : "text-ink-soft")}>
              {row.buy ? formatWonShort(row.buy) : "제품가"}
            </span>
            <span className={cn("text-right", dark ? "text-ivory" : "text-ink")}>
              {formatWonShort(row.sell)}
            </span>
          </div>
        ))}
      </div>
      <p className={cn("mt-3 text-xs leading-relaxed", dark ? "text-ivory/45" : "text-muted")}>
        18K·14K 살 때는 재료비+공임+부가세가 붙는 제품가입니다. 최종가는 감정 후 확정됩니다.
      </p>
    </section>
  );
}

function deltaLabel(delta: number) {
  if (delta === 0) return "보합";
  const abs = Math.abs(delta).toLocaleString("ko-KR");
  return delta > 0 ? `▲ ${abs}원` : `▼ ${abs}원`;
}
