"use client";

import Navbar from "@/components/navbar";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../loading";

interface UserResponse {
  user: any | null;
  error: AxiosError | null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isUser, setUser] = useState([{}]);
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        push("/");
        return;
      }
      setIsSuccess(true);
      setUser(user);
    })();
  }, [push]);

  if (!isSuccess) {
    return <Loading />;
  }

  return (
    <>
      <Navbar user={isUser}/>
      {children}
    </>
  );
}

async function getUser(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/api/auth/validateCookie");

    return {
      user: data,
      error: null,
    };
  } catch (e) {
    const error = e as AxiosError;

    return {
      user: null,
      error,
    };
  }
}
