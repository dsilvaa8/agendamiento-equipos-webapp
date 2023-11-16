"use client";

import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UsersColum } from "./columns";

interface CellActionProps {
  data: UsersColum;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/users/${data.id}`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });
      toast.success("Usuario eliminado.");
      router.refresh();
    } catch (error) {
      toast.error("Algo salió mal.");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id copiado.");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/auth/validateCookie");
        setUser(data.user);
      } catch (error) {
        toast.error("Error al obtener el usuario.");
      }
    };

    if (!user) {
      fetchData();
    }
  }, [user]);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4 cursor-pointer" />{" "}
            <p className="cursor-pointer">Copiar Id</p>
          </DropdownMenuItem>

          {user?.role !== "ENCARGADO" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/admin/users/${data.id}`)}
              >
                <Edit className="mr-2 h-4 w-4 cursor-pointer" />{" "}
                <p className="cursor-pointer">Editar</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash className="mr-2 h-4 w-4 cursor-pointer" />{" "}
                <p className="cursor-pointer"> Eliminar</p>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
