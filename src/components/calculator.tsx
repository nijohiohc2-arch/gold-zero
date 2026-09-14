import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DON_GRAMS,
  estimateBuy,
  estimateSell,
  defaultLabor,
  type CalcKarat,
  type Karat,
  type SellItem,
} from "@/lib/gold";
import { useShopStore } from "@/lib/store";
import { cn, formatWon } from "@/lib/utils";

const KARATS: { id: CalcKarat; label: string }[] = [
  { id: "24K", label: "24K 순금" },
  { id: "18K", label: "18K" },
  { id: "14K", label: "14K" },
  { id: "unknown", label: "모름" },
];

const ITEMS: { id: SellItem; label: string }[] = [
  { id: "ring", label: "반지" },
  { id: "necklace", label: "목걸이" },
  { id: "bracelet", label: "팔찌" },
  { id: "baby", label: "돌반지" },
  { id: "goldbar", label: "골드바" },
  { id: "dental", label: "금니" },
  { id: "other", label: "기타" },
];

type Mode = "sell" | "buy";

export function Calculator({
  onConsult,
}: {
  onConsult: (payload: { type: string; message: string; estimate: string }) => void;
}) {
  const rates = useShopStore((s) => s.rates);
  const [mode, setMode] = useState<Mode>("sell");
  const [karat, setKarat] = useState<CalcKarat>("18K");
  const [unit, setUnit] = useState<"g" | "don">("g");
  const [weight, setWeight] = useState("3.2");
  const [item, setItem] = useState<SellItem>("ring");

  const grams = useMemo(() => {
    const n = Number(weight);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return unit === "don" ? n * DON_GRAMS : n;
  }, [weight, unit]);

  const sell = estimateSell({ karat, grams, item, rates });
  const buyKarat: Karat = karat === "unknown" ? "18K" : karat;
  const buy = estimateBuy({
    karat: buyKarat,
    grams,
    labor: defaultLabor(buyKarat, grams, rates),
    rates,
  });

  const result = mode === "sell" ? sell.amount : buy.total;
  const estimateLine =
    mode === "sell"
      ? `예상 매입가 ${formatWon(sell.amount)} · ${sell.karatLabel} ${grams.toFixed(2)}g`
      : `예상 구매가 ${formatWon(buy.total)} · ${buyKarat} ${grams.toFixed(2)}g`;

  return (
    <div className="rounded-xl border border-line bg-cream p-4 sm:p-6">
      <div className="mb-5 grid grid-cols-2 rounded-md bg-paper p-1">
        {(["sell", "buy"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "h-11 rounded-sm text-sm font-medium",
              mode === m ? "bg-ink text-ivory" : "text-ink-soft",
            )}
          >
            {m === "sell" ? "내 금 팔기" : "금 맞추기"}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs tracking-wide text-muted">순도</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {KARATS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKarat(k.id)}
            className={cn(
              "h-10 rounded-full border px-3 text-sm",
              karat === k.id ? "border-ink bg-ink text-ivory" : "border-line text-ink-soft",
            )}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-[1fr_auto] gap-2">
        <label className="block text-xs text-muted">
          중량
          <Input
            className="mt-1 tabular-nums"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <div className="self-end flex rounded-md border border-line">
          {(["g", "don"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={cn(
                "h-11 w-14 text-sm",
                unit === u ? "bg-ink text-ivory" : "text-ink-soft",
              )}
            >
              {u === "g" ? "g" : "돈"}
            </button>
          ))}
        </div>
      </div>

      {mode === "sell" ? (
        <>
          <p className="mb-3 text-xs tracking-wide text-muted">품목</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {ITEMS.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setItem(it.id)}
                className={cn(
                  "h-10 rounded-full border px-3 text-sm",
                  item === it.id ? "border-ink bg-ink text-ivory" : "border-line text-ink-soft",
                )}
              >
                {it.label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className="rounded-lg bg-night px-4 py-5 text-ivory">
        <p className="text-xs tracking-[0.16em] text-gold">
          {mode === "sell" ? "예상 매입가" : "예상 제작가"}
        </p>
        <p className="mt-1 font-display text-4xl tabular-nums tracking-tight sm:text-5xl">
          {grams > 0 ? formatWon(result) : "—"}
        </p>
        <p className="mt-2 text-xs text-ivory/70">
          감정·스톤·마모에 따라 달라질 수 있습니다. 당일 시세 기준.
        </p>
      </div>

      {grams > 0 ? (
        <dl className="mt-4 space-y-2 text-sm text-ink-soft">
          {mode === "sell" ? (
            <>
              <Row k="적용 순도" v={sell.karatLabel} />
              <Row k="중량" v={`${sell.grams.toFixed(2)}g · ${sell.don.toFixed(3)}돈`} />
              <Row k="1돈 매입가" v={formatWon(sell.perDon)} />
              <Row k="품목 보정" v={`${Math.round(sell.factor * 100)}%`} />
              <Row k="순금 환산" v={`${sell.fineGoldGrams.toFixed(2)}g`} />
            </>
          ) : (
            <>
              <Row k="재료비" v={formatWon(buy.material)} />
              <Row k="공임" v={formatWon(buy.labor)} />
              <Row k="부가세 10%" v={formatWon(buy.vat)} />
              <Row k="합계" v={formatWon(buy.total)} />
            </>
          )}
        </dl>
      ) : null}

      <Button
        className="mt-5 w-full"
        size="lg"
        disabled={grams <= 0}
        onClick={() =>
          onConsult({
            type: mode === "sell" ? "sell" : "custom",
            estimate: estimateLine,
            message: estimateLine,
          })
        }
      >
        정확한 감정 · 견적 받기
      </Button>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/80 py-1.5">
      <dt className="text-muted">{k}</dt>
      <dd className="tabular-nums text-ink">{v}</dd>
    </div>
  );
}
