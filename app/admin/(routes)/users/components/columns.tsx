import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type UsersColum = {
  id: string;
  name: string;
  rut: string;
  email: string;
  role: string;
};

export const columns: ColumnDef<UsersColum>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "rut",
    header: "RUT",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Cargo",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
