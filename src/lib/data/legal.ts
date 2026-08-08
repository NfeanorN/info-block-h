import { legalDocs } from "./mock";
import type { LegalDoc } from "@/lib/types";

export function getLegalDocs(): LegalDoc[] {
  return legalDocs;
}

export function getLegalDocById(id: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.id === id);
}
