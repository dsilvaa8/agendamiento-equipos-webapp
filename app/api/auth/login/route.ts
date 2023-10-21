import prismadb from "@/lib/prismadb";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

const MAX_AGE = 60 * 60 * 3; // 3 horas en segundos

export async function POST(request: Request) {
  const body = await request.json();

  const { email, pass } = body;

  console.log(body);

  try {
    const user = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "No autorizado",
        },
        {
          status: 401,
        }
      );
    }

    const roles = ["ADMIN", "ENCARGADO", "JEFE"];

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        {
          message: "No autorizado",
        },
        {
          status: 401,
        }
      );
    }

    if (user.pass !== pass) {
      return NextResponse.json(
        {
          message: "Clave incorrecta",
        },
        {
          status: 409,
        }
      );
    }

    const secret = process.env.JWT_SECRET || "";

    const token = sign(
      {
        user,
      },
      secret,
      {
        expiresIn: MAX_AGE,
      }
    );

    const seralized = serialize("admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });

    const response = {
      message: "Authenticated!",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Set-Cookie": seralized },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error de servidor" }), {
      status: 500,
    });
  }
}
