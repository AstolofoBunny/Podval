import { createServer as createViteServer } from "vite";
import path from "path";
import { Express } from "express";

export async function setupVite(app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: path.resolve(__dirname, "../client"),
    appType: "custom",
  });

  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  const staticPath = path.resolve(__dirname, "../dist/public");
  app.use(require("express").static(staticPath));
}

export function log(msg: string) {
  console.log(`[SERVER] ${msg}`);
}
