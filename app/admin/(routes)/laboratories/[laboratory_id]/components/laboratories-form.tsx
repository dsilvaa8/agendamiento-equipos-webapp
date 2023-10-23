"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Laboratory, Pc } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";

interface LaboratoryFormProps {
  initialData: {
    id: string; // Asumiendo que el ID es una cadena (string)
    pcs: Pc[]; // Un arreglo de objetos de tipo Pc
  } | null;
}

export const LaboratoriesForm: React.FC<LaboratoryFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  console.log(initialData);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar laboratorio" : "Crear laboratorio";
  const description = initialData
    ? "Editar un laboratorio."
    : "Agregar nuevo laboratorio";
  const toastMessage = initialData
    ? "laboratorio modificado."
    : "laboratorio creado.";
  const action = initialData ? "Guardar cambios" : "Crear";

  const onSubmit = async () => {
    try {
      setLoading(true);

      await axios.post(`/api/laboratories`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });

      router.refresh();
      router.push(`/admin/laboratories`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Algo salió mal.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/laboratories/${params.Laboratory_id}`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });
      router.refresh();
      router.push(`/admin/laboratories`);
      toast.success("Usuario eliminado.");
    } catch (error: any) {
      toast.error("Algo salió mal.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div>
        <div className="flex flex-col">
          <p>Laboratiorio: {initialData?.number}</p>
          <p>Notebooks de este laboratorio:</p>
        </div>

        <div className="flex md:flex-row flex-col pt-5 pb-3 gap-3">
          {initialData?.pcs.map((pc) => (
            <Card key={pc.id} className="p-5 w-full md:min-w-1/4 md:w-auto">
              <div className="flex gap-4">
                <div>
                  <div className="flex justify-between">
                    <p>Notebook:</p>
                  </div>
                  <div className="flex flex-col py-3">
                    <p>Nombre: {pc.name}</p>
                    <p>Modelo: {pc.model}</p>
                    <p>Modelo: {pc.brand}</p>
                  </div>
                </div>
                <div>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRANj8e9TV6A-RXuvMZ4zXJvuEMCei6T_mylw"
                    alt="img"
                    className="aspect-ratio-1/1 w-[110px]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="w-full">Editar</Button>
                <Button className="w-full">Eliminar</Button>
              </div>
            </Card>
          ))}
        </div>
        <Button className="w-full md:w-1/4">Agregar notebook</Button>
      </div>
      <Separator />
      <div className="flex gap-3">
        <Button
          disabled={loading}
          type="button"
          onClick={() => {
            router.push("/admin/laboratories");
          }}
          className="w-full md:w-1/4"
        >
          Cancelar
        </Button>

        <Button
          disabled={loading}
          onClick={onSubmit}
          className="w-full md:w-1/4"
        >
          {loading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            action
          )}
        </Button>
      </div>
    </>
  );
};
