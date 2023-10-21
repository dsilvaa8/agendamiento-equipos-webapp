import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // Always check this
    const secret = process.env.JWT_SECRET || "";

    const token = sign(
      {
        logout: "logout",
      },
      secret,
      {
        expiresIn: -1,
      }
    );

    const seralized = serialize("admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: -1,
      path: "/",
    });

    const response = {
      message: "Logging out!",
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
