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
    const records = await prismadb.record.findMany();

    if (!records) {
      return NextResponse.json({ status: 404 }, { headers: corsHeaders });
    }

    return NextResponse.json(records);
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

  const body = await req.json();
  const { user_rut, pc_id } = body;
  console.log(body);

  try {
    const student = await prismadb.user.findUnique({
      where: {
        rut: user_rut,
      },
    });

    const pc = await prismadb.pc.findUnique({
      where: {
        id: pc_id,
      },
    });

    if (pc) {
      if (student) {
        if (pc.status === false) {
          await prismadb.pc.update({
            where: {
              id: pc_id,
            },
            data: {
              status: true,
            },
          });

          const record = await prismadb.record.findFirst({
            where: {
              user_rut,
              pc_id,
            },
            orderBy: {
              loan_date: "desc",
            },
          });

          await prismadb.record.update({
            where: {
              id: record?.id,
            },
            data: {
              return_date: new Date(),
            },
          });

          return NextResponse.json(
            { message: "Devolución exitosa" },
            {
              headers: corsHeaders,
              status: 201,
            }
          );
        } else {
          await prismadb.pc.update({
            where: {
              id: pc_id,
            },
            data: {
              status: false,
            },
          });
          const record = await prismadb.record.create({
            data: {
              user_rut,
              pc_id,
            },
          });

          return NextResponse.json(
            { message: "Prestamo generado" },
            {
              headers: corsHeaders,
              status: 201,
            }
          );
        }
      } else {
        const newStudent = await prismadb.user.create({
          data: {
            email: "",
            pass: "",
            rut: user_rut,
            name: "",
            role: "ESTUDIANTE",
          },
        });

        if (newStudent) {
          if (pc.status === false) {
            await prismadb.pc.update({
              where: {
                id: pc_id,
              },
              data: {
                status: true,
              },
            });

            const record = await prismadb.record.findFirst({
              where: {
                user_rut,
                pc_id,
              },
              orderBy: {
                loan_date: "desc",
              },
            });

            await prismadb.record.update({
              where: {
                id: record?.id,
              },
              data: {
                return_date: new Date(),
              },
            });

            return NextResponse.json(
              { message: "Devolución exitosa" },
              {
                headers: corsHeaders,
                status: 201,
              }
            );
          } else {
            await prismadb.pc.update({
              where: {
                id: pc_id,
              },
              data: {
                status: false,
              },
            });

            const record = await prismadb.record.create({
              data: {
                user_rut,
                pc_id,
              },
            });

            return NextResponse.json(
              { message: "Prestamo generado" },
              {
                headers: corsHeaders,
                status: 201,
              }
            );
          }
        } else {
          return NextResponse.json({ status: 400 }, { headers: corsHeaders });
        }
      }
    }
    return NextResponse.json({ status: 404 }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error al autenticar:", error);
    return NextResponse.json({ error: 500 }, { headers: corsHeaders });
  }
}
