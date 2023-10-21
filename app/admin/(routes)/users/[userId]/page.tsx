import prismadb from "@/lib/prismadb";

import { UsersForm } from "./components/users-form";

const UsersPage = async ({ params }: { params: { userId: string } }) => {
  const users = await prismadb.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  console.log(users);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UsersForm initialData={users} />
      </div>
    </div>
  );
};

export default UsersPage;
