"use client";

import AddProduct from "@/components/products/addProduct";
import Notification from "@/components/products/Notification";
import Product from "@/components/products/Product";
import Sales from "@/components/products/sales";
import StoreSwithcer from "@/components/products/storeSwithcer";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import PageLogin from "@/components/utils/pageLogin";
import { handleRtkQueryError, Role } from "@/components/utils/utils";
import { useGetProductsBySellerQuery } from "@/redux/slices/product";
import { RootState } from "@/redux/store";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const [storeSwitcher, setStoreSwitcher] = useState(0);
  const { user } = useSelector((state: RootState) => state.auth);
  const [deleteProductError, setDeleteProductError] = useState<string | null>(
    null
  );
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
    remove: boolean;
  }>({
    message: "Success",
    visible: false,
    remove: false,
  });

  const handleSwitcher = (value: number) => {
    setStoreSwitcher(value);
  };

  const {
    data: products = [],
    error,
    isFetching,
  } = useGetProductsBySellerQuery(user?.username || "");

  if (!user) return <PageLogin message="Login to sell" />;

  if (!(user?.role === Role.seller || user?.role === Role.admin))
    return (
      <div className="text-center flex justify-center items-center flex-col">
        <h1 className="text-4xl my-4 font-bold text-h-color">Store</h1>
        <p className="text-xl mt-6 mb-4 font-semibold">
          You need to be a seller to open a store, Update your profile.
        </p>
        <Link
          href="/profile"
          className="px-4 mt-4 py-2 rounded-lg font-semibold button-style"
        >
          Profile &nbsp;
          <FontAwesomeIcon icon={faAddressCard} />
        </Link>
      </div>
    );

  if (isFetching && (user?.role === Role.seller || user?.role === Role.admin))
    return <PageLoad />;
  if (error) return <PageError message={handleRtkQueryError(error)} />;

  return (
    <div className="text-center flex justify-center items-center flex-col">
      <h1 className="text-4xl my-4 font-bold text-h-color">Store</h1>
      <StoreSwithcer
        storeSwitcher={storeSwitcher}
        handleSwitcher={handleSwitcher}
      />
      <p className="text-red-500 my-2">{deleteProductError}</p>
      {storeSwitcher === 0 ? (
        <div className="mt-8 flex flex-wrap justify-center">
          {products.length > 0 ? (
            products.map((product) => (
              <Product
                key={product.id}
                {...product}
                isDelete={true}
                setDeleteProductError={setDeleteProductError}
                setNotification={setNotification}
              />
            ))
          ) : (
            <div>
              <p className="text-xl text-h-color mt-16">
                You didn't add any product.
                <br />
                Add products to display them here and to users.
              </p>
            </div>
          )}
        </div>
      ) : storeSwitcher === 1 ? (
        <div>
          <AddProduct
            userId={user?.id}
            username={user?.username}
            isFetching={isFetching}
            handleStoreChange={handleSwitcher}
            setNotification={setNotification}
          />
        </div>
      ) : (
        <div>
          <Sales />
        </div>
      )}
      <Notification {...notification} />
    </div>
  );
};

export default Page;
