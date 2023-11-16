import prismadb from "@/lib/prismadb";
import { LaboratoryClient } from "./components/client";
import { LaboratoryColumn } from "./components/columns";

const LaboratoriesPage = async () => {
  const laboratories = await prismadb.laboratory.findMany({
    orderBy: {
      number: "asc", // Ordenar por número en orden ascendente
    },
  });

  const formattedLaboratories: LaboratoryColumn[] = laboratories.map(
    (item) => ({
      id: item.id,
      number: item.number.toString(),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LaboratoryClient data={formattedLaboratories} />
      </div>
    </div>
  );
};

export default LaboratoriesPage;
