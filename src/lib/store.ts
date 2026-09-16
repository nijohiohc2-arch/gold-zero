import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_RATES, type Rates } from "@/lib/gold";
import { SHOP } from "@/lib/shop";

export type Inquiry = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  type: string;
  message: string;
  visitDate: string;
  productSlug?: string;
  estimate?: string;
};

type ShopState = {
  rates: Rates;
  kakaoUrl: string;
  inquiries: Inquiry[];
  live: boolean;
  setRates: (rates: Rates) => void;
  applyLiveRates: (live: Partial<Rates>) => void;
  setKakaoUrl: (url: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt">) => Inquiry;
};

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      rates: DEFAULT_RATES,
      kakaoUrl: SHOP.kakaoDefault,
      inquiries: [],
      live: false,
      setRates: (rates) => set({ rates, live: false }),
      applyLiveRates: (liveRates) =>
        set((s) => ({
          live: true,
          rates: {
            ...s.rates,
            ...liveRates,
            prevGold24Buy: s.live ? s.rates.prevGold24Buy : s.rates.gold24Buy,
            prevGold24Sell: s.live ? s.rates.prevGold24Sell : s.rates.gold24Sell,
          },
        })),
      setKakaoUrl: (kakaoUrl) => set({ kakaoUrl }),
      addInquiry: (inquiry) => {
        const row: Inquiry = {
          ...inquiry,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set({ inquiries: [row, ...get().inquiries].slice(0, 80) });
        return row;
      },
    }),
    { name: "hwanggeum-sidae", skipHydration: true },
  ),
);
