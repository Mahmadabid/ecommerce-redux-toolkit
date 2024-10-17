import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

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

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        buyer STRING NOT NULL,
        buyerId STRING,
        email STRING NOT NULL,
        name STRING,
        city STRING,
        zipcode STRING,
        address STRING,
        country STRING,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        orderId UUID REFERENCES orders_table(id) ON DELETE CASCADE,
        productId UUID,
        productName STRING,
        productPrice DECIMAL(10, 2),
        productQuantity INT,
        productSeller STRING,
        buyer STRING NOT NULL,
        buyerId STRING NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const user = {
      username: "admin",
      email: "admin@a.c",
      password: "$2b$10$hnMGbs.SUakd97lVv.pbXOPMObX9RDseo5A7e6fILO9TM3PKuYrxW",
      role: "admin",
      name: "Admin",
      city: "Miami",
      zipcode: "33101",
      address: "654 Ocean Dr",
      country: "USA",
    };

    const {
      username,
      email,
      password,
      role,
      name,
      city,
      zipcode,
      address,
      country,
    } = user;

    const existingUser = await client.query(
      `SELECT 1 FROM users_table WHERE email = $1 OR username = $2`,
      [email, username]
    );

    if (existingUser.rowCount === 0) {
      await client.query(
        `
        INSERT INTO users_table (username, email, password, role, name, city, zipcode, address, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        [username, email, password, role, name, city, zipcode, address, country]
      );
    }

    if (dummy) {
      await client.query(`
      INSERT INTO products_table (name, price, img, seller, quantity) VALUES
        ('apple', 1, 'https://images.everydayhealth.com/images/diet-nutrition/apples-101-about-1440x810.jpg', 'fruit-vendor', 1000),
        ( 'mango', 2, 'https://i0.wp.com/plant.pk/wp-content/uploads/2023/11/1000233211.jpg?fit=554%2C554&ssl=1', 'fruit-vendor', 800),
        ('cake', 10, 'https://openmenupk.s3.ap-south-1.amazonaws.com/wp-content/uploads/2024/07/19110131/cake.jpg', 'bakery', 100),
        ('chocolate', 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM1bjLuveRZ6g0nUu_L_XeaMdK3oiyDk_HwA&s', 'bakery', 400);
      `);

      const users = [
        {
          username: "fruit-vendor",
          email: "fr@example.com",
          password:
            "$2b$10$hnMGbs.SUakd97lVv.pbXOPMObX9RDseo5A7e6fILO9TM3PKuYrxW",
          role: "seller",
          name: "Fruit",
          city: "New York",
          zipcode: "10001",
          address: "123 Main St",
          country: "USA",
        },
        {
          username: "bakery",
          email: "jane@example.com",
          password:
            "$2b$10$hnMGbs.SUakd97lVv.pbXOPMObX9RDseo5A7e6fILO9TM3PKuYrxW",
          role: "seller",
          name: "bakery",
          city: "Los Angeles",
          zipcode: "90001",
          address: "456 Market St",
          country: "USA",
        },
        {
          username: "buyer_bob",
          email: "bob@example.com",
          password:
            "$2b$10$hnMGbs.SUakd97lVv.pbXOPMObX9RDseo5A7e6fILO9TM3PKuYrxW",
          role: "buyer",
          name: "Bob Buyer",
          city: "Houston",
          zipcode: "77001",
          address: "321 Bay St",
          country: "USA",
        },
        {
          username: "seller_susan",
          email: "susan@example.com",
          password:
            "$2b$10$hnMGbs.SUakd97lVv.pbXOPMObX9RDseo5A7e6fILO9TM3PKuYrxW",
          role: "buyer",
          name: "Susan Seller",
          city: "Miami",
          zipcode: "33101",
          address: "654 Ocean Dr",
          country: "USA",
        },
        {
          username: "admin",
          email: "admin@a.c",
          password:
            "$2b$10$hnMGbs.SUakd97lVv.pbXOPMObX9RDseo5A7e6fILO9TM3PKuYrxW",
          role: "admin",
          name: "Admin",
          city: "Miami",
          zipcode: "33101",
          address: "654 Ocean Dr",
          country: "USA",
        },
      ];

      for (const user of users) {
        const {
          username,
          email,
          password,
          role,
          name,
          city,
          zipcode,
          address,
          country,
        } = user;

        const existingUser = await client.query(
          `SELECT 1 FROM users_table WHERE email = $1 OR username = $2`,
          [email, username]
        );

        if (existingUser.rowCount === 0) {
          await client.query(
            `
            INSERT INTO users_table (username, email, password, role, name, city, zipcode, address, country)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
            [
              username,
              email,
              password,
              role,
              name,
              city,
              zipcode,
              address,
              country,
            ]
          );
        } else {
          console.log(
            `User with email "${email}" or username "${username}" already exists. Skipping...`
          );
        }
      }
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
