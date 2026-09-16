import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { AppShell } from "@/components/app-shell";
import { NativeConsult } from "@/components/consult-native";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "천호황금시대";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "송파 천호황금시대 — 오늘 금값 계산, 금 매입, 공장 직영 주얼리 견적",
      },
      { name: "theme-color", content: "#1A1612" },
    ],
    links: [
      { rel: "preload", as: "image", href: "/brand.webp", type: "image/webp", fetchPriority: "high" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Noto+Sans+KR:wght@400;500;600&family=Noto+Serif+KR:wght@500;600&display=swap",
      },
    ],
    scripts: [{ src: "/consult.js" }],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="ko" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <NativeConsult />
        <AuthProvider>
          <AppShell />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
