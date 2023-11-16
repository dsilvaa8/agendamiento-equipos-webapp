"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, LaboratoryColumn } from "./columns";

interface UsersClientProps {
  data: LaboratoryColumn[];
}

export const LaboratoryClient: React.FC<UsersClientProps> = async ({
  data,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Laboratorios (${data.length})`}
          description="Maneja los Laboratorios"
        />

        <Button onClick={() => router.push(`/admin/laboratories/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="id"
        searchPlaceHolder="Buscar laboratorio por numero"
        columns={columns}
        data={data}
      />
    </>
  );
};
