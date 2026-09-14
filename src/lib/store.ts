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
  setRates: (rates: Rates) => void;
  setKakaoUrl: (url: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt">) => Inquiry;
};

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      rates: DEFAULT_RATES,
      kakaoUrl: SHOP.kakaoDefault,
      inquiries: [],
      setRates: (rates) => set({ rates }),
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
