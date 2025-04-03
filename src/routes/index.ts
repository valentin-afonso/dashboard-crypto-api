import { Hono } from "hono";
import { userRoutes } from "./user";
import { favoritesRoutes } from "./favorites";
import { cryptoRoutes } from "./crypto";

const routes = new Hono();

routes.route("/user", userRoutes);
routes.route("/favorites", favoritesRoutes);
routes.route("/crypto", cryptoRoutes);

export { routes };
