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

Visit [Website](https://cockroachlabs.cloud/get-started)

https://github.com/user-attachments/assets/e8d9455d-91aa-4eaf-965d-1f45462c6c93

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

Visit ```http://localhost:3000/api/setup``` to setup your database and create admin user

Visit ```http://localhost:3000/api/setup?dummy=dummy``` to setup your database, create all users including admin and pre add products.

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

## API Documentation
Pixel Market includes various API routes for managing products, users, and orders. Heres a quick overview of the main API endpoints:

[GET /api/products/fetch](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/products/fetch/route.ts): Fetches all products or products by a seller(requires seller Id).

[POST /api/products/addProducts](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/products/addProducts/route.ts): Adds a new product (requires seller or admin role).

[POST /api/products/deleteProduct](http://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/products/deleteProduct/route.ts): Deletes a product (requires seller or admin role).

[POST /api/orders/createOrder](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/orders/createOrder/route.ts): Creates Order.

[GET /api/orders/order](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/orders/order/route.ts): Fetches specific order (requires order Id) or fetches Id of all orders to use in search function.

[GET /api/orders/purchases](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/orders/purchases/route.ts): Fetches Purchases of a particullar buyer (requires jwt token)

[GET /api/orders/sales](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/orders/sales/route.ts): Fetches Sales of a particullar seller (requires jwt token)

[GET /api/fetchcredentials](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/fetchcredentials/route.ts): Fetches username, email for validation on signup.

[GET /api/setup](http://localhost:3000/api/setup): Setups cockroachdb with tables and admin user.

[GET /api/setup?dummy=dummy](http://localhost:3000/api/setup?dummy=dummy): Setups cockroachdb with tables and all users and dummy products.

[POST /api/auth/login](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/auth/login/route.ts): Used to Login data, validate email and password and to create JWT.

[POST /api/auth/addUser](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/auth/addUser/route.ts): Used to create user, can be created by admin also. Requires role, username and email.

[POST /api/auth/updateUser](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/auth/updateUser/route.ts): Used to update password, role and other values of a user. All roles can access this.

[POST /api/auth/deleteUser](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/app/api/auth/deleteUser/route.ts): Used to delete users, can only be done by Admin.

**Technologies Used**
- Next.js 13: Server-side rendering and API routes.
- CockroachDB: Distributed SQL database.
- Node.js: Backend logic.
- Bcrypt: For password hashing.
