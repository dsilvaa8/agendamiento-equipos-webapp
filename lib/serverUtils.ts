import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
export const getUser = () => {
  const cookieStore = cookies();
  const secret = process.env.JWT_SECRET || "";
  const value = cookieStore.get("session")?.value;

  const user = verify(value, secret);
  return user;
};
