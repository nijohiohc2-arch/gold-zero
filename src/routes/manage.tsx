import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_RATES, type Rates } from "@/lib/gold";
import { useShopStore } from "@/lib/store";
import { formatWon } from "@/lib/utils";

export const Route = createFileRoute("/manage")({ component: ManagePage });

function ManagePage() {
  const rates = useShopStore((s) => s.rates);
  const setRates = useShopStore((s) => s.setRates);
  const kakaoUrl = useShopStore((s) => s.kakaoUrl);
  const setKakaoUrl = useShopStore((s) => s.setKakaoUrl);
  const inquiries = useShopStore((s) => s.inquiries);

  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const num = (key: keyof Rates) => Number(f.get(key)) || 0;
    const next: Rates = {
      ...rates,
      gold24Buy: num("gold24Buy"),
      gold24Sell: num("gold24Sell"),
      gold18Sell: num("gold18Sell"),
      gold14Sell: num("gold14Sell"),
      platinumSell: num("platinumSell"),
      silverSell: num("silverSell"),
      jewelryFactor: Number(f.get("jewelryFactor")) || 0.97,
      goldbarFactor: Number(f.get("goldbarFactor")) || 1,
      dentalFactor: Number(f.get("dentalFactor")) || 0.9,
      updatedAt: String(f.get("updatedAt") || rates.updatedAt),
      prevGold24Buy: rates.gold24Buy,
      prevGold24Sell: rates.gold24Sell,
    };
    setRates(next);
    setKakaoUrl(String(f.get("kakaoUrl") ?? ""));
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-gold-deep">STORE</p>
      <h1 className="mt-2 font-display text-4xl">오늘의 시세 관리</h1>
      <p className="mt-3 text-sm text-muted">
        순금 시세는 30초마다 국제 금값으로 자동 갱신됩니다. 보정값·공임만 여기서 바꾸면 됩니다.
      </p>

      <form className="mt-8 space-y-4 rounded-lg border border-line bg-cream p-5" onSubmit={save}>
        <Field name="gold24Buy" label="순금 살 때 1돈" defaultValue={rates.gold24Buy} />
        <Field name="gold24Sell" label="순금 팔 때 1돈" defaultValue={rates.gold24Sell} />
        <Field name="gold18Sell" label="18K 팔 때 1돈" defaultValue={rates.gold18Sell} />
        <Field name="gold14Sell" label="14K 팔 때 1돈" defaultValue={rates.gold14Sell} />
        <Field name="platinumSell" label="백금 팔 때 1돈" defaultValue={rates.platinumSell} />
        <Field name="silverSell" label="은 팔 때 1돈" defaultValue={rates.silverSell} />
        <label className="block text-xs text-muted">
          장신구 보정 (0.97 = 97%)
          <Input name="jewelryFactor" className="mt-1" defaultValue={rates.jewelryFactor} />
        </label>
        <label className="block text-xs text-muted">
          골드바 보정
          <Input name="goldbarFactor" className="mt-1" defaultValue={rates.goldbarFactor} />
        </label>
        <label className="block text-xs text-muted">
          금니 보정
          <Input name="dentalFactor" className="mt-1" defaultValue={rates.dentalFactor} />
        </label>
        <label className="block text-xs text-muted">
          기준 시각
          <Input name="updatedAt" className="mt-1" defaultValue={rates.updatedAt} />
        </label>
        <label className="block text-xs text-muted">
          카카오 채널 URL
          <Input
            name="kakaoUrl"
            className="mt-1"
            defaultValue={kakaoUrl}
            placeholder="https://pf.kakao.com/..."
          />
        </label>
        <div className="flex gap-2">
          <Button type="submit">저장</Button>
          <Button type="button" variant="outline" onClick={() => setRates(DEFAULT_RATES)}>
            기본값
          </Button>
        </div>
      </form>

      <h2 className="mt-12 font-display text-2xl">최근 상담 {inquiries.length}</h2>
      <div className="mt-4 space-y-3">
        {inquiries.length === 0 ? (
          <p className="text-sm text-muted">아직 접수된 상담이 없습니다.</p>
        ) : (
          inquiries.map((row) => (
            <article key={row.id} className="rounded-md border border-line bg-cream p-4 text-sm">
              <p className="font-medium">
                {row.name} · {row.phone} · {row.type}
              </p>
              <p className="mt-1 text-muted">{row.estimate || row.message}</p>
              <p className="mt-2 text-xs text-muted">
                {new Date(row.createdAt).toLocaleString("ko-KR")}
                {row.visitDate ? ` · 방문 ${row.visitDate}` : ""}
              </p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: number;
}) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <Input name={name} className="mt-1 tabular-nums" defaultValue={defaultValue} />
      <span className="mt-1 block text-[11px]">{formatWon(defaultValue)}</span>
    </label>
  );
}
