import { DON_GRAMS } from "@/lib/gold";

const TROY_OZ_G = 31.1034768;

function round1k(n: number) {
  return Math.round(n / 1000) * 1000;
}

function kstStamp() {
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).replace("T", " ").slice(0, 19);
}

export type SpotRates = {
  gold24Buy: number;
  gold24Sell: number;
  gold18Sell: number;
  gold14Sell: number;
  platinumSell: number;
  silverSell: number;
  updatedAt: string;
  spotDon: number;
  xauUsd: number;
  usdKrw: number;
};

async function readJson(url: string) {
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json() as Promise<Record<string, unknown>>;
}

async function loadXauUsd() {
  try {
    const d = await readJson("https://api.gold-api.com/price/XAU");
    const n = Number(d.price);
    if (n > 0) return n;
  } catch {
    /* fallback */
  }
  const d = await readJson("https://biquote.io/api/XAUUSD");
  const n = Number(d.mid ?? d.bid);
  if (n > 0) return n;
  throw new Error("xau unavailable");
}

async function loadUsdKrw() {
  try {
    const d = await readJson("https://open.er-api.com/v6/latest/USD");
    const n = Number((d.rates as Record<string, number> | undefined)?.KRW);
    if (n > 0) return n;
  } catch {
    /* fallback */
  }
  const d = await readJson(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
  );
  const n = Number((d.usd as Record<string, number> | undefined)?.krw);
  if (n > 0) return n;
  throw new Error("krw unavailable");
}

export async function loadSpotRates(): Promise<SpotRates> {
  const [xauUsd, usdKrw, xag, xpt] = await Promise.all([
    loadXauUsd(),
    loadUsdKrw(),
    readJson("https://api.gold-api.com/price/XAG").catch(() => null),
    readJson("https://api.gold-api.com/price/XPT").catch(() => null),
  ]);

  const spotDon = ((xauUsd * usdKrw) / TROY_OZ_G) * DON_GRAMS;
  const gold24Buy = round1k(spotDon * 1.12);
  const gold24Sell = round1k(spotDon * 0.99);
  const xagUsd = Number(xag?.price);
  const xptUsd = Number(xpt?.price);

  return {
    gold24Buy,
    gold24Sell,
    gold18Sell: round1k(gold24Sell * 0.75),
    gold14Sell: round1k(gold24Sell * 0.585),
    silverSell: xagUsd ? round1k(((xagUsd * usdKrw) / TROY_OZ_G) * DON_GRAMS) : 10_000,
    platinumSell: xptUsd ? round1k(((xptUsd * usdKrw) / TROY_OZ_G) * DON_GRAMS) : 270_000,
    spotDon: round1k(spotDon),
    xauUsd,
    usdKrw,
    updatedAt: kstStamp(),
  };
}
