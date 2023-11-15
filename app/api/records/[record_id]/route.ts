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

export async function GET(
  req: NextRequest,
  { params }: { params: { record_id: string } }
) {
  const auth = await apiAuth(req);
  if (!auth) {
    return new NextResponse(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();

  try {
    const record = await prismadb.record.findUnique({
      where: { id: params.record_id },
    });
    if (!record) {
      return NextResponse.json({ status: 404 }, { headers: corsHeaders });
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error al autenticar:", error);
    return NextResponse.json({ error: 500 }, { headers: corsHeaders });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { record_id: string } }
) {
  const auth = await apiAuth(req);
  if (!auth) {
    return new NextResponse(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  const { return_date } = body;

  try {
    const record = await prismadb.record.update({
      where: { id: params.record_id },
      data: {
        return_date,
      },
    });

    if (!record) {
      return NextResponse.json({ status: 404 }, { headers: corsHeaders });
    }

    return NextResponse.json({ status: 201 }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error al autenticar:", error);
    return NextResponse.json({ error: 500 }, { headers: corsHeaders });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { record_id: string } }
) {
  const auth = await apiAuth(req);
  if (!auth) {
    return new NextResponse(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const record = await prismadb.record.delete({
      where: { id: params.record_id },
    });

    if (!record) {
      return NextResponse.json({ status: 404 }, { headers: corsHeaders });
    }

    return NextResponse.json({ status: 201 }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error al autenticar:", error);
    return NextResponse.json({ error: 500 }, { headers: corsHeaders });
  }
}
