import prismadb from "@/lib/prismadb";

import { RecordsForm } from "./components/records-form";
import { getUser } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

const UsersPage = async ({ params }: { params: { record_id: string } }) => {
  const user = getUser();
  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  const record = await prismadb.record.findUnique({
    where: {
      id: params.record_id,
    },
    include: {
      user: true,
      pc: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RecordsForm initialData={record} />
      </div>
    </div>
  );
};

export default UsersPage;
