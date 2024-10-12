import Link from "next/link";
import React from "react";

interface PageLoginProps {
  message?: string;
}

const PageLogin: React.FC<PageLoginProps> = ({message}) => {
  return (
    <div className="flex justify-center items-center min-h-[50vh] text-h-color text-xl font-semibold my-16 flex-col">
      <p className="text-xl font-semibold">You are not logged In. {message}</p>
      <Link
        href="/login"
        className="px-4 mt-4 py-2 rounded-lg font-semibold button-style"
      >
        Login
      </Link>
    </div>
  );
};

export default PageLogin;
