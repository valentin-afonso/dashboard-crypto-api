import { Hono } from "hono";
import { userRoutes } from "./user";
import { favoritesRoutes } from "./favorites";
import { cryptoRoutes } from "./crypto";
import { cryptoBitfinexRoutes } from "./crypto-bitfinex";

const routes = new Hono();

routes.route("/user", userRoutes);
routes.route("/favorites", favoritesRoutes);
routes.route("/crypto", cryptoRoutes);
routes.route("/crypto-bitfinex", cryptoBitfinexRoutes);

export { routes };
