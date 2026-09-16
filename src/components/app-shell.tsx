import { Outlet } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { ConsultProvider } from "@/components/consult-context";
import { openConsultNow } from "@/components/consult-native";
import { SiteFooter, SiteHeader, StickyCta } from "@/components/site-chrome";
import { fetchLiveGold } from "@/lib/live-gold";
import { useShopStore } from "@/lib/store";

async function refreshLiveGold() {
  try {
    const live = await fetchLiveGold();
    useShopStore.getState().applyLiveRates(live);
  } catch {
    /* keep last rates */
  }
}

export function AppShell() {
  useEffect(() => {
    let stop = false;
    void (async () => {
      await useShopStore.persist.rehydrate();
      if (!stop) await refreshLiveGold();
    })();
    const id = window.setInterval(refreshLiveGold, 30_000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, []);

  const value = useMemo(
    () => ({
      openConsult: openConsultNow,
    }),
    [],
  );

  return (
    <ConsultProvider value={value}>
      <div className="min-h-dvh bg-ivory pb-16 text-ink">
        <SiteHeader />
        <Outlet />
        <SiteFooter />
        <StickyCta />
      </div>
    </ConsultProvider>
  );
}