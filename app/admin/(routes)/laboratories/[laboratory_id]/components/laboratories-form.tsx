"use client";

import { Laboratory, Pc } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Card } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface LaboratoryFormProps {
  initialData: {
    id: string; // Asumiendo que el ID es una cadena (string)
    number: number;
    pcs: Pc[]; // Un arreglo de objetos de tipo Pc
  } | null;
}

const FormSchema = z.object({
  name: z.string(),
  model: z.string(),
  brand: z.string(),
  status: z.boolean(),
  laboratory_id: z.string().optional(),
});

export const LaboratoriesForm: React.FC<LaboratoryFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const [openPc, setOpenPc] = useState(false);
  const [initialDataPc, setInitialDataPc] = useState<Pc | null>(null);

  const pcTitle = initialDataPc ? "Editar Notebook" : "Crear Notebook";
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      model: "",
      brand: "",
      status: true,
      laboratory_id: "",
    },
  });

  if (initialDataPc) {
    form.setValue("name", initialDataPc?.name);
    form.setValue("model", initialDataPc?.model);
    form.setValue("brand", initialDataPc?.brand);
    form.setValue("status", initialDataPc?.status);
    form.setValue("laboratory_id", initialDataPc?.laboratory_id);
  }
  const resetDataPc = () => {
    form.setValue("name", "");
    form.setValue("model", "");
    form.setValue("brand", "");
    form.setValue("status", true);
    form.setValue("laboratory_id", "");
  };
  const setDataPc = (data: any) => {
    form.setValue("name", data.name);
    form.setValue("model", data.model);
    form.setValue("brand", data.brand);
    form.setValue("status", data.status);
    form.setValue("laboratory_id", data.laboratory_id);
  };

  const submitNotebook: any = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    try {
      if (initialDataPc) {
        await axios.patch(
          `/api/pcs/${initialDataPc.id}`,
          {
            name: data.name,
            model: data.model,
            brand: data.brand,
            status: data.status,
            laboratory_id: params.laboratory_id.toString(),
          },
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );
        setOpenPc(false);

        router.refresh();
        toast.success("Notebook Actualizado");

        resetDataPc();
      } else {
        resetDataPc();
        await axios.post(
          `/api/pcs`,
          {
            name: data.name,
            model: data.model,
            brand: data.brand,
            status: data.status,
            laboratory_id: params.laboratory_id.toString(),
          },
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );
        router.refresh();
        toast.success("Notebook creado");
        setOpenPc(false);

        resetDataPc();
      }
    } catch (error) {
      toast.error("Algo salió mal");
    }
    setLoading(false);
  };

  const handleDeletePc = async (pc: Pc) => {
    setLoading(true);

    try {
      await axios.delete(`/api/pcs/${pc.id}`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });
      router.refresh();
      toast.success("Notebook eliminado");
    } catch (error) {
      toast.error("Algo salió mal");
    }
    setLoading(false);
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar laboratorio" : "Crear laboratorio";
  const description = initialData
    ? "Editar un laboratorio."
    : "Agregar nuevo laboratorio";
  const toastMessage = initialData
    ? "laboratorio modificado."
    : "laboratorio creado.";
  const action = initialData ? "Guardar" : "Crear";

  const onSubmit = async () => {
    try {
      setLoading(true);

      await axios.post(
        `/api/laboratories`,
        { status: true },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

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
      await axios.delete(`/api/laboratories/${params.laboratory_id}`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });
      router.refresh();
      router.push(`/admin/laboratories`);
      toast.success("Laboratorio eliminado.");
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

      <div>
        {initialData && (
          <>
            <Separator />
            <div className="flex flex-col">
              <p>Laboratiorio: {initialData.number}</p>
              <p>Notebooks de este laboratorio:</p>
            </div>

            <AlertDialog open={openPc}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={loading}
                  className="w-full md:w-1/4"
                  onClick={() => {
                    resetDataPc();
                    setOpenPc(true);
                  }}
                >
                  Agregar notebook
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(submitNotebook)}
                    className="w-full space-y-6"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>{pcTitle}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                defaultChecked={initialDataPc?.status}
                              />
                              <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Estado del notebook (Disponible o no disponible)
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <AlertDialogFooter>
                      <Button
                        variant={"outline"}
                        className="w-full"
                        disabled={loading}
                        type="button"
                        onClick={() => {
                          setOpenPc(false);
                          setInitialDataPc(null);
                        }}
                      >
                        Cancelar
                      </Button>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        ) : initialDataPc ? (
                          "Guardar"
                        ) : (
                          "Crear"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex md:flex-row flex-col pt-5 pb-3 gap-3">
              {initialData.pcs.map((pc) => (
                <Card key={pc.id} className="p-5 w-full md:min-w-1/4 md:w-auto">
                  <div>
                    <div className="flex justify-between">
                      <p>Notebook:</p>
                    </div>
                    editar
                    <div className="flex flex-col py-3">
                      <p>Nombre: {pc.name}</p>
                      <p>Modelo: {pc.model}</p>
                      <p>Modelo: {pc.brand}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      disabled={loading}
                      className="w-full"
                      onClick={() => {
                        setOpenPc(true);
                        setInitialDataPc(pc);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      disabled={loading}
                      className="w-full"
                      onClick={() => {
                        setInitialDataPc(pc);
                        handleDeletePc(pc);
                      }}
                    >
                      {loading ? (
                        <ReloadIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        "Eliminar"
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <Separator />
      <div className="flex gap-3">
        <Button
          variant={"outline"}
          disabled={loading}
          type="button"
          onClick={() => {
            router.push("/admin/laboratories");
          }}
          className="w-full md:w-1/4"
        >
          Cancelar
        </Button>
      </div>
    </>
  );
};
