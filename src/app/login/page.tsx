"use client";

import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import { useState } from "react";

enum Role {
  buyer = "buyer",
  seller = "seller",
}

const Login = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(Role.buyer);
  const [error, setError] = useState<string | null>(null);

  const users = [
    { userName: "asd", email: "asd@g.c" },
    { userName: "asdf", email: "asdf@g.c" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogIn) {
      const userExists = users.some((user) => user.email === email);
      if (!userExists) {
        setError("Email not found. Please sign up.");
      } else {
        console.log("Login successful");
      }
    } else {
      const emailExists = users.some((user) => user.email === email);
      const userNameExists = users.some((user) => user.userName === userName);

      if (emailExists) {
        setError("Email is already registered. Please use another.");
      } else if (userNameExists) {
        setError("Username is already taken. Please choose another.");
      } else {
        console.log("Sign-up successful");
      }
    }
  };

  const handleChange = () => {
    setIsLogIn((state) => !state);
    setPassword("");
    setError(null);
  };

  return (
    <div className="text-center mt-8 max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center text-h-color mt-6 mb-10">
          {isLogIn ? "Login" : "SignUp"}
        </h1>
        {error && <p className="text-red-500 my-2">{error}</p>}
        <FloatingLabelInput
          label="Email"
          required
          value={email}
          onChange={setEmail}
          type="email"
        />
        {!isLogIn && (
          <>
            <div className="my-6"></div>
            <FloatingLabelInput
              label="UserName"
              required
              value={userName}
              onChange={setUserName}
            />
          </>
        )}
        <div className="my-6"></div>
        <FloatingLabelInput
          label="Password"
          required
          value={password}
          onChange={setPassword}
          type="password"
        />
        {!isLogIn && (
          <>
            <div className="my-6 text-start text-h-color">
              <label htmlFor="role" className="block mb-2 pl-3 font-semibold">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="p-2 border-blue-500 border-2 outline-none rounded w-full"
              >
                <option value={Role.buyer}>Buyer</option>
                <option value={Role.seller}>Seller</option>
              </select>
            </div>
          </>
        )}
        <button
          type="submit"
          className="py-2 px-3 mt-3 rounded-lg font-semibold button-style"
        >
          {isLogIn ? "Login" : "SignUp"}
        </button>
      </form>
      <h2 className="mt-8 mb-4 font-semibold">
        {isLogIn ? "Don't have an Account? SignUp" : "Already have an Account? Login"}
      </h2>
      <button
        onClick={handleChange}
        className="px-6 py-4 rounded-lg font-semibold login-button"
      >
        {isLogIn ? "SignUp" : "Login"}
      </button>
    </div>
  );
};

export default Login;
