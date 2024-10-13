import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import { jwtVerification, DecodedTokenReturn } from "@/components/user/auth";

export async function DELETE(request: Request) {
  const client = await pool.connect();

  try {
    const authHeader = request.headers.get("Authorization");
    const verificationResult = jwtVerification(authHeader);

    if (verificationResult instanceof NextResponse) return verificationResult;

    const auth: DecodedTokenReturn = verificationResult;

    const { userId } = await request.json();

    const fetchAdminQuery = "SELECT id FROM users_table WHERE role = 'admin'";
    const { rows: fetchAdmin } = await client.query(fetchAdminQuery);

    if (fetchAdmin.length === 0 || fetchAdmin[0].id !== auth.id) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    if (fetchAdmin[0].id === userId) {
      return NextResponse.json(
        { error: "Cannot delete Admin" },
        { status: 403 }
      );
    }

    const deleteUserQuery = `
    DELETE FROM users_table 
    WHERE id = $1 
    RETURNING username
    `;

    const { rows: deletedUser } = await client.query(deleteUserQuery, [userId]);

    if (deletedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deleteProductsQuery = `
    DELETE FROM products_table WHERE seller = $1 
  `;

    await client.query(deleteProductsQuery, [deletedUser[0].username]);

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
