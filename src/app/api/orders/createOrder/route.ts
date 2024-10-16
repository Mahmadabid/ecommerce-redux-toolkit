import pool from "@/components/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const {
      id,
      email,
      name,
      buyer,
      address,
      city,
      zipcode,
      country,
      products,
      buyerId,
    } = await request.json();

    if (
      !email ||
      !name ||
      !address ||
      !city ||
      !zipcode ||
      !country ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields or products" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const orderQuery = `
      INSERT INTO orders_table (
        id, buyer, email, name, address, city, zipcode, country, buyerId
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
      `;

    const orderValues = [
      id,
      buyer || "anonymous",
      email,
      name,
      address,
      city,
      zipcode,
      country,
      buyerId || "anonymous",
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].id;

    const productQuery = `
      INSERT INTO order_items (
        orderId, productId, productName, productPrice, productQuantity, productSeller, buyer, buyerId
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;

    for (const product of products) {
      const {
        productId,
        productName,
        productQuantity,
        productPrice,
        productSeller,
        buyer,
        buyerId,
      } = product;

      await client.query(productQuery, [
        orderId,
        productId,
        productName,
        productPrice,
        productQuantity,
        productSeller,
        buyer || "anonymous",
        buyerId || "anonymous",
      ]);
    }

    const updateProductQuery = `
      UPDATE products_table
      SET quantity = quantity - $1
      WHERE id = $2;
      `;

    for (const product of products) {
      const { productId, productQuantity } = product;

      try {
        await client.query(updateProductQuery, [productQuantity, productId]);
      } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: `Failed to update product ${productId}` },
          { status: 500 }
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Order added successfully", orderId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error executing query:", error);
    await client.query("ROLLBACK");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
