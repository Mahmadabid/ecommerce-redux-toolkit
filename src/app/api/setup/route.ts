import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(req.url);
    const dummy = searchParams.get("dummy");

    await client.query(`
      CREATE TABLE IF NOT EXISTS products_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
        role STRING CHECK (role IN ('buyer', 'admin', 'seller')) NOT NULL,
        name STRING,
        city STRING,
        zipcode STRING,
        address STRING,
        country STRING
      );
    `);

    if (dummy) {
      await client.query(`
      INSERT INTO products_table (name, price, img, seller, quantity) VALUES
        ('apple', 1, 'https://images.everydayhealth.com/images/diet-nutrition/apples-101-about-1440x810.jpg', 'fruit-vendor', 1000),
        ( 'mango', 2, 'https://i0.wp.com/plant.pk/wp-content/uploads/2023/11/1000233211.jpg?fit=554%2C554&ssl=1', 'fruit-vendor', 800),
        ('cake', 10, 'https://openmenupk.s3.ap-south-1.amazonaws.com/wp-content/uploads/2024/07/19110131/cake.jpg', 'bakery', 100),
        ('chocolate', 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM1bjLuveRZ6g0nUu_L_XeaMdK3oiyDk_HwA&s', 'bakery', 400);
      `);

      await client.query(`
        INSERT INTO users_table (username, email, password, role, name, city, zipcode, address, country) VALUES
          ('john_doe', 'john@example.com', 'password123', 'buyer', 'John Doe', 'New York', '10001', '123 Main St', 'USA'),
          ('jane_seller', 'jane@example.com', 'securepass', 'seller', 'Jane Smith', 'Los Angeles', '90001', '456 Market St', 'USA'),
          ('admin_user', 'admin@example.com', 'adminpass', 'admin', 'Admin User', 'Chicago', '60601', '789 Admin St', 'USA'),
          ('buyer_bob', 'bob@example.com', 'bobpass', 'buyer', 'Bob Buyer', 'Houston', '77001', '321 Bay St', 'USA'),
          ('seller_susan', 'susan@example.com', 'susanspass', 'seller', 'Susan Seller', 'Miami', '33101', '654 Ocean Dr', 'USA');
      `);
    }
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
