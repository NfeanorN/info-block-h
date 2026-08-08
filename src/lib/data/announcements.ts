import { announcementSlides, corruptionSlide, infoSlides } from "./mock";
import type { AnnouncementSlide, InfoSlide } from "@/lib/types";

export function getCorruptionSlide(): AnnouncementSlide {
  return corruptionSlide;
}

export function getAnnouncementSlides(): AnnouncementSlide[] {
  return announcementSlides;
}

export function getInfoSlides(): InfoSlide[] {
  return infoSlides;
}
