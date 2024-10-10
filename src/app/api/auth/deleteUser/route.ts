import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function DELETE(request: Request) {
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

    const { id, adminId } = await request.json();

    if (!id || !adminId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkIsAdminQuery = "SELECT role FROM users_table WHERE id = $1";
    const { rows: adminRows } = await client.query(checkIsAdminQuery, [
      adminId,
    ]);

    if (adminRows.length === 0 || adminRows[0].role !== "admin") {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    const checkUserQuery = "SELECT * FROM users_table WHERE id = $1";
    const { rows: userRows } = await client.query(checkUserQuery, [id]);

    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deleteUserQuery = `
    DELETE FROM users_table WHERE id = $1
  `;

    await client.query(deleteUserQuery, [id]);

    return NextResponse.json("User Deleted", { status: 201 });
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
