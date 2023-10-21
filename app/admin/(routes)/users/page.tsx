import prismadb from "@/lib/prismadb";
import { UsersColum } from "./components/columns";
import { UsersClient } from "./components/client";

const UsersPage = async () => {
  const users = await prismadb.user.findMany();

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
};

export default UsersPage;
