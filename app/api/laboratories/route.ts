import { apiAuth } from "@/app/api/middlewares/apiAuth";
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const auth = await apiAuth(req);
  if (!auth) {
    return new NextResponse(JSON.stringify({ error: "No acavacabacacbac" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const laboratories = await prismadb.laboratory.findMany({
      include: {
        pcs: true,
      },
    });

    if (!laboratories) {
      return NextResponse.json({ status: 404 }, { headers: corsHeaders });
    }

    return NextResponse.json(laboratories);
  } catch (error) {
    console.error("Error al autenticar:", error);
    return NextResponse.json({ error: 500 }, { headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  const auth = await apiAuth(req);
  if (!auth) {
    return new NextResponse(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const laboratory = await prismadb.laboratory.create({});
    if (!laboratory) {
      return NextResponse.json({ status: 400 }, { headers: corsHeaders });
    }

    return NextResponse.json(laboratory, { headers: corsHeaders, status: 201 });
  } catch (error) {
    console.error("Error al autenticar:", error);
    return NextResponse.json({ headers: corsHeaders, status: 500 });
  }
}
