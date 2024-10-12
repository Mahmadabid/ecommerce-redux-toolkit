import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import { Role } from "@/components/utils/utils";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const authHeader = request.headers.get("Authorization");
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
      jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { seller, img, name, quantity, price, userId } = await request.json();

    if (!quantity || !img || !seller || !price || !name || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkUserQuery = "SELECT role FROM users_table WHERE id = $1";
    const userResult = await client.query(checkUserQuery, [userId]);

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

    const checkUsernameQuery = "SELECT * FROM users_table WHERE username = $1";
    const existingUser = await client.query(checkUsernameQuery, [seller]);

    if (existingUser.rows.length === 0) {
      return NextResponse.json(
        { error: "User with this username does not exist" },
        { status: 404 }
      );
    }

    const insertUserQuery = `
    INSERT INTO products_table (seller, img, name, quantity, price)
    VALUES ($1, $2, $3, $4, $5)
  `;

    const values = [
        seller, img, name, quantity, price
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
