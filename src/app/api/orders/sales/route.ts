import { jwtVerification, DecodedTokenReturn } from "@/components/user/auth";
import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const verificationResult = jwtVerification(authHeader);

  if (verificationResult instanceof NextResponse) return verificationResult;

  const auth: DecodedTokenReturn = verificationResult;
  const client = await pool.connect();

  try {
    if (!auth.username) {
      return NextResponse.json({ error: "No SellerId found" }, { status: 400 });
    }

    const orderQuery = `
        SELECT * FROM order_items
        WHERE productSeller = $1;
      `;
    const orderResult = await client.query(orderQuery, [auth.username]);

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "No Sales Made" }, { status: 404 });
    }

    return NextResponse.json(orderResult.rows, { status: 200 });
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
