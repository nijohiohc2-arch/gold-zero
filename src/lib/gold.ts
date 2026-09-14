export const DON_GRAMS = 3.75;

export type Karat = "24K" | "18K" | "14K";
export type CalcKarat = Karat | "unknown";
export type SellItem =
  | "goldbar"
  | "ring"
  | "necklace"
  | "bracelet"
  | "baby"
  | "dental"
  | "other";

export type Rates = {
  gold24Buy: number;
  gold24Sell: number;
  gold18Sell: number;
  gold14Sell: number;
  platinumSell: number;
  silverSell: number;
  jewelryFactor: number;
  goldbarFactor: number;
  dentalFactor: number;
  labor14PerGram: number;
  labor18PerGram: number;
  labor24PerGram: number;
  updatedAt: string;
  prevGold24Buy: number;
  prevGold24Sell: number;
};

export const DEFAULT_RATES: Rates = {
  gold24Buy: 830_000,
  gold24Sell: 706_000,
  gold18Sell: 520_000,
  gold14Sell: 405_000,
  platinumSell: 271_000,
  silverSell: 10_200,
  jewelryFactor: 0.97,
  goldbarFactor: 1,
  dentalFactor: 0.9,
  labor14PerGram: 22_000,
  labor18PerGram: 26_000,
  labor24PerGram: 8_000,
  updatedAt: "2026-09-12 10:00",
  prevGold24Buy: 841_000,
  prevGold24Sell: 716_000,
};

export const PURITY: Record<Karat, number> = {
  "24K": 0.999,
  "18K": 0.75,
  "14K": 0.585,
};

export function gramsToDon(grams: number) {
  return grams / DON_GRAMS;
}

export function donToGrams(don: number) {
  return don * DON_GRAMS;
}

export function itemFactor(item: SellItem, rates: Rates) {
  if (item === "goldbar") return rates.goldbarFactor;
  if (item === "dental") return rates.dentalFactor;
  return rates.jewelryFactor;
}

export function sellPerDon(karat: CalcKarat, rates: Rates) {
  if (karat === "24K") return rates.gold24Sell;
  if (karat === "18K") return rates.gold18Sell;
  if (karat === "14K") return rates.gold14Sell;
  return rates.gold18Sell;
}

export function estimateSell(input: {
  karat: CalcKarat;
  grams: number;
  item: SellItem;
  rates: Rates;
}) {
  const grams = Math.max(0, input.grams);
  const don = gramsToDon(grams);
  const perDon = sellPerDon(input.karat, input.rates);
  const factor = itemFactor(input.item, input.rates);
  const purity = input.karat === "unknown" ? PURITY["18K"] : PURITY[input.karat];
  const fineGoldGrams = grams * (input.karat === "unknown" ? PURITY["18K"] : purity);
  const amount = Math.round(perDon * don * factor);

  return {
    grams,
    don,
    perDon,
    factor,
    purity: input.karat === "unknown" ? PURITY["18K"] : purity,
    fineGoldGrams,
    amount,
    karatLabel: input.karat === "unknown" ? "18K 가정" : input.karat,
  };
}

export function estimateBuy(input: {
  karat: Karat;
  grams: number;
  labor: number;
  rates: Rates;
}) {
  const grams = Math.max(0, input.grams);
  const purity = PURITY[input.karat];
  const material = Math.round(input.rates.gold24Buy * gramsToDon(grams) * purity);
  const labor = Math.round(input.labor);
  const subtotal = material + labor;
  const vat = Math.round(subtotal * 0.1);
  return {
    grams,
    don: gramsToDon(grams),
    purity,
    material,
    labor,
    vat,
    total: subtotal + vat,
  };
}

export function defaultLabor(karat: Karat, grams: number, rates: Rates) {
  const perGram =
    karat === "24K"
      ? rates.labor24PerGram
      : karat === "18K"
        ? rates.labor18PerGram
        : rates.labor14PerGram;
  return Math.round(perGram * Math.max(grams, 0.8));
}
