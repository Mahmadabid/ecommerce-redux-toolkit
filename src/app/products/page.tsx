"use client";

import Notification from "@/components/products/Notification";
import Product from "@/components/products/Product";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import { useGetProductsQuery } from "@/redux/slices/product";
import { useState } from "react";

const ProductDisplay = () => {
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
    remove: boolean;
  }>({
    message: "Success",
    visible: false,
    remove: false,
  });
  const { data: products = [], error, isLoading } = useGetProductsQuery();

  if (isLoading) return <PageLoad />;
  if (error) return <PageError />;

  return (
    <div className="text-center">
      <h1 className="text-4xl my-4 font-bold text-h-color">Products</h1>
      <div className="flex flex-wrap justify-center mt-8">
        {products.length > 0 ? (
          products.map((product) => (
            <Product
              key={product.id}
              {...product}
              setNotification={setNotification}
            />
          ))
        ) : (
          <div>
            <p className="text-xl text-h-color mt-16">
              Sorry we are out of products. We will add them soon!
            </p>
          </div>
        )}
        <Notification {...notification} />
      </div>
    </div>
  );
};

export default ProductDisplay;
