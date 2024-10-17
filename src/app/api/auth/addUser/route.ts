import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Role } from "@/components/utils/utils";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const {
      username,
      email,
      password,
      role,
      name = "",
      city = "",
      zipcode = "",
      address = "",
      country = "",
    } = await request.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!(role === Role.seller || role === Role.buyer)) {
      return NextResponse.json(
        { error: "You can only add buyer and seller" },
        { status: 401 }
      );
    }

    const checkUserQuery =
      "SELECT * FROM users_table WHERE email = $1 OR username = $2";
    const existingUser = await client.query(checkUserQuery, [email, username]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
    INSERT INTO users_table (username, email, password, role, name, city, zipcode, address, country)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, username, email, role
  `;

    const values = [
      username,
      email,
      hashedPassword,
      role,
      name,
      city,
      zipcode,
      address,
      country,
    ];
    const newUser = await client.query(insertUserQuery, values);

    const { id, role: userRole } = newUser.rows[0];

    return NextResponse.json(
      { id, username, email, role: userRole },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
