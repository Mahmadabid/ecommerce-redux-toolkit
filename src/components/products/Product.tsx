"use client";

import Link from "next/link";
import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart } from "@/redux/slices/cart";
import React, { useEffect, useState } from "react";
import Load from "../utils/Load";
import { useDeleteProductMutation } from "@/redux/slices/product";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  img: string;
  seller: string;
  quantity: number;
  isDelete?: boolean;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      visible: boolean;
      remove: boolean;
    }>
  >;
  setDeleteProductError?: React.Dispatch<React.SetStateAction<string | null>>;
  isFetching?: boolean;
}

const Product: React.FC<ProductProps> = ({
  id,
  name,
  price,
  img,
  seller,
  quantity,
  isDelete,
  setNotification,
  setDeleteProductError,
  isFetching,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [newQuantity, setNewQuantity] = useState(quantity);
  const [isDisabled, setDisabled] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [productQuantity, setProductQuantity] = useState(0);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [
    deleteProductData,
    { isLoading: deleteProductLoading, error: deleteProductError = "" },
  ] = useDeleteProductMutation();

  const handleNotification = (itemName: string) => {
    setNotification({
      message: `${isDelete ? "Deleted Product" : `${itemName} added to cart!`}`,
      visible: true,
      remove: isDelete ? true : false,
    });
    setTimeout(() => {
      setNotification({ message: "", visible: false, remove: false });
    }, 3500);
  };

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === id);
    setInCart(!!cartItem);

    const cartQuantity = cartItem ? cartItem.quantity : 0;
    setProductQuantity(cartQuantity);

    if (cartQuantity >= quantity) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    setNewQuantity(quantity - cartQuantity);
  }, [id, quantity]);

  const handleDelete = async (productId: string) => {
    if (setDeleteProductError  && isDelete) {
      setDeleteProductError(null);

      try {
        await deleteProductData({ productId });
        if (!deleteProductError) {
          handleNotification("");
        }
      } catch (error) {
        const errorMessage = deleteProductError
          ? "data" in deleteProductError &&
            typeof deleteProductError.data === "object" &&
            deleteProductError.data !== null
            ? (deleteProductError.data as { message: string }).message ||
              "Error occurred while deleting the product"
            : "Error occurred while deleting the product"
          : "Unknown error occurred";

        setDeleteProductError(errorMessage);
      }
    }
  };

  const handleAction = () => {
    if (isDelete) {
      handleDelete(id);
    } else {
      const itemToAdd = {
        id,
        name,
        price,
        img,
        seller,
        quantity: productQuantity + 1,
        totalQuantity: quantity,
      };
      dispatch(addToCart(itemToAdd));

      setNewQuantity((prevQuantity) => prevQuantity - 1);

      if (newQuantity - 1 <= 0) {
        setDisabled(true);
        setInCart(true);
      }

      handleNotification(name);
      setProductQuantity((state) => state + 1);
    }
  };

  return (
    <div className="border-2 border-gray-300 flex-1 max-w-[226px] min-w-[196px] bg-white mx-6 rounded-lg overflow-hidden mb-6 flex flex-col justify-between">
      <div className="h-[196px] w-226px] relative mb-4">
        <Image
          src={img}
          alt={name}
          fill
          sizes="600px"
          className="object-cover"
        />
      </div>
      <div className="px-4 pb-4 text-center">
        <div>
          <h2 className="text-lg font-semibold text-[#0a3b18]">
            {name.toUpperCase()}
          </h2>
          <p
            className={`${
              newQuantity < 1 ? "text-[#632B24]" : "text-slate-600"
            } font-semibold mt-2`}
          >
            {newQuantity ? (
              <span className="text-[#1b2e3c]">Stock: </span>
            ) : null}
            {newQuantity ? newQuantity : "Out of Stock"}
          </p>
          {inCart && !newQuantity ? (
            <div className="bg-[#0a3b18] rounded p-1 mt-[6px]">
              <p className="font-semibold text-white">Already in cart</p>
            </div>
          ) : null}
        </div>
        <h2 className="font-semibold text-slate-600 mt-[6px]">
          Seller{": "}
          <Link href={`/seller?seller=${seller}`} target="_blank" className="text-slate-950">
            @{seller}
          </Link>
        </h2>
        <div className="flex flex-row items-center justify-between mt-4">
          <p className="text-gray-600 font-medium text-lg">
            <span>${price}</span>
          </p>
          <button
            onClick={handleAction}
            className={`${
              isDelete
                ? "bg-[#632B24] text-white hover:bg-[#491d17] px-[10px]"
                : "button-style px-2"
            } py-2 rounded flex items-center disabled:bg-gray-500`}
            disabled={isDisabled || deleteProductLoading || isFetching}
          >
            {deleteProductLoading || isFetching ? (
              <Load />
            ) : (
              <FontAwesomeIcon
                icon={isDelete ? faTrash : faCartShopping}
                className="text-lg"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
