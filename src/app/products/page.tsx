"use client";

import Product from "@/components/products/Product";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import { useGetProductsQuery } from "@/redux/slices/product";
import { useState } from "react";

const ProductDisplay = () => {
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
  }>({
    message: "",
    visible: false,
  });
  const { data: products = [], error, isLoading } = useGetProductsQuery();

  const handleAddToCart = (itemName: string) => {
    setNotification({ message: `${itemName} added to cart!`, visible: true });
    setTimeout(() => {
      setNotification({ message: "", visible: false });
    }, 3500);
  };

  if (isLoading) return <PageLoad />;
  if (error) return <PageError />;

  return (
    <div className="flex flex-wrap justify-center mt-8">
      {products.length > 0 ? (
        products.map(product => (
          <Product
            key={product.id}
            {...product}
            notification={notification}
            onAddToCart={handleAddToCart}
          />
        ))
      ) : (
        <div>
          <p className="text-xl text-h-color mt-16">
            Sorry we are out of products. We will add them soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
