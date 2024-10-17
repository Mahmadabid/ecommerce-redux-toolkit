import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(req.url);
    const seller = searchParams.get("seller");

    let result;

    if (seller) {
      result = await client.query(
        "SELECT * FROM products_table WHERE seller = $1",
        [seller]
      );
    } else {
      result = await client.query("SELECT * FROM products_table");
    }

    return NextResponse.json(result.rows, { status: 200 });
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
