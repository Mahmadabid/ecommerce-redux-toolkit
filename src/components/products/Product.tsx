"use client";

import Link from "next/link";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const Product = (product: any) => {
  return (
    <div className="border-2 border-gray-300 px-4 pb-4 text-center flex-1 max-w-[196px] min-w-[196px] bg-white mx-6 rounded-lg overflow-hidden mb-6 flex flex-col justify-between">
      <div>
        <div className="h-40 w-40 relative">
          <Image
            src={product.product.img}
            alt={product.product.name}
            fill
            sizes="400px"
            className="object-contain"
          />
        </div>
        <h2 className="text-lg font-semibold text-h-color">
          {product.product.name}
        </h2>
      </div>
      <h2 className="font-semibold text-slate-600 mt-4">
        Seller{": "}
        <Link
          href={`/seller/${product.product.seller}`}
          className="text-slate-950"
        >
          @{product.product.seller}
        </Link>
      </h2>
      <div className="flex flex-row items-center justify-between mt-4">
        <p className="text-gray-600 font-medium text-xl">
          <span>${product.product.price}</span>
        </p>
        <button
          onClick={() => {}}
          className="button-style px-4 py-3 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Product;
