// For client side dynamic pages, using redux toolkit query

"use client";

import { useSearchParams } from "next/navigation";
import { useGetProductsBySellerQuery } from "@/redux/slices/product";
import Product from "@/components/products/Product";
import { useState } from "react";
import PageLoad from "@/components/utils/pageLoad";
import PageError from "@/components/utils/pageError";
import Link from "next/link";
import Notification from "@/components/products/Notification";

const SellerPage = () => {
  const searchParams = useSearchParams();

  const seller = searchParams.get("seller") || "";

  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
    remove: boolean;
  }>({
    message: "Success",
    visible: false,
    remove: false,
  });

  const {
    data: products = [],
    error,
    isLoading,
  } = useGetProductsBySellerQuery(seller);

  if (isLoading) return <PageLoad />;
  if (error) return <PageError />;

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
          <Product key={index} {...product} setNotification={setNotification} />
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

export default SellerPage;
