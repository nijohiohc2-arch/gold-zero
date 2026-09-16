import { DON_GRAMS, type Rates } from "@/lib/gold";

const TROY_OZ_G = 31.1034768;

function round1k(n: number) {
  return Math.round(n / 1000) * 1000;
}

function kstStamp() {
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).replace("T", " ").slice(0, 19);
}

export type LiveGold = Pick<
  Rates,
  "gold24Buy" | "gold24Sell" | "gold18Sell" | "gold14Sell" | "platinumSell" | "silverSell" | "updatedAt"
> & {
  spotDon: number;
  xauUsd: number;
  usdKrw: number;
};

async function readJson(url: string) {
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json() as Promise<Record<string, unknown>>;
}

export async function fetchLiveGold(): Promise<LiveGold> {
  const [xau, fx, xag, xpt] = await Promise.all([
    readJson("https://api.gold-api.com/price/XAU").catch(() => null),
    readJson("https://open.er-api.com/v6/latest/USD").catch(() => null),
    readJson("https://api.gold-api.com/price/XAG").catch(() => null),
    readJson("https://api.gold-api.com/price/XPT").catch(() => null),
  ]);

  const xauUsd = Number(xau?.price);
  const usdKrw = Number((fx?.rates as Record<string, number> | undefined)?.KRW);
  if (!xauUsd || !usdKrw) throw new Error("live gold unavailable");

  const spotDon = ((xauUsd * usdKrw) / TROY_OZ_G) * DON_GRAMS;
  const gold24Buy = round1k(spotDon * 1.12);
  const gold24Sell = round1k(spotDon * 0.99);
  const gold18Sell = round1k(gold24Sell * 0.75);
  const gold14Sell = round1k(gold24Sell * 0.585);

  const xagUsd = Number(xag?.price);
  const xptUsd = Number(xpt?.price);
  const silverSell = xagUsd ? round1k(((xagUsd * usdKrw) / TROY_OZ_G) * DON_GRAMS) : 10_000;
  const platinumSell = xptUsd ? round1k(((xptUsd * usdKrw) / TROY_OZ_G) * DON_GRAMS) : 270_000;

  return {
    gold24Buy,
    gold24Sell,
    gold18Sell,
    gold14Sell,
    platinumSell,
    silverSell,
    spotDon: round1k(spotDon),
    xauUsd,
    usdKrw,
    updatedAt: kstStamp(),
  };
}
