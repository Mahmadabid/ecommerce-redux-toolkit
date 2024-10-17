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
    if (!auth.id) {
      return NextResponse.json({ error: "No BuyerId found" }, { status: 400 });
    }

    const orderQuery = `
        SELECT id, created_at FROM orders_table
        WHERE buyerid = $1;
      `;
    const orderResult = await client.query(orderQuery, [auth.id]);

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "No Purchases Made" }, { status: 404 });
    }

    const orders = [];

    for (const order of orderResult.rows) {
      const productQuery = `
          SELECT * FROM order_items
          WHERE orderId = $1;
        `;
      const productResult = await client.query(productQuery, [order.id]);

      const orderData = {
        id: order.id,
        created_at: order.created_at,
        products: productResult.rows,
      };

      orders.push(orderData);
    }

    return NextResponse.json(orders, { status: 200 });
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
