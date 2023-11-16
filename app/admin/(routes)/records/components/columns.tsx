"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type RecordsColumn = {
  id: string;
  loan_date: any;
  return_date: any;
  rut: string;
  barcode: string;
};

export const columns: ColumnDef<RecordsColumn>[] = [
  {
    accessorKey: "loan_date",
    header: "Fecha prestamo",
  },
  {
    accessorKey: "return_date",
    header: "Fecha devolución",
  },
  {
    accessorKey: "rut",
    header: "Rut Alumno",
  },
  {
    accessorKey: "barcode",
    header: "Código Notebook",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
