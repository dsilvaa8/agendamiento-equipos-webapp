import { getUser } from "@/lib/serverUtils";

const DashboardPage = () => {
  const user = getUser();

  return (
    <div className="h-auto min-h-screen mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
      <h2>Bienvenido {user.name}</h2>
    </div>
  );
};

export default DashboardPage;
