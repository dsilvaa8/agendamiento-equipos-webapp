import prismadb from "@/lib/prismadb";
import { RecordsColumn } from "./components/columns";
import { RecordsClient } from "./components/client";
import { getUser } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

const RecordsPage = async () => {
  const user = getUser();

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  const records = await prismadb.record.findMany({
    orderBy: {
      loan_date: "desc", // Ordenar por número en orden ascendente
    },
    include: {
      user: true,
      pc: true,
    },
  });

  const formattedRecords: RecordsColumn[] = records.map((item) => ({
    id: item.id,
    loan_date: formatDate(item.loan_date),
    return_date:
      item.return_date !== null ? formatDate(item.return_date) : "No devuelto",
    user: item.user.rut,
    pc: item.pc.name,
  }));

  function formatDate(date: Date | null): string {
    if (date === null) {
      return "No devuelto";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Intl.DateTimeFormat("es-ES", options).format(date);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RecordsClient data={formattedRecords} />
      </div>
    </div>
  );
};

export default RecordsPage;
