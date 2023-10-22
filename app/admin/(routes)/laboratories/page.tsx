import prismadb from "@/lib/prismadb";
import { LaboratoryColumn } from "./components/columns";
import { LaboratoryClient } from "./components/client";

const UsersPage = async () => {
  const laboratories = await prismadb.laboratory.findMany();

  const formattedUsers: LaboratoryColumn[] = laboratories.map((item) => ({
    id: item.id.toString(),
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
