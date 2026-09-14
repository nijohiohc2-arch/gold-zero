import type { Karat } from "@/lib/gold";

export type Category = "all" | "14K" | "18K" | "24K" | "couple" | "gift";

export type Product = {
  slug: string;
  name: string;
  summary: string;
  karat: Karat;
  grams: number;
  labor: number;
  category: Exclude<Category, "all">[];
  leadDays: string;
  stock: "ready" | "made";
  options?: string;
  image: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "clip-necklace",
    name: "클립 체인 목걸이",
    summary: "데일리로 걸치는 14K 클립 체인. 공장 소량 제작.",
    karat: "14K",
    grams: 2.4,
    labor: 48_000,
    category: ["14K"],
    leadDays: "2–4일",
    stock: "made",
    options: "40 / 45cm",
    image: "/products/necklace-clip.jpg",
  },
  {
    slug: "couple-bands",
    name: "심플 커플링",
    summary: "두께만 다른 한 쌍. 각인·사이즈 맞춤.",
    karat: "18K",
    grams: 5.6,
    labor: 120_000,
    category: ["18K", "couple"],
    leadDays: "5–7일",
    stock: "made",
    options: "남 4mm / 여 3mm · 각인",
    image: "/products/couple-bands.jpg",
  },
  {
    slug: "dolbanji",
    name: "순금 돌반지",
    summary: "24K 아기 돌반지. 중량을 줄여 맞출 수 있습니다.",
    karat: "24K",
    grams: 3.75,
    labor: 28_000,
    category: ["24K", "gift"],
    leadDays: "당일–2일",
    stock: "ready",
    options: "1돈 / 0.5돈 / 1g",
    image: "/products/baby-ring.jpg",
  },
  {
    slug: "twist-ring",
    name: "꼬임 반지",
    summary: "조각 느낌의 18K 꼬임 밴드. 매일 착용해도 단단합니다.",
    karat: "18K",
    grams: 2.1,
    labor: 72_000,
    category: ["18K"],
    leadDays: "4–6일",
    stock: "made",
    options: "11–17호",
    image: "/products/twist-ring.jpg",
  },
  {
    slug: "heart-pendant",
    name: "하트 펜던트",
    summary: "가벼운 14K 하트. 선물용 기본 체인 포함.",
    karat: "14K",
    grams: 1.35,
    labor: 42_000,
    category: ["14K", "gift"],
    leadDays: "2–3일",
    stock: "ready",
    options: "체인 40cm",
    image: "/products/heart-pendant.jpg",
  },
  {
    slug: "gold-bar-1don",
    name: "순금 골드바 1돈",
    summary: "3.75g 민트 바. 공임이 낮고 되팔기 쉽습니다.",
    karat: "24K",
    grams: 3.75,
    labor: 12_000,
    category: ["24K", "gift"],
    leadDays: "당일",
    stock: "ready",
    image: "/products/goldbar.jpg",
  },
  {
    slug: "snake-bracelet",
    name: "스네이크 체인 팔찌",
    summary: "밀착감 있는 18K 스네이크 체인.",
    karat: "18K",
    grams: 4.8,
    labor: 88_000,
    category: ["18K"],
    leadDays: "5–8일",
    stock: "made",
    options: "16 / 17 / 18cm",
    image: "/products/snake-bracelet.jpg",
  },
  {
    slug: "huggie-hoops",
    name: "원터치 후프 귀걸이",
    summary: "작고 단단한 14K 허기 후프.",
    karat: "14K",
    grams: 1.1,
    labor: 38_000,
    category: ["14K"],
    leadDays: "2–4일",
    stock: "ready",
    image: "/products/hoops.jpg",
  },
  {
    slug: "wedding-band",
    name: "사틴 웨딩밴드",
    summary: "바깥은 하이폴리시, 안쪽은 사틴. 예물 기본형.",
    karat: "18K",
    grams: 3.2,
    labor: 96_000,
    category: ["18K", "couple"],
    leadDays: "7–10일",
    stock: "made",
    options: "폭 2.5 / 3.5mm · 각인",
    image: "/products/wedding-band.jpg",
  },
  {
    slug: "lucky-key",
    name: "순금 행운 열쇠",
    summary: "24K 미니 키. 돌·선물·개업 답례.",
    karat: "24K",
    grams: 1.875,
    labor: 22_000,
    category: ["24K", "gift"],
    leadDays: "당일–2일",
    stock: "ready",
    options: "0.5돈 / 1돈",
    image: "/products/lucky-key.jpg",
  },
  {
    slug: "layer-bracelet",
    name: "레이어드 팔찌",
    summary: "굵기가 다른 14K 체인 세 줄.",
    karat: "14K",
    grams: 3.1,
    labor: 64_000,
    category: ["14K"],
    leadDays: "4–6일",
    stock: "made",
    options: "16–18cm",
    image: "/products/layered-bracelet.jpg",
  },
  {
    slug: "solitaire-ring",
    name: "솔리테어 반지",
    summary: "작은 다이아 한 알. 스톤 등급은 상담 시 확정.",
    karat: "18K",
    grams: 2.4,
    labor: 180_000,
    category: ["18K", "couple"],
    leadDays: "10–14일",
    stock: "made",
    options: "스톤 0.1–0.3ct",
    image: "/products/solitaire.jpg",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
