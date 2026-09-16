export const SHOP = {
  name: "천호황금시대",
  nameEn: "CHEONHO HWANGGEUM SIDAE",
  tagline: "공장에서 매장까지, 오늘의 금값으로 투명하게",
  phone: "0507-1345-3180",
  phoneHref: "tel:050713453180",
  smsHref: "sms:050713453180",
  address: "서울 송파구 천호대로 992 1층",
  addressLine2: "천호역 10번 출구에서 30m",
  hours: "매일 10:00 – 19:00",
  hoursNote: "시세·재고는 방문 감정 기준",
  parking: "천호 공영 주차장 이용",
  naverPlace: "https://naver.me/GOhWHrw8",
  naverMap: "https://map.naver.com/p/entry/place/1912557373",
  kakaoDefault: "",
} as const;

export const INQUIRY_TYPES = [
  { id: "sell", label: "금 매입" },
  { id: "buy", label: "구매 견적" },
  { id: "custom", label: "맞춤 제작" },
  { id: "visit", label: "방문 예약" },
] as const;
