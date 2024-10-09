"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import Load from "../utils/Load";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { refreshAuthentication } from "@/redux/slices/user";

const Header = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(refreshAuthentication());
  }, [dispatch]);

  return (
    <header className="bg-b-color p-4 xse:p-[10px] z-50 text-white shadow-md relative flex justify-center items-center">
      {loggingOut && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-950 opacity-95 flex flex-col space-y-2 items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <div className="text-white flex flex-row text-2xl font-bold">
            Logging Out &nbsp;
            <Load className="w-9 h-9 fill-white" />
          </div>
        </div>
      )}
      {user?.ok ? (
        <ProfileDropdown
          setLoggingOut={setLoggingOut}
          email={user?.email}
        />
      ) : (
        <ProfileDropdown setLoggingOut={setLoggingOut} loggedOut={true} />
      )}
      <h1 className="mx-auto text-4xl xse:text-3xl font-bold">
        <Link href="/">Pixel Market</Link>
      </h1>
      <Link href="/cart">
        <div className="relative">
          {cartItems.length > 0 && (
            <div className="absolute top-[-6px] left-[10px] bg-[#1b7d03] rounded w-fit h-[18px] p-[2px] flex justify-center items-center">
              <p className="text-white font-medium text-sm">
                {cartItems.reduce((total, cart) => total + cart.quantity, 0)}
              </p>
            </div>
          )}
          <FontAwesomeIcon
            icon={faCartShopping}
            className="text-[26px] mr-2 xse:mr-0 mt-1"
          />
        </div>
      </Link>
    </header>
  );
};

export default Header;
