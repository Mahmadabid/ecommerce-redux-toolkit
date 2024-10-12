import { Role } from "@/components/utils/utils";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  ok?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export type AuthState = {
  user: UserType | null;
  token: string | null;
  loading: boolean;
};

export type UserType = {
  id: string;
  username: string;
  email: string;
  role: Role;
  name: string;
  city: string;
  zipcode: string;
  address: string;
  country: string;
  ok?: boolean;
};

export interface UserProps extends UserType {
  password: string;
}

export interface UserFetch {
  id?: string;
  username: string;
  email: string;
}

export interface UserResponse {
  token: string;
  username: string;
  id: string;
  email: string;
  role: Role;
  status: number;
  ok: boolean;
  name: string;
  city: string;
  zipcode: string;
  address: string;
  country: string;
}

export interface LogOutResponse {
  message: string;
  ok?: boolean;
}

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  img: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  img: string;
  totalQuantity: number;
}

export interface CartState {
  items: CartItem[];
}