"use client";
import { fetchLaboratoriesData, fetchPcsData } from "@/app/actions/fetchData";
import { Overview } from "@/components/overview";
import { mapLaboratoriesData, mapPcsData } from "@/lib/utils";

const DashboardPage = async ({ user }: any) => {
  // Llama a las funciones para obtener los datos de laboratorios y PCs
  const apiLaboratoriesData = await fetchLaboratoriesData();
  const apiPcsData = await fetchPcsData();

  // Mapea los datos de la API al formato deseado utilizando las funciones mapLaboratoriesData y mapPcsData
  const laboratoriesData = mapLaboratoriesData(apiLaboratoriesData);
  const pcsData = mapPcsData(apiPcsData);

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-between gap-3 py-5">
      <h2>Bienvenido {user.name}</h2>
      <div className="flex md:flex-row flex-col p-10 w-full gap-5">
        <Overview data={pcsData} title="Notebooks" />
        <Overview data={laboratoriesData} title="Laboratorios" />
      </div>
    </div>
  );
};

export default DashboardPage;
