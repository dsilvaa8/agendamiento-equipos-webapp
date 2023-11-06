import { getUser } from "@/lib/serverUtils";
import { Overview } from "@/components/overview";

const DashboardPage = () => {
  const user = getUser();

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-between gap-3 py-5">
      <h2>Bienvenido {user.name}</h2>

      <Overview />
    </div>
  );
};

export default DashboardPage;
