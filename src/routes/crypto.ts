import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { checkBitfinexStatus } from "../middleware/bitfinexStatus";

const cryptoRoutes = new Hono();
const base_url = "https://api-pub.bitfinex.com/v2/";

cryptoRoutes.use("*", checkBitfinexStatus);

cryptoRoutes.get("/status", async (c) => {
  return proxy(`${base_url}platform/status`);
});
cryptoRoutes.get("/tickers", async (c) => {
  const { symbols } = c.req.query();
  return proxy(`${base_url}tickers?symbols=${symbols}`);
});
cryptoRoutes.get("/ticker/:symbol", async (c) => {
  const symbol = c.req.param("symbol");
  return proxy(`${base_url}ticker/${symbol}`);
});
cryptoRoutes.get("/tickers/hist", async (c) => {
  const { symbols, limit } = c.req.query();
  return proxy(`${base_url}tickers?symbols=${symbols}&limit=${limit}`);
});
cryptoRoutes.get("/trades/:symbol/hist", async (c) => {
  const symbol = c.req.param("symbol");
  const { symbols, limit } = c.req.query();
  return proxy(
    `${base_url}trades/${symbol}/hist?symbols=${symbols}&limit=${limit}`
  );
});
cryptoRoutes.get("/book/:symbol/:precision", async (c) => {
  const symbol = c.req.param("symbol");
  const precision = c.req.param("precision");
  const { len } = c.req.query();
  return proxy(`${base_url}book/${symbol}/${precision}?len=${len}`);
});

cryptoRoutes.get(
  "/stats1/:key/:size/:sym_platform/:side_pair/:section",
  async (c) => {
    const key = c.req.param("key");
    const size = c.req.param("size");
    const sym_platform = c.req.param("sym_platform");
    const side_pair = c.req.param("side_pair");
    const section = c.req.param("section");
    const endpoint = `${base_url}stats1/${key}:${size}:${sym_platform}:${side_pair}/${section}`;
    return proxy(endpoint);
  }
);
cryptoRoutes.get("/candles/:candle/:section", async (c) => {
  const candle = c.req.param("candle");
  const section = c.req.param("section");
  const endpoint = `${base_url}candles/${candle}/${section}`;
  return proxy(endpoint);
});
cryptoRoutes.get("/status/deriv", async (c) => {
  const { keys } = c.req.query();
  const endpoint = `${base_url}status/deriv?keys=${keys}`;
  return proxy(endpoint);
});
cryptoRoutes.get("/status/deriv/:key/hist", async (c) => {
  const key = c.req.param("key");
  const endpoint = `${base_url}status/deriv/${key}/hist`;
  return proxy(endpoint);
});
cryptoRoutes.get("/liquidations/hist", async (c) => {
  const { sort, start, end, limit } = c.req.query();
  const endpoint = `${base_url}liquidations/hist?sort=${sort}&start=${start}&end=${end}&limit=${limit}`;
  return proxy(endpoint);
});
cryptoRoutes.post("/calc/trade/avg", async (c) => {
  const { symbol, amount, period, rate_limit } = c.req.query();
  const endpoint = `${base_url}calc/trade/avg?symbol=${symbol}&amount=${amount}&period=${period}&rate_limit=${rate_limit}`;
  return proxy(endpoint);
});
cryptoRoutes.post("/calc/fx", async (c) => {
  const { ccy1, ccy2 } = c.req.query();
  const endpoint = `${base_url}calc/fx?ccy1=${ccy1}&ccy2=${ccy2}`;
  return proxy(endpoint);
});
export { cryptoRoutes };
