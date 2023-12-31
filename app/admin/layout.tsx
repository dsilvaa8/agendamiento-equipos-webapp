import Navbar from "@/components/navbar";
import { getUser } from "@/lib/serverUtils";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  console.log(user);

  if (!user) {
    redirect("/");
  }
  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
