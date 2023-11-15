import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { JwtPayload } from "jsonwebtoken";

export const getUser = () => {
  const cookieStore = cookies();
  const secret: string = process.env.JWT_SECRET || "";
  const value: string | undefined = cookieStore.get("session")?.value;

  if (value) {
    const user = verify(value, secret) as JwtPayload;
    return user;
  } else {
    // Manejar el caso en que value es undefined
    return null; // O cualquier otro valor que desees devolver en este caso
  }
};
