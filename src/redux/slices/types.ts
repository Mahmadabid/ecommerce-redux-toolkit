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

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export type AuthState = {
  user: User | null;
  token: string | null;
};

export interface UserResponse {
  token: string;
  username: string;
  userId: number;
  email: string;
  role: string;
  status: number;
  ok: boolean;
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
