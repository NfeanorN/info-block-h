import { departments, doctors, specialties } from "./mock";
import type { Department, Doctor, Specialty } from "@/lib/types";

export function getDepartments(): Department[] {
  return departments;
}

export function getSpecialties(departmentId?: string): Specialty[] {
  if (!departmentId) return specialties;
  return specialties.filter((s) => s.departmentId === departmentId);
}

export function getDoctors(filters?: {
  departmentId?: string;
  specialtyId?: string;
}): Doctor[] {
  let list = doctors;
  if (filters?.departmentId) {
    list = list.filter((d) => d.departmentId === filters.departmentId);
  }
  if (filters?.specialtyId) {
    list = list.filter((d) => d.specialtyId === filters.specialtyId);
  }
  return list;
}

export function getSpecialtyById(id: string): Specialty | undefined {
  return specialties.find((s) => s.id === id);
}

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}
