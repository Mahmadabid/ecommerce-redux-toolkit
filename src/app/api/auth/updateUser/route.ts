import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DecodedTokenReturn, jwtVerification } from "@/components/user/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const authHeader = request.headers.get("Authorization");

    const verificationResult = jwtVerification(authHeader);

    if (verificationResult instanceof NextResponse) return verificationResult;

    const auth: DecodedTokenReturn = verificationResult;

    const {
      password,
      role,
      name,
      city,
      zipcode,
      address,
      country,
    } = await request.json();

    const existingUserQuery = await client.query(
      "SELECT * FROM users_table WHERE id = $1",
      [auth.id]
    );
    if (existingUserQuery.rows.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existingUser = existingUserQuery.rows[0];

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const fields = {
      password: hashedPassword,
      role: role !== existingUser.role ? role : undefined,
      name: name !== existingUser.name ? name : undefined,
      city: city !== existingUser.city ? city : undefined,
      zipcode: zipcode !== existingUser.zipcode ? zipcode : undefined,
      address: address !== existingUser.address ? address : undefined,
      country: country !== existingUser.country ? country : undefined,
    };
    const updates = Object.entries(fields).filter(
      ([_, value]) => value !== undefined
    );

    if (updates.length === 0)
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );

    const setClause = updates
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = updates.map(([_, value]) => value).concat(auth.id);
    await client.query(
      `UPDATE users_table SET ${setClause} WHERE id = $${updates.length + 1}`,
      values
    );

    const newToken = jwt.sign(
      {
        id: auth.id,
        username: auth.username,
        email: auth.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );

    return NextResponse.json(
      {
        id: auth.id,
        username: existingUser.username,
        email: existingUser.email,
        role,
        name,
        city,
        token: newToken,
        zipcode,
        address,
        country,
      },
      { status: 200 }
    );
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
