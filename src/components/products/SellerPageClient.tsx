"use client";

import { useState } from "react";
import Product from "@/components/products/Product";
import Link from "next/link";
import { ProductProps } from "@/redux/slices/types";

interface SellerPageClientProps {
  seller: string;
  products: ProductProps[];
}

const SellerPageClient = ({ seller, products }: SellerPageClientProps) => {
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
  }>({
    message: "",
    visible: false,
  });

  const handleAddToCart = (itemName: string) => {
    setNotification({ message: `${itemName} added to cart!`, visible: true });
    setTimeout(() => {
      setNotification({ message: "", visible: false });
    }, 3500);
  };

  return (
    <div className="text-center">
      <div className="text-center mt-8">
        <Link
          href="/products"
          className="px-6 py-4 rounded-lg font-semibold login-button"
        >
          See all Products
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-h-color my-10">
        <span className="text-[#17311f]">Products by </span>@{seller}
      </h1>
      <div className="flex flex-wrap justify-center mt-10">
        {products.map((product, index) => (
          <Product
            key={index}
            {...product}
            notification={notification}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      {products.length === 0 ? (
        <div>
          <p className="text-xl text-h-color font-semibold">
            Sorry Seller has no products!
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SellerPageClient;
