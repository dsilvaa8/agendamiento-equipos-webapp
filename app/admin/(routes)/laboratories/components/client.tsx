"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, LaboratoryColumn } from "./columns";
import axios from "axios";

interface UsersClientProps {
  data: LaboratoryColumn[];
}

export const LaboratoryClient: React.FC<UsersClientProps> = async ({
  data,
}) => {
  const router = useRouter();
  const getUser = async () => {
    const { data } = await axios.get("/api/auth/validateCookie");
    return data.user;
  };
  const user = await getUser();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Laboratorios (${data.length})`}
          description="Maneja los Laboratorios"
        />
        {user.role === "JEFE" && (
          <Button onClick={() => router.push(`/admin/laboratories/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="id"
        searchPlaceHolder="Buscar laboratorio por id"
        columns={columns}
        data={data}
      />
      <Separator />
    </>
  );
};
