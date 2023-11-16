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
}

export const UsersClient: React.FC<UsersClientProps> = ({ data }) => {
  const router = useRouter();
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
        searchKey="name"
        searchPlaceHolder="Buscar usuario por nombre"
        columns={columns}
        data={data}
      />
    </>
  );
};
