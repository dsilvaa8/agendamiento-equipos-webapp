"use client";

import Navbar from "@/components/navbar";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../loading";

interface UserResponse {
  data: any | null;
  error: AxiosError | null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [currentUser, setUser] = useState({});
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      const { data, error } = await getUser();

      if (error) {
        push("/");
        return;
      }
      setIsSuccess(true);
      setUser(data.user);
    })();
  }, [push]);

  if (!isSuccess) {
    return <Loading />;
  }

  return (
    <>
      <Navbar user={currentUser} />
      {children}
    </>
  );
}

async function getUser(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/api/auth/validateCookie");

    return {
      data,
      error: null,
    };
  } catch (e) {
    const error = e as AxiosError;

    return {
      data: null,
      error,
    };
  }
}
