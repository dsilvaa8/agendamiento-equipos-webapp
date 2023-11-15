"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type RecordsColumn = {
  id: string;
  loan_date: string;
  return_date: any;
  user: string;
  pc: string;
};

export const columns: ColumnDef<RecordsColumn>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "loan_date",
    header: "Fecha prestamo",
  },
  {
    accessorKey: "return_date",
    header: "Fecha devolución",
  },
  {
    accessorKey: "user",
    header: "Rut Alumno",
  },
  {
    accessorKey: "pc",
    header: "Notebook",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
