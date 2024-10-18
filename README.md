# Pixel Market
[Pixel Market](https://pixel-marketplace-redux.vercel.app/) is an e-commerce platform that allows users to create, sell, and buy products. It provides functionality to track purchases and sales, and includes an admin panel for managing users.

## Installation
To run the project locally, follow all of these steps:

*Make sure to **follow step 7**, otherwise this wont work.*

1. Clone the repository:

``` ruby
git clone https://github.com/Mahmadabid/ecommerce-redux-toolkit/
```

2. Navigate to the project directory:

``` ruby
cd pixel-market
```

3. Install dependencies:

``` ruby
npm install
```

4. Set up the database:

Ensure you have CockroachDB set up and running.

Visit [CockroachDB](https://cockroachlabs.cloud/get-started)

https://github.com/user-attachments/assets/e8d9455d-91aa-4eaf-965d-1f45462c6c93

5. Update the projects environment file.

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

6. Run the development server:

``` ruby
npm run dev
```

7. Setup Database (SQL Tables) and Create Admin:

Visit ```http://localhost:3000/api/setup``` to setup your database and create admin user

<br/>

8. Setup Dummy Data, Database (SQL Tables) and Create Admin:

Visit ```http://localhost:3000/api/setup?dummy=dummy``` to setup your database, create all users including admin and pre add products.

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
For admin a super password of `123` is created for this project.

**Seller:** List and manage products for sale.

**Buyer:** Purchase products and view order history.

### Technologies Used
- **Next.js 13**: For server-side rendering, static site generation, and API routes.
- **CockroachDB**: A distributed SQL database that handles the persistence of data.
- **Node.js**: Powers backend logic and API integration.
- **Redux Toolkit Query**: For efficient data fetching, caching, and state management.
- **Bcrypt**: Used for securely hashing and managing user passwords.
- **JWT (JSON Web Token)**: Handles authentication by issuing tokens for secure API access.
- **Local Storage**: Used to store JWT tokens and user sessions for persistent login across sessions.

## Redux
### Cart Management

The [Cart Slice](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/redux/slices/cart.ts) manages the user's shopping cart, allowing them to:

- Add products to the cart.
- Remove products from the cart.
- Update the quantity of products.
- View all items currently in the cart.

The Cart Slice also integrates **local storage** to persist cart data across sessions. This ensures that users don't lose their cart items even if they close the browser or refresh the page. Redux Toolkit handles the cart state, while local storage is used to store and retrieve cart data on the client-side for a seamless user experience.

### Order Management

The [Order Slice](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/redux/slices/order.ts) is built using **Redux Toolkit Query**, which provides endpoints for managing orders on Pixel Market. Order API includes:

- **`createOrder`**: Allows users to create new orders by sending a POST request with order data.
- **`fetchOrders`**: Fetches all orders Id or a specific order based on the provided `orderId`.
- **`fetchPurchases`**: Retrieves all purchases made by the current user (buyer).
- **`fetchSales`**: Retrieves all sales made by the current user (seller).

These API calls include a JWT token from **localStorage** in the `Authorization` header for authentication. State management and caching are handled automatically by **Redux Toolkit Query**.

### Product Management

The [Product Slice](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/redux/slices/product.ts) is built using **Redux Toolkit Query** and provides endpoints to manage products on Pixel Market. Key functionalities of Product API include:

- **`getProducts`**: Fetches all available products in the marketplace.
- **`getProductsBySeller`**: Retrieves products listed by a specific seller.
- **`addProducts`**: Allows sellers to add new products by sending a POST request with product details like `name`, `img`, `quantity`, and `price`.
- **`deleteProduct`**: Allows sellers or admins to delete a product by providing its `productId`.

The API integrates **JWT token authentication** by adding the token from **localStorage** in the request headers. It uses automatic caching and invalidation mechanisms to keep the product data up to date across the app.

### User Authentication and Management

[User Slice](https://github.com/Mahmadabid/ecommerce-redux-toolkit/blob/master/src/redux/slices/user.ts) uses **Redux Toolkit Query** to handle user authentication and management. It provides API endpoints and manages authentication state efficiently. Key features include:

- **Fetch User Credentials**: Fetches usernames and emails for signup validation.
- **Add User**: Registers a new user by sending their details to the backend.
- **Login User**: Authenticates users and returns a JWT token, which is stored in both the state and local storage for persistence.
- **Update User**: Allows users to update their profile details, including password, address, city, etc.
- **Delete User**: Deletes a user account by providing the `userId`.

The **authentication state** is managed using a dedicated `authSlice`, which stores user information and the JWT token. It also includes a **`refreshAuthentication`** action to load user details from local storage, ensuring that users remain logged in across sessions.

These API requests automatically attach the **JWT token** from **localStorage** to the request headers for authenticated endpoints, making the process secure and seamless.

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
