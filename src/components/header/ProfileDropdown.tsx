"use client";

import { clearCart } from "@/redux/slices/cart";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";

interface ProfileDropdownProps {
  setLoggingOut: Dispatch<SetStateAction<boolean>>;
  email?: string;
  loggedOut?: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  setLoggingOut,
  email,
  loggedOut,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispath = useDispatch();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    sessionStorage.clear();
    localStorage.clear();
    dispath(clearCart());
    window.location.reload();
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleDropdownToggle}
        className="relative w-10 h-10 overflow-hidden bg-sky-100 rounded-full cursor-pointer"
      >
        <svg
          className={`absolute w-12 h-12 ${
            loggedOut ? "text-black" : "text-[#00aaff]"
          } -left-1 transition-transform transform hover:scale-110`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>

      {showDropdown && (
        <div className="absolute top-12 w-36 left-0 mt-2 bg-white border-gray-200 rounded shadow-lg z-10">
          {loggedOut ? null : (
            <div className="block w-full px-4 py-2 font-medium text-teal-500">
              {email}
            </div>
          )}
          {!loggedOut && (
            <Link onClick={handleDropdownToggle} href="/profile">
              <h1 className="block hover:bg-blue-500 font-[550] border-b border-gray-100 hover:rounded hover:text-white px-4 py-2 text-gray-800">
                Profile
              </h1>
            </Link>
          )}
          <Link onClick={handleDropdownToggle} href="/products">
            <h1 className="block hover:bg-blue-500 font-[550] border-b border-gray-100 hover:rounded hover:text-white px-4 py-2 text-gray-800">
              Products
            </h1>
          </Link>
          <Link onClick={handleDropdownToggle} href="/order">
            <h1 className="block hover:bg-blue-500 font-[550] border-b border-gray-100 hover:rounded hover:text-white px-4 py-2 text-gray-800">
              View Order
            </h1>
          </Link>
          {!loggedOut && (
            <Link onClick={handleDropdownToggle} href="/store">
              <h1 className="block hover:bg-blue-500 font-[550] border-b border-gray-100 hover:rounded hover:text-white px-4 py-2 text-gray-800">
                Store
              </h1>
            </Link>
          )}
          {loggedOut ? (
            <Link onClick={handleDropdownToggle} href="/login">
              <h1 className="block w-full text-left px-4 py-2 bg-sky-100 rounded text-black font-medium hover:rounded hover:text-white hover:bg-teal-500">
                LogIn
              </h1>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-sky-100 rounded text-black font-medium hover:rounded hover:text-white hover:bg-teal-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
