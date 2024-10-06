"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart, CartItem } from '@/redux/slices/cart';

const loadCartItems = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : [];
  }
  return [];
};

const CartLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cartItems = loadCartItems();
    cartItems.forEach(item => {
      dispatch(addToCart(item));
    });
  }, [dispatch]);

  return null;
};

export default CartLoader;
