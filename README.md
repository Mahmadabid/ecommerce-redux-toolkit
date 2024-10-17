# Pixel Market
Pixel Market is an e-commerce platform that allows users to create, sell, and buy products. It provides functionality to track purchases and sales, and includes an admin panel for managing users.

## Installation
To run the project locally, follow these steps:

Clone the repository:

`git clone https://github.com/yourusername/pixel-market.git`

Navigate to the project directory:

`cd pixel-market`

Install dependencies:

`npm install`

Set up the database:

Ensure you have CockroachDB set up and running.
Update the database connection details in the project’s environment file.
Run the development server:

`npm run dev`

Visit http://localhost:3000 in your browser to see the app.

## Features
### Product Management:

Sellers can create and sell products.
Buyers can browse and purchase products.

### Sales Tracking:

Track orders and sales in real-time.
Order history is available for both buyers and sellers.

### User Management:

Admins can manage users, including sellers and buyers.
User roles include admin, seller, and buyer.

### Roles

**Admin:** Manage users and oversee the platform. To use admin use these credentials.
```
email: admin@a.c
password: 123
```
For admin a super password of `123` is created for thsi project.

**Seller:** List and manage products for sale.

**Buyer:** Purchase products and view order history.

API Documentation
Pixel Market includes various API routes for managing products, users, and orders. Here’s a quick overview of the main API endpoints:

GET /api/products: Fetch all products.
POST /api/products: Add a new product (requires seller role).
GET /api/orders: Retrieve order history.
POST /api/orders: Create a new order.
GET /api/users: List users (admin only).
Technologies Used
Next.js 13: Server-side rendering and API routes.
CockroachDB: Distributed SQL database.
Node.js: Backend logic.
Bcrypt: For password hashing.
