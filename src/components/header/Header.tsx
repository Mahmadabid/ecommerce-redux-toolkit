"use client";

import Link from 'next/link';
import { useState, useContext } from 'react';
// import { UserContext } from '@/utils/UserContext';
import ProfileDropdown from './ProfileDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons/faCartShopping';
// import { useCartContext } from '@/utils/CartContext';
import Load from '../utils/Load';
import { cartItems, User } from '../utils/bin';

const Header = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  // const [User, _] = useContext(UserContext);
  // const { cartItems } = useCartContext();

  return (
    <header className="bg-[#1b2e3c] p-4 xse:p-[10px] z-50 text-white shadow-md relative flex justify-center items-center">
      {loggingOut && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-950 opacity-95 flex flex-col space-y-2 items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <div className="text-white flex flex-row text-2xl font-bold">
            Logging Out &nbsp;<Load className='w-9 h-9 fill-white' />
          </div>
        </div>
      )}
      {User.userId ? <ProfileDropdown setLoggingOut={setLoggingOut} email={User.user.email} /> : <ProfileDropdown setLoggingOut={setLoggingOut} loggedOut={true} />}
      <h1 className="mx-auto text-4xl xse:text-3xl font-bold">
        <Link href='/'>Pixel Market</Link>
      </h1>
      <Link href='/cart'>
        <div className="relative">
          {cartItems.length > 0 && (
            <div className="absolute -top-[6px] left-2 bg-[#b700ff] p-2 rounded-full w-4 h-4 justify-center items-center flex">
              <p className='text-white font-medium m-1 mt-[5px]'>
                {/* {cartItems.reduce((total, cart) => total + cart.quantity, 0)} */}
              </p>
            </div>
          )}
          <FontAwesomeIcon icon={faCartShopping} className="text-[26px] mr-2 xse:mr-0 mt-1" />
        </div>
      </Link>
    </header>
  )
};

export default Header;
