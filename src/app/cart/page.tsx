"use client";

import { cartItems } from "@/components/utils/bin";
import { useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState(cartItems);

  // Function to handle quantity changes
  const handleQuantityChange = (index: number, delta: number) => {
    const updatedCart = cart.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: Math.max(1, item.quantity + delta),
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Function to remove an item
  const handleRemove = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  // Calculate item total
  const calculateTotal = (price: number, qty: number) => {
    return (price * qty).toFixed(2);
  };

  // Calculate grand total
  const grandTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
      {/* Cart Table */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="grid grid-cols-6 gap-4 font-bold mb-4 text-lg xmd:hidden">
          <p></p>
          <p></p>
          <p>Price</p>
          <p className="text-center">Qty</p>
          <p>Total</p>
        </div>

        {/* Cart Items */}
        {cart.map((item, index) => (
          <div
            key={index}
            className="w-full max-w-2xl mx-auto grid grid-cols-2 nmd:grid-cols-6 gap-4 items-center border-b py-4"
          >
            {/* Product Info */}
            <div className="flex items-center space-x-4 col-span-2">
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h2 className="truncate">
                  <a
                    href="#"
                    className="text-[#1B2C4C] hover:underline text-wrap"
                  >
                    {item.name}
                  </a>
                </h2>
                <p className="text-sm text-gray-500">{item.seller}</p>
              </div>
            </div>
            {/* Price */}
            <div className="flex flex-row text-lg">
              <span className="nmd:hidden text-slate-500">Price:&nbsp;</span>
              <p className="text-center col-span-1">${item.price}</p>
            </div>
            {/* Quantity Controls */}
            <div className="flex flex-col items-center col-span-1">
              <div className="flex flex-row items-center text-lg">
                <span className="nmd:hidden text-slate-500">Qty:&nbsp;</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    className="border border-gray-300 px-2 py-1 rounded-md"
                  >
                    -
                  </button>
                  <p className="text-lg">{item.quantity}</p>
                  <button
                    onClick={() => handleQuantityChange(index, 1)}
                    className="border border-gray-300 px-2 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            {/* Total Price for Item */}
            <div className="flex flex-row items-center text-lg">
              <span className="nmd:hidden text-slate-500">Total:&nbsp;</span>
              <p className="text-lg text-center col-span-1">
                ${calculateTotal(item.price, item.quantity)}
              </p>
            </div>
            {/* Button to remove Item */}
            <div className="flex justify-center">
              <button
                onClick={() => handleRemove(index)}
                className="bg-[#632B24] hover:bg-white max-w-24 hover:text-[#632B24] font-semibold text-white border hover:border-[#632B24] rounded p-[6px]"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Order Summary */}
        <div className="mt-6 flex justify-between items-center">
          <p className="font-bold text-xl">Order Total:</p>
          <p className="font-bold text-xl">${grandTotal.toFixed(2)}</p>
        </div>

        {/* Checkout Button */}
        <div className="text-center mt-6">
          <button className="bg-[#1B2E3C] text-white px-6 py-3 rounded-lg hover:bg-[#030507]">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
