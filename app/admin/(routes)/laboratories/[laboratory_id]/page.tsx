import prismadb from "@/lib/prismadb";

import { LaboratoriesForm } from "./components/laboratories-form";

const UsersPage = async ({ params }: { params: { laboratory_id: string } }) => {
  const laboratory = await prismadb.laboratory.findUnique({
    where: {
      id: Number(params.laboratory_id),
    },
    include: {
      pcs: true,
    },
  });

  console.log(laboratory);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LaboratoriesForm initialData={laboratory} />
      </div>
    </div>
  );
};

export default UsersPage;
