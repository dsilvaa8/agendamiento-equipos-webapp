"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, UsersColum } from "./columns";

interface UsersClientProps {
  data: UsersColum[];
}

export const UsersClient: React.FC<UsersClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
 
        <Heading
          title={`Usuarios (${data.length})`}
          description="Maneja los usuarios"
        />
        <Button onClick={() => router.push(`/admin/users/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        searchPlaceHolder="Buscar usuario por nombre"
        columns={columns}
        data={data}
      />
      <Separator />
    </>
  );
};
