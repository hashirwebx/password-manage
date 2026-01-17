import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

type TokenPayload = {
  userId: string;
  email: string;
};

export const signToken = (payload: TokenPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET) as TokenPayload;

export const getAuthUser = () => {
  const token = cookies().get("pm_token")?.value;
  if (!token) {
    return null;
  }
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
};