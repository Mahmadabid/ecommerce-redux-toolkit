"use client";

import { useContext } from "react";
import { User } from "../utils/bin";
import Link from "next/link";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const Product = (product: any) => {
  return (
    <div className="border-2 border-gray-300 px-4 pt-2 pb-4 text-center flex-1 max-w-[196px] min-w-[196px] bg-white mx-6 rounded-lg overflow-hidden mb-6 flex flex-col justify-between">
      <div>
        <div className="h-40 w-40 relative">
          <Image
            src={product.product.img}
            alt={product.product.name}
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-lg font-semibold">{product.product.name}</h2>
        <p className="text-gray-600 font-medium">
          <span>${product.product.price}</span>
        </p>
      </div>
      <h2 className="font-semibold text-slate-600">
        From{" "}
        <Link href={`/seller/${product.product.seller}`} className="text-slate-950">
          @{product.product.seller}
        </Link>
      </h2>
      <div className="flex flex-row justify-between">
      <button
          onClick={() => {}}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
        >
          <span className="text-xl">View</span>
        </button>
        <button
          onClick={() => {}}
          className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 pt-3 rounded mt-4"
        >
          <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Product;
