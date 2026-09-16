import { loadSpotRates } from "../../src/lib/gold-spot";

export default async function goldApiMiddleware(
  event: { url: URL },
  next: () => Promise<unknown>,
) {
  if (event.url.pathname !== "/api/gold") return next();
  try {
    const data = await loadSpotRates();
    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "gold unavailable" }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}
