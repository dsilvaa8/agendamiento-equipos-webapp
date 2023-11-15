"use client";

import { Pc, User } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ReloadIcon } from "@radix-ui/react-icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatedRut } from "@/lib/utils";

interface RecordsFormProps {
  initialData: {
    id: string; // Asumiendo que el ID es una cadena (string)
    loan_date: any;
    return_date: any;
    user: User;
    pc: Pc; // Un arreglo de objetos de tipo Pc
  } | null;
}

const FormSchema = z.object({
  user_rut: z.string(),
  pc_code: z.string(),
});

export const RecordsForm: React.FC<RecordsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData
      ? {
          user_rut: initialData?.user.rut,
          pc_code: initialData?.pc.barcode,
        }
      : {
          user_rut: "",
          pc_code: "",
        },
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Generar o devolver prestamo";
  const description =
    "Si el notebook esta prestado entonces se actalizara el prestamo como devuelto";

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);

      const prestamo = await axios.post(
        `/api/records`,
        {
          user_rut: data.user_rut,
          pc_code: data.pc_code,
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      router.refresh();
      //router.push(`/admin/records`);
      form.reset();
      toast.success(prestamo.data.message);
    } catch (error: any) {
      toast.error("Algo salió mal.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/records/${params.record_id}`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });
      router.refresh();
      router.push(`/admin/records`);
      toast.success("Registro eliminado.");
    } catch (error: any) {
      toast.error("Algo salió mal.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleInputChangeRut = (event: any) => {
    const { value } = event.target;

    form.setValue("user_rut", formatedRut(value));
    //console.log(form.getValues());
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="user_rut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUT</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="RUT"
                      type="text"
                      {...field}
                      onChange={handleInputChangeRut}
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pc_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo Notebook</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="293910..."
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-3">
            <Button
              disabled={loading}
              type="button"
              onClick={() => {
                router.push("/admin/records");
              }}
            >
              Volver
            </Button>

            <Button disabled={loading} type="submit">
              {loading ? (
                <ReloadIcon className="h-4 w-4 animate-spin" />
              ) : (
                "Generar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
