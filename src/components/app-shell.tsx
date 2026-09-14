import { Outlet } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { ConsultProvider } from "@/components/consult-context";
import { openConsultNow } from "@/components/consult-native";
import { SiteFooter, SiteHeader, StickyCta } from "@/components/site-chrome";
import { useShopStore } from "@/lib/store";

export function AppShell() {
  useEffect(() => {
    void useShopStore.persist.rehydrate();
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