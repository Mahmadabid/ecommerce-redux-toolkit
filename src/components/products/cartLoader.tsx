"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cart';
import { CartItem } from '@/redux/slices/types';

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
