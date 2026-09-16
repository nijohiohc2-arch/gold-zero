import { loadSpotRates, type SpotRates } from "@/lib/gold-spot";

export type LiveGold = SpotRates;

export async function fetchLiveGold(): Promise<LiveGold> {
  try {
    const res = await fetch("/api/gold", { cache: "no-store" });
    if (res.ok) return (await res.json()) as LiveGold;
  } catch {
    /* fall through to direct fetch */
  }
  return loadSpotRates();
}
