"use client";

import Link from "next/link";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart } from "@/redux/slices/cart";
import { useEffect, useState } from "react";
import Notification from "./Notification";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  img: string;
  seller: string;
  quantity: number;
  notification: { message: string; visible: boolean };
  onAddToCart: (itemName: string) => void;
}

const Product: React.FC<ProductProps> = ({
  id,
  name,
  price,
  img,
  seller,
  quantity,
  notification,
  onAddToCart,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [newQuantity, setNewQuantity] = useState(quantity);
  const [isDisabled, setDisabled] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [productQuantity, setProductQuantity] = useState(0);
  const cartItems = useSelector((state: RootState) => state.cart.items);

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

  const handlePurchase = () => {
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

    onAddToCart(name);
    setProductQuantity((state) => state + 1);
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
          <h2 className="text-lg font-semibold text-[#0a3b18]">{name.toUpperCase()}</h2>
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
          {/* Display item is in cart */}
          {inCart && !newQuantity ? (
            <div className="bg-[#0a3b18] rounded p-1 mt-[6px]">
              <p className="font-semibold text-white">Already in cart</p>
            </div>
          ) : null}
        </div>
        <h2 className="font-semibold text-slate-600 mt-[6px]">
          Seller{": "}
          <Link href={`/seller?seller=${seller}`} className="text-slate-950">
            @{seller}
          </Link>
        </h2>
        <div className="flex flex-row items-center justify-between mt-4">
          <p className="text-gray-600 font-medium text-lg">
            <span>${price}</span>
          </p>
          <button
            onClick={handlePurchase}
            className="button-style px-2 py-2 rounded flex items-center disabled:bg-gray-500"
            disabled={isDisabled}
          >
            <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
          </button>
        </div>
        <Notification {...notification} />
      </div>
    </div>
  );
};

export default Product;
