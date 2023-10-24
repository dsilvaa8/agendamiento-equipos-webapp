import prismadb from "@/lib/prismadb";
import { LaboratoryColumn } from "./components/columns";
import { LaboratoryClient } from "./components/client";
import { getUser } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const user = getUser();

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  const laboratories = await prismadb.laboratory.findMany({
    orderBy: {
      number: "asc", // Ordenar por número en orden ascendente
    },
  });

  const formattedUsers: LaboratoryColumn[] = laboratories.map((item) => ({
    id: item.id,
    number: item.number.toString(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LaboratoryClient data={formattedUsers} />
      </div>
    </div>
  );
};

export default UsersPage;
