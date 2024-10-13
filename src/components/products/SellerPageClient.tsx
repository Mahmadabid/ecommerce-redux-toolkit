"use client";

import { useState } from "react";
import Product from "@/components/products/Product";
import Link from "next/link";
import { ProductProps } from "@/redux/slices/types";
import Notification from "./Notification";

interface SellerPageClientProps {
  seller: string;
  products: ProductProps[];
}

const SellerPageClient = ({ seller, products }: SellerPageClientProps) => {
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
    remove: boolean;
  }>({
    message: "Success",
    visible: false,
    remove: false
  });

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
            setNotification={setNotification}
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
      <Notification {...notification} />
    </div>
  );
};

export default SellerPageClient;
