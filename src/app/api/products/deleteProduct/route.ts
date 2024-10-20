import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import { Role } from "@/components/utils/utils";
import { DecodedTokenReturn, jwtVerification } from "@/components/user/auth";

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  const client = await pool.connect();

  try {
    const authHeader = request.headers.get("Authorization");
    const verificationResult = jwtVerification(authHeader);

    if (verificationResult instanceof NextResponse) return verificationResult;

    const auth: DecodedTokenReturn = verificationResult;

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkUserRoleQuery = `SELECT role FROM users_table WHERE id = $1`;
    const checkSellerQuery = `SELECT seller FROM products_table WHERE id = $1`;

    const { rows: userRows } = await client.query(checkUserRoleQuery, [auth.id]);
    const { rows: productRows } = await client.query(checkSellerQuery, [productId]);

    if (
      userRows.length === 0 ||
      productRows.length === 0 ||
      !(userRows[0].role === Role.admin || userRows[0].role === Role.seller) || productRows[0].seller !== auth.username
    ) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    const deleteProductQuery = `
      DELETE FROM products_table 
      WHERE id = $1 
      RETURNING id
    `;

    const { rows: deletedProduct } = await client.query(deleteProductQuery, [
      productId,
    ]);

    if (deletedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json("ProductDeleted", { status: 201 });
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
