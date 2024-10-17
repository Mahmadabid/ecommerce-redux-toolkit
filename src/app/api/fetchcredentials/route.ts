import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = await pool.connect();
  try {
    let result;

    result = await client.query(
      `SELECT username, email, id, role
      FROM users_table`
    );

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
