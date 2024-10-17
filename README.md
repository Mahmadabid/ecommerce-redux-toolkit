# Pixel Market
Pixel Market is an e-commerce platform that allows users to create, sell, and buy products. It provides functionality to track purchases and sales, and includes an admin panel for managing users.

## Installation
To run the project locally, follow these steps:

- Clone the repository:

``` ruby
git clone https://github.com/yourusername/pixel-market.git
```

- Navigate to the project directory:

``` ruby
cd pixel-market
```

- Install dependencies:

``` ruby
npm install
```

- Set up the database:

Ensure you have CockroachDB set up and running.

- Update the projects environment file.

``` ruby
# NEXT_PUBLIC_API_BASE_URL='https://pixel-marketplace-redux.vercel.app/api/'
NEXT_PUBLIC_API_BASE_URL='http://localhost:3000/api/'
JWT_SECRET='Add_your_Jwt_here'
# bcrypt admin super password, since .env truncates bcrypt to first '.' like:
# '$2b$10$hQ.q17aL0PDSRR42XaPAt.OD6mDF2HlA10yjPwCGyktiTFtF56Ddq' is trucated to:
# 'q17aL0PDSRR42XaPAt.OD6mDF2HlA10yjPwCGyktiTFtF56Ddq'
# so it is divided into components
SUPER_PASSWORD='q17aL0PDSRR42XaPAt.OD6mDF2HlA10yjPwCGyktiTFtF56Ddq'
DATABASE_URL='Add_cockroachdb_database_url_here'
```

- Run the development server:

``` ruby
npm run dev
```

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
