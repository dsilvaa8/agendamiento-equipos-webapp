import Navbar from "@/components/navbar";
import { getUser } from "@/lib/serverUtils";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import DashboardPage from "./page";

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
      <DashboardPage user={user} />
    </>
  );
}
