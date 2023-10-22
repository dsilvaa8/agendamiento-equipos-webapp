"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Laboratory } from "@prisma/client";
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

interface LaboratoryFormProps {
  initialData: Laboratory | null;
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

      <div className="flex gap-3">
        <Button
          disabled={loading}
          type="button"
          onClick={() => {
            router.push("/admin/laboratories");
          }}
        >
          Cancelar
        </Button>

        <Button disabled={loading} onClick={onSubmit}>
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
