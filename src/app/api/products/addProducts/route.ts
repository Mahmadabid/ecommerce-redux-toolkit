import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import { Role } from "@/components/utils/utils";
import { jwtVerification, DecodedTokenReturn } from "@/components/user/auth";

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const authHeader = request.headers.get("Authorization");
    const verificationResult = jwtVerification(authHeader);

    if (verificationResult instanceof NextResponse) return verificationResult;

    const auth: DecodedTokenReturn = verificationResult;

    const { img, name, quantity, price} = await request.json();

    if (!quantity || !img || !price || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkUserQuery = "SELECT role FROM users_table WHERE id = $1";
    const userResult = await client.query(checkUserQuery, [auth.id]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User with this ID does not exist" },
        { status: 404 }
      );
    }

    const userRole = userResult.rows[0].role;

    if (!(userRole === Role.seller || userRole === Role.admin)) {
      return NextResponse.json(
        { error: "You must be a seller or admin to add products" },
        { status: 401 }
      );
    }

    const insertUserQuery = `
    INSERT INTO products_table (seller, img, name, quantity, price)
    VALUES ($1, $2, $3, $4, $5)
  `;

    const values = [
        auth.username, img, name, quantity, price
    ];
    await client.query(insertUserQuery, values);

    return NextResponse.json(
      'Added Product',
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
