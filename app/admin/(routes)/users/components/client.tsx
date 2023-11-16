"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, UsersColum } from "./columns";
import axios from "axios";

interface UsersClientProps {
  data: UsersColum[];
  user: any;
}

export const UsersClient: React.FC<UsersClientProps> = ({ data, user }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Usuarios (${data.length})`}
          description="Maneja los usuarios"
        />
        {user?.role !== "ENCARGADO" && (
          <Button onClick={() => router.push(`/admin/users/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="rut"
        searchPlaceHolder="Buscar usuario por rut"
        columns={columns}
        data={data}
      />
    </>
  );
};
