import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalogue } from "../catalogue.js";

export function repoCatalogueRoot(): string {
  if (process.env.CONFORMANCE_CATALOGUE_ROOT) return resolve(process.env.CONFORMANCE_CATALOGUE_ROOT);
  return resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
}

export function loadActiveCatalogue(cwd: string): ReturnType<typeof loadCatalogue> {
  try {
    return loadCatalogue(cwd);
  } catch {
    return loadCatalogue(repoCatalogueRoot());
  }
}
