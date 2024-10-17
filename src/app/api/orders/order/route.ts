import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export interface PRODUCT {
  productid: string;
  productname: string;
  productquantity: number;
  productprice: number;
  productseller: string;
  created_at: string;
  buyer: string;
  orderId: string;
}

export interface ORDER {
  id: string;
  buyer: string;
  email: string;
  name: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  products: PRODUCT[];
  created_at: string;
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const client = await pool.connect();
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  try {
    if (orderId) {

      if (!uuidRegex.test(orderId)) {
        return NextResponse.json(
          { error: "Incorrect order Id" },
          { status: 406 }
        );
      }

      const orderQuery = `
        SELECT * FROM orders_table
        WHERE id = $1;
      `;
      const orderResult = await client.query(orderQuery, [orderId]);

      const productQuery = `
        SELECT * FROM order_items
        WHERE orderId = $1;
      `;
      const productResult = await client.query(productQuery, [orderId]);

      if (orderResult.rows.length === 0 || productResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      const order: ORDER = {
        id: orderResult.rows[0].id,
        buyer: orderResult.rows[0].buyer,
        email: orderResult.rows[0].email,
        name: orderResult.rows[0].name,
        address: orderResult.rows[0].address,
        city: orderResult.rows[0].city,
        zipcode: orderResult.rows[0].zipcode,
        country: orderResult.rows[0].country,
        products: productResult.rows,
        created_at: orderResult.rows[0].created_at,
      };

      return NextResponse.json(order, { status: 200 });
    } else {
      const ordersQuery = `
        SELECT id FROM orders_table;
      `;
      const ordersResult = await client.query(ordersQuery);

      if (ordersResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 408 }
        );
      }

      return NextResponse.json(ordersResult.rows, { status: 200 });
    }
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