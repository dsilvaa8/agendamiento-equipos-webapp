import prismadb from "@/lib/prismadb";

import { UsersForm } from "./components/users-form";
import { getUser } from "@/lib/serverUtils";

const UsersPage = async ({ params }: { params: { userId: string } }) => {
  const users = await prismadb.user.findUnique({
    where: {
      id: params.userId,
    },
  });
  const user = getUser();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UsersForm initialData={users} user={user} />
      </div>
    </div>
  );
};

export default UsersPage;
