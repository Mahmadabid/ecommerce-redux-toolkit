import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products_table (
        id SERIAL PRIMARY KEY,
        name STRING NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        img STRING NOT NULL,
        seller STRING NOT NULL,
        quantity INT NOT NULL DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username STRING NOT NULL,
        email STRING NOT NULL UNIQUE,
        password STRING NOT NULL,
        role STRING NOT NULL,
        name STRING NOT NULL,
        city STRING NOT NULL,
        zipcode STRING NOT NULL,
        address STRING NOT NULL,
        country STRING NOT NULL
       );
    `);

    return NextResponse.json("Setup Complete", { status: 200 });
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
