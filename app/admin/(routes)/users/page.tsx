import prismadb from "@/lib/prismadb";
import { UsersColum } from "./components/columns";
import { UsersClient } from "./components/client";
import { getUser } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const user = getUser();

  if (user.role === "ADMIN") {
    const users = await prismadb.user.findMany();
    if (!users) {
      return null;
    }
    const formattedUsers: UsersColum[] = users.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      rut: item.rut,
      role: item.role,
    }));
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <UsersClient data={formattedUsers} />
        </div>
      </div>
    );
  }

  if (user.role === "JEFE") {
    const users = await prismadb.user.findMany({
      where: {
        role: "ENCARGADO",
      },
    });
    if (!users) {
      return null;
    }
    const formattedUsers: UsersColum[] = users.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      rut: item.rut,
      role: item.role,
    }));
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <UsersClient data={formattedUsers} />
        </div>
      </div>
    );
  }
  if (user.role === "ENCARGADO") {
    const users = await prismadb.user.findMany({
      where: {
        role: "ESTUDIANTE",
      },
    });
    if (!users) {
      return null;
    }
    const formattedUsers: UsersColum[] = users.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      rut: item.rut,
      role: item.role,
    }));
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <UsersClient data={formattedUsers} />
        </div>
      </div>
    );
  }
};

export default UsersPage;
