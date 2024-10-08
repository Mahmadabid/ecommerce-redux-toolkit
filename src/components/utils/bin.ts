import { Role } from "./utils";
import { UserProps } from "@/redux/slices/types";

export const User = {
  user: {
    email: "asd@g.c",
  },
  userId: "asd",
};

export const products = [
  {
    id: '1',
    name: "apple",
    price: 1,
    img: "https://images.everydayhealth.com/images/diet-nutrition/apples-101-about-1440x810.jpg",
    seller: "fruit-vendor",
    quantity: 1000
  },
  {
    id: '2',
    name: "mango",
    price: 2,
    img: "https://i0.wp.com/plant.pk/wp-content/uploads/2023/11/1000233211.jpg?fit=554%2C554&ssl=1",
    seller: "fruit-vendor",
    quantity: 800
  },
  {
    id: '3',
    name: "cake",
    price: 10,
    img: "https://openmenupk.s3.ap-south-1.amazonaws.com/wp-content/uploads/2024/07/19110131/cake.jpg",
    seller: "bakery",
    quantity: 100
  },
  {
    id: '4',
    name: "chocolate",
    price: 4,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM1bjLuveRZ6g0nUu_L_XeaMdK3oiyDk_HwA&s",
    seller: "bakery",
    quantity: 400
  }
];

const users: UserProps[] = [
  {
    id: '1e4e28d4-1e4e-11ec-82a8-0242ac130003',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: Role.buyer,
    name: 'John Doe',
    city: 'New York',
    zipcode: '10001',
    address: '123 Main St',
    country: 'USA',
  },
  {
    id: '1e4e28d4-1e4e-11ec-82a8-0242ac130004',
    username: 'jane_seller',
    email: 'jane@example.com',
    password: 'securepass',
    role: Role.seller,
    name: 'Jane Smith',
    city: 'Los Angeles',
    zipcode: '90001',
    address: '456 Market St',
    country: 'USA',
  },
  {
    id: '1e4e28d4-1e4e-11ec-82a8-0242ac130005',
    username: 'admin_user',
    email: 'admin@example.com',
    password: 'adminpass',
    role: Role.admin,
    name: 'Admin User',
    city: 'Chicago',
    zipcode: '60601',
    address: '789 Admin St',
    country: 'USA',
  },
  {
    id: '1e4e28d4-1e4e-11ec-82a8-0242ac130006',
    username: 'buyer_bob',
    email: 'bob@example.com',
    password: 'bobpass',
    role: Role.buyer,
    name: 'Bob Buyer',
    city: 'Houston',
    zipcode: '77001',
    address: '321 Bay St',
    country: 'USA',
  },
  {
    id: '1e4e28d4-1e4e-11ec-82a8-0242ac130007',
    username: 'seller_susan',
    email: 'susan@example.com',
    password: 'susanspass',
    role: Role.seller,
    name: 'Susan Seller',
    city: 'Miami',
    zipcode: '33101',
    address: '654 Ocean Dr',
    country: 'USA',
  }
];
