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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  barcode: z.string(),
  name: z.string(),
  model: z.string(),
  brand: z.string(),
  status: z.string(),
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
  });

  function setDataPc(initialDataPc: any) {
    form.setValue("barcode", initialDataPc?.barcode);
    form.setValue("name", initialDataPc?.name);
    form.setValue("model", initialDataPc?.model);
    form.setValue("brand", initialDataPc?.brand);
    form.setValue("status", initialDataPc?.status.toString());
    form.setValue("laboratory_id", initialDataPc?.laboratory_id);
  }

  function resetForm() {
    setInitialDataPc(null);
    form.reset();
  }

  const handleCreateNotebook: any = async () => {
    setLoading(true);

    try {
      await axios.post(
        `/api/pcs`,
        {
          barcode: form.getValues("barcode"),
          name: form.getValues("name"),
          model: form.getValues("model"),
          brand: form.getValues("brand"),
          status: form.getValues("status") === "1" ? true : false,
          laboratory_id: params.laboratory_id.toString(),
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      resetForm();
      setOpenPc(false);

      router.refresh();

      toast.success("Notebook creado");
    } catch (error) {
      toast.error("Algo salió mal");
    }
    setLoading(false);
  };

  const submitNotebook: any = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    console.log(data);

    try {
      if (initialDataPc) {
        await axios.patch(
          `/api/pcs/${initialDataPc.id}`,
          {
            barcode: data.barcode,
            name: data.name,
            model: data.model,
            brand: data.brand,
            status: data.status === "1" ? true : false,
            laboratory_id: params.laboratory_id.toString(),
          },
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );
        resetForm();
        setOpenPc(false);

        router.refresh();
        toast.success("Notebook Actualizado");
      } else {
        await axios.post(
          `/api/pcs`,
          {
            barcode: data.barcode,
            name: data.name,
            model: data.model,
            brand: data.brand,
            status: data.status === "1" ? true : false,
            laboratory_id: params.laboratory_id.toString(),
          },
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );
        resetForm();
        setOpenPc(false);

        router.refresh();

        toast.success("Notebook creado");
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

      resetForm();
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
              <Button
                disabled={loading}
                className="w-full md:w-1/4"
                onClick={() => {
                  resetForm();
                  setOpenPc(true);
                }}
              >
                Agregar notebook
              </Button>
              <AlertDialogContent>
                <Form {...form}>
                  <form
                    className="w-full space-y-6"
                    onSubmit={form.handleSubmit(submitNotebook)}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>{pcTitle}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codigo de barras</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              {...field}
                              onKeyDown={(e) => {
                                // Previene el envío cuando se presiona "Enter"
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input disabled={loading} {...field} />
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
                            <Input disabled={loading} {...field} />
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
                            <Input disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            defaultValue={
                              initialDataPc
                                ? field.value.toString() === "true"
                                  ? "1"
                                  : "0"
                                : "1"
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Disponible</SelectItem>
                              <SelectItem value="0">No Disponible</SelectItem>
                            </SelectContent>
                          </Select>
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
                          resetForm();
                        }}
                      >
                        Cancelar
                      </Button>

                      {initialDataPc ? (
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "Guardar"
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled={loading}
                          className="w-full"
                          onClick={() => {
                            handleCreateNotebook();
                          }}
                        >
                          {loading ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "Crear"
                          )}
                        </Button>
                      )}
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

                    <div className="flex flex-col py-3">
                      <p>Código: {pc.barcode}</p>
                      <p>Nombre: {pc.name}</p>
                      <p>Modelo: {pc.model}</p>
                      <p>Marca: {pc.brand}</p>
                      <p>
                        Estado: {pc.status ? "Disponible" : "No Disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      disabled={loading}
                      className="w-full"
                      onClick={() => {
                        setDataPc(pc);
                        setInitialDataPc(pc);
                        setOpenPc(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      disabled={loading}
                      className="w-full"
                      onClick={() => {
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
      {initialData && (
        <Button
          variant={"outline"}
          disabled={loading}
          type="button"
          onClick={() => {
            router.push("/admin/laboratories");
          }}
          className="w-full md:w-1/4"
        >
          Volver
        </Button>
      )}
      {initialData === null && (
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

          <Button
            type="button"
            disabled={loading}
            className="w-1/3"
            onClick={() => {
              onSubmit();
            }}
          >
            {loading ? (
              <ReloadIcon className="h-4 w-4 animate-spin" />
            ) : (
              "Crear laboratorio"
            )}
          </Button>
        </div>
      )}
    </>
  );
};
