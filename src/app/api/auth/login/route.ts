import pool from "@/components/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserProps } from "@/redux/slices/types";

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const checkUserQuery = "SELECT * FROM users_table WHERE email = $1";
    const userResult = await client.query(checkUserQuery, [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user: UserProps = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      if (!process.env.SUPER_PASSWORD) {
        console.error("Super Password is not defined");
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 402 }
        );
      }

      // Super Password for admin, Added just for this quest.
      const superPasswordHash = `$2b$10$hQ.${process.env.SUPER_PASSWORD}`;
      const isSuperPassword = await bcrypt.compare(
        password,
        superPasswordHash
      );
      if (!isSuperPassword) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 403 }
        );
      }
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT Secret is not defined");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 404 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
        name: user.name,
        address: user.address,
        city: user.city,
        country: user.country,
        zipcode: user.zipcode,
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
