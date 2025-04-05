import type { MiddlewareHandler } from "hono";

const base_url = "https://api-pub.bitfinex.com/v2/";

export const checkBitfinexStatus: MiddlewareHandler = async (c, next) => {
  try {
    const res = await fetch(`${base_url}platform/status`);
    const data = await res.json();

    if (Array.isArray(data) && data[0] === 1) {
      await next();
    } else {
      return c.json({ error: "Service indisponible" }, 503);
    }
  } catch (err) {
    return c.json({ error: "Erreur de vérification du service" }, 503);
  }
};
