import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = res.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = "jwt";

    return NextResponse.json({
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }, { status: 200 });
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

export async function DELETE() {
  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
