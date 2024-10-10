import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT Secret is not defined");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const {
      id,
      username,
      email,
      password,
      role,
      name,
      city,
      zipcode,
      address,
      country,
    } = await request.json();
    if (!id || !email || !username)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const existingUserQuery = await client.query(
      "SELECT * FROM users_table WHERE id = $1",
      [id]
    );
    if (existingUserQuery.rows.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existingUser = existingUserQuery.rows[0];
    console.log(existingUser);
    const usernameExists = await client.query(
      "SELECT * FROM users_table WHERE username = $1 AND id != $2",
      [username, id]
    );
    if (usernameExists.rows.length > 0)
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const fields = {
      username: username !== existingUser.username ? username : undefined,
      email: email !== existingUser.email ? email : undefined,
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
    const values = updates.map(([_, value]) => value).concat(id);
    await client.query(
      `UPDATE users_table SET ${setClause} WHERE id = $${updates.length + 1}`,
      values
    );

    return NextResponse.json(
      {
        id,
        username,
        email,
        role,
        name,
        city,
        zipcode,
        address,
        country,
        ok: true,
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
