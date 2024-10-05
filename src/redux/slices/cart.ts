"use client";

import { products } from '@/components/utils/bin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  img: string;
}

interface CartState {
  items: CartItem[];
}

const loadCartItems = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : products;
  }
  return products;
};

const initialState: CartState = {
  items: loadCartItems(),
};

const saveCartItems = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartItems(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartItems(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCartItems(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;
