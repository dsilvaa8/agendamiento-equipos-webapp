import { NextRequest, NextResponse } from "next/server";

export async function apiAuth(req: NextRequest) {
  // Tu lógica de autenticación aquí
  console.log(req.headers.get("authorization"));
  if (
    req.headers.get("authorization") ===
    process.env.NEXT_PUBLIC_API_ACCESS_TOKEN
  ) {
    // Continuar con la ejecución de la ruta POST
    return true;
  } else {
    // No autenticado, devolver una respuesta de error 401
    return false;
  }
}
