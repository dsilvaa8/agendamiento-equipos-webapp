"use client";

import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  pass: z.string(),
});

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AlertDestructive } from "@/components/alert-destructive";

export default function LoginCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, isOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      pass: "",
    },
  });

  const onLogin = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", values);

      const data = await response.data;

      if (data.status === 200) {
        return router.push("/admin/home");
      }
    } catch (e: any) {
      console.log(e.request.status);
      if (e.request.status === 401) {
        setMsg("No autorizado");
        isOpen(true);
      }

      if (e.request.status === 409) {
        setMsg("Clave incorrecta");
        isOpen(true);
      }
    }
    setLoading(false);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card>
        <div className="w-full">
          <AlertDestructive msg={msg} Open={open} />
        </div>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Ingrese sus datos</CardTitle>
          <CardDescription>
            La cuenta debe estar registrada en la base de datos
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)} className="space-y-8">
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="contraseña"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                ) : (
                  "Ingressar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
