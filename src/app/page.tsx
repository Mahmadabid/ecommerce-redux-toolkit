"use client";

import Image from "next/image";
import Link from "next/link";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faCashRegister,
} from "@fortawesome/free-solid-svg-icons";
import { refreshAuthentication } from "@/redux/slices/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Home() {

  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    dispatch(refreshAuthentication());
  }, [dispatch]);
  
  return (
    <div>
      <div className="flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/backgroundHome.png"
            alt="Home page"
            fill
            priority
            style={{objectFit: 'cover'}}
          />
        </div>

        <div className="relative z-10 mb-4">
          <Image src="/cart.png" alt="Cart" width={300} height={300} />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-6xl xsm:text-4xl font-bold text-h-color mt-10">Welcome!</h1>
        <div className="flex flex-row items-center justify-center space-x-9 mt-7">
          <div className="border border-slate-200 bg-gray-100 rounded p-2">
            <p className="text-3xl xsm:text-2xl mb-2">Want to buy?</p>
            <Link href="/products" className="mt-4">
              <div className="inline-flex items-center justify-center p-4 border rounded-lg shadow-lg button-style transition duration-300">
                <FontAwesomeIcon icon={faCartShopping} className="text-3xl" />
              </div>
            </Link>
          </div>
          <div className="border border-slate-200 bg-gray-100 rounded p-2">
            <p className="text-3xl xsm:text-2xl mb-2">Want to Sell?</p>
            <Link href="/store" className="mt-4">
              <div className="inline-flex items-center justify-center p-4 border rounded-lg shadow-lg button-style transition duration-300">
                <FontAwesomeIcon icon={faCashRegister} className="text-3xl" />
              </div>
            </Link>
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center">
            <div className="border border-slate-200 my-16 w-fit bg-gray-100 rounded p-2">
              {user?.id ? (
                <>
                  <p className="text-3xl xsm:text-2xl mb-2">View Profile</p>
                  <Link href="/profile" className="mt-4">
                    <div className="inline-flex items-center justify-center p-4 border rounded-lg shadow-lg button-style transition duration-300">
                      <FontAwesomeIcon
                        icon={faAddressCard}
                        className="text-3xl"
                      />
                    </div>
                  </Link>
                </>
              ) : (
                <div className="pb-2">
                  <p className="text-2xl xsm:text-2xl mb-2">
                    Login to view Profile
                  </p>
                  <Link
                    href="/login"
                    className="!p-2 !text-lg !font-semibold login-button"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
