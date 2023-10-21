export type Role = "JEFE" | "ADMIN" | "ENCARGADO" | "ESTUDIANTE";

// Modelo para la tabla "Users"
export interface User {
  id: string;
  email: string;
  pass: string;
  rut: string;
  name: string;
  created_at: Date;
  records: Record[];
  role: Role;
}

// Modelo para la tabla "Pcs"
export interface Pc {
  id: string;
  name: string;
  model: string;
  brand: string;
  status: number;
  created_at: Date;
  records: Record[];
}

// Modelo para la tabla de relación "Records"
export interface Record {
  id: string;
  loan_date: Date;
  return_date: Date | null;
  user_id: string;
  user: User;
  pc_id: string;
  pc: Pc;
}
