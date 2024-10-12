import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "../utils/utils";

export interface DecodedTokenReturn {
  email: string;
  id: string;
  username: string;
  role: Role;
}

export const jwtVerification = (
  authHeader: string | null
): DecodedTokenReturn | NextResponse => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("JWT Secret is not defined");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

    const { email, id, username, role } = decodedToken as DecodedTokenReturn;

    return { email, id, username, role };
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
};
