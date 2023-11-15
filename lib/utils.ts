import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatedRut = (rut: string) => {
  // Elimina cualquier guión o punto del RUT y lo convierte a mayúsculas
  rut = rut
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/[^0-9kK-]/g, "")
    .toUpperCase();

  if (rut.length < 2) {
    return rut;
  }

  // Separa el RUT en su parte numérica y su dígito verificador
  const rutPart = rut.slice(0, -1);
  const verificador = rut.slice(-1);

  // Combina la parte numérica del RUT con el dígito verificador y guión
  return rutPart + "-" + verificador;
};

interface LaboratoryData {
  name: string;
  total: number;
}

interface PcData {
  name: string;
  total: number;
}

function mapLaboratoriesData(apiData: any[]): LaboratoryData[] {
  const availableCount = apiData.filter((lab) => lab.status).length;
  const occupiedCount = apiData.length - availableCount;

  return [
    {
      name: "Laboratorios Disponibles",
      total: availableCount,
    },
    {
      name: "Laboratorios Ocupados",
      total: occupiedCount,
    },
  ];
}

function mapPcsData(apiData: any[]): PcData[] {
  const availableCount = apiData.filter((pc) => pc.status).length;
  const occupiedCount = apiData.length - availableCount;

  return [
    {
      name: "Notebooks Disponibles",
      total: availableCount,
    },
    {
      name: "Notebooks Prestados",
      total: occupiedCount,
    },
  ];
}

export { mapLaboratoriesData, mapPcsData, formatedRut };
