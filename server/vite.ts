import { fileURLToPath } from "url";
import path from "path";
import express, { type Express } from "express";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: Express, server: any) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: path.resolve(__dirname, "../client"),
    appType: "custom",
  });

  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  const staticPath = path.resolve(__dirname, "../dist/public");
  app.use(express.static(staticPath));
}

export function log(message: string) {
  console.log(`[server] ${message}`);
}
