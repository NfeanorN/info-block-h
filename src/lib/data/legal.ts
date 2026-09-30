import { clinicInfoDocs } from "@/lib/data/clinicDocs";
import { legalDocs as siteLegalDocs } from "@/lib/data/clinicData.generated";
import type { LegalDoc } from "@/lib/types";

const allDocs: LegalDoc[] = [...clinicInfoDocs, ...siteLegalDocs];

export function getLegalDocs(): LegalDoc[] {
  return allDocs;
}

export function getLegalDocById(id: string): LegalDoc | undefined {
  return allDocs.find((d) => d.id === id);
}
