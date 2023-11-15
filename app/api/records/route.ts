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
    return new NextResponse(JSON.stringify({ error: "No autenticado" }), {
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
  const { user_rut, pc_code } = body;
  console.log(body);

  try {
    const student = await prismadb.user.findUnique({
      where: {
        rut: user_rut,
      },
    });

    const pc = await prismadb.pc.findUnique({
      where: {
        barcode: pc_code,
      },
    });

    if (pc) {
      if (student) {
        if (pc.status === true) {
          const studentRecords = await prismadb.record.findFirst({
            where: {
              user_rut, // El RUT del usuario que deseas verificar
              return_date: null,
            },
          });

          if (studentRecords) {
            if (
              studentRecords.pc_code === pc_code &&
              studentRecords.user_rut === user_rut
            ) {
              await prismadb.record.update({
                where: {
                  id: studentRecords.id,
                },
                data: {
                  return_date: new Date(),
                },
              });
              return NextResponse.json(
                { message: "Devolución exitosa" },
                {
                  headers: corsHeaders,
                  status: 200,
                }
              );
            }
            return NextResponse.json(
              { message: "Alumno tiene prestamos no devueltos" },
              {
                headers: corsHeaders,
                status: 200,
              }
            );
          } else {
            await prismadb.pc.update({
              where: {
                barcode: pc_code,
              },
              data: {
                status: false,
              },
            });

            await prismadb.record.create({
              data: {
                user_rut,
                pc_code,
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
          const record = await prismadb.record.findFirst({
            where: {
              user_rut,
              pc_code,
              return_date: null,
            },
            orderBy: {
              loan_date: "desc",
            },
          });

          if (record) {
            await prismadb.pc.update({
              where: {
                barcode: pc_code,
              },
              data: {
                status: true,
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
            return NextResponse.json(
              { message: "Notebook no disponible" },
              {
                headers: corsHeaders,
                status: 201,
              }
            );
          }
        }
      } else {
        const allUsers = await prismadb.user.findMany();
        const totalUsers = allUsers.length;

        const newStudent = await prismadb.user.create({
          data: {
            email: `estudiante${totalUsers + 1}@uandresbello.edu`,
            pass: "",
            rut: user_rut,
            name: "",
            role: "ESTUDIANTE",
          },
        });

        if (newStudent) {
          if (pc.status === true) {
            const studentRecords = await prismadb.record.findFirst({
              where: {
                user_rut, // El RUT del usuario que deseas verificar
                return_date: null,
              },
            });

            if (studentRecords) {
              if (
                studentRecords.pc_code === pc_code &&
                studentRecords.user_rut === user_rut
              ) {
                await prismadb.record.update({
                  where: {
                    id: studentRecords.id,
                  },
                  data: {
                    return_date: new Date(),
                  },
                });
                return NextResponse.json(
                  { message: "Devolución exitosa" },
                  {
                    headers: corsHeaders,
                    status: 200,
                  }
                );
              }
              return NextResponse.json(
                { message: "Alumno tiene prestamos no devueltos" },
                {
                  headers: corsHeaders,
                  status: 200,
                }
              );
            } else {
              await prismadb.pc.update({
                where: {
                  barcode: pc_code,
                },
                data: {
                  status: false,
                },
              });

              await prismadb.record.create({
                data: {
                  user_rut,
                  pc_code,
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
            const record = await prismadb.record.findFirst({
              where: {
                user_rut,
                pc_code,
                return_date: null,
              },
              orderBy: {
                loan_date: "desc",
              },
            });

            if (record) {
              await prismadb.pc.update({
                where: {
                  barcode: pc_code,
                },
                data: {
                  status: true,
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
              return NextResponse.json(
                { message: "Notebook no disponible" },
                {
                  headers: corsHeaders,
                  status: 201,
                }
              );
            }
          }
        } else {
          return NextResponse.json({ headers: corsHeaders, status: 400 });
        }
      }
    }
    return NextResponse.json(
      { message: "Notebook no encontrado" },
      { headers: corsHeaders, status: 404 }
    );
  } catch (error) {
    console.error("Error al autenticar:", error);
    return NextResponse.json({ error: 500 }, { headers: corsHeaders });
  }
}
