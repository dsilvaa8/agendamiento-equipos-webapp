"use client";
import { Overview } from "@/components/overview";
import { fetchLaboratoriesData, fetchPcsData } from "@/app/actions/fetchData";
import { mapLaboratoriesData, mapPcsData } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = async () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/auth/validateCookie");
        setUser(data.user);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (!user) {
      fetchData();
    }
  }, [user]);

  // Llama a las funciones para obtener los datos de laboratorios y PCs
  const apiLaboratoriesData = await fetchLaboratoriesData();
  const apiPcsData = await fetchPcsData();

  // Mapea los datos de la API al formato deseado utilizando las funciones mapLaboratoriesData y mapPcsData
  const laboratoriesData = mapLaboratoriesData(apiLaboratoriesData);
  const pcsData = mapPcsData(apiPcsData);

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-between gap-3 py-5">
      <h2>Bienvenido {user?.name}</h2>
      <div className="flex p-10 w-full gap-5">
        <Overview data={pcsData} title="Notebooks" />
        <Overview data={laboratoriesData} title="Laboratorios" />
      </div>
    </div>
  );
};

export default DashboardPage;
