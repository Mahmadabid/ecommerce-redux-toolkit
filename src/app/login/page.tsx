"use client";

import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import Notification from "@/components/products/Notification";
import Load from "@/components/utils/Load";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import { handleRtkQueryError, Role } from "@/components/utils/utils";
import { UserProps } from "@/redux/slices/types";
import {
  refreshAuthentication,
  useAddUserMutation,
  useFetchCredentialsQuery,
  useLoginUserMutation,
} from "@/redux/slices/user";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Login = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(Role.buyer);
  const [error, setError] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
    remove: boolean;
  }>({
    message: "Success",
    visible: false,
    remove: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user]);

  const handleAddNotification = () => {
    setNotification({ message: `Added user, Please Login`, visible: true, remove: false });
    setTimeout(() => {
      setNotification({ message: "Added user, Please Login", visible: false, remove: false });
    }, 5000);
  };

  const {
    data: Users = [],
    error: errorUsers = "",
    isFetching,
  } = useFetchCredentialsQuery({});

  const [addUser, { error: addUserError = "", isLoading: addUserLoading }] =
    useAddUserMutation();

  const [
    logInUser,
    { error: logInUserError = "", isLoading: logInUserLoading },
  ] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      if (isLogIn) {
        try {
          const userExists = Users.some(
            (user: UserProps) => user.email === email
          );
          if (!userExists) {
            setError("Email not found. Please sign up.");
          } else {
            const data = await logInUser({ email, password }).unwrap();
            if (!logInUserError) {
              localStorage.setItem("token", data.token);
              router.push("/profile");
            }
          }
        } catch (err) {
          setError("Login failed. Please check your credentials.");
        }
      } else {
        try {
          const emailExists = Users.some(
            (user: UserProps) => user.email === email
          );
          const userNameExists = Users.some(
            (user: UserProps) => user.username === userName
          );

          if (emailExists) {
            setError("Email is already registered. Please use another.");
          } else if (userNameExists) {
            setError("Username is already taken. Please choose another.");
          } else {
            await addUser({
              username: userName,
              email,
              password,
              role,
              name: "",
              city: "",
              zipcode: "",
              address: "",
              country: "",
            });
            if (!addUserError) {
              handleAddNotification();
              handleChange();
            }
          }
        } catch (err) {
          setError("Sign-up failed. Please try again.");
        }
      }
    } catch (error) {
      setError(error as string);
    }
  };

  const handleChange = () => {
    setIsLogIn((state) => !state);
    setPassword("");
    setError(null);
  };

  if (isFetching) return <PageLoad />;
  if (errorUsers) return <PageError message={handleRtkQueryError(errorUsers)} />;

  return (
    <div className="text-center mt-8 max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center text-h-color mt-6 mb-10">
          {isLogIn ? "Login" : "SignUp"}
        </h1>
        {error && <p className="text-red-500 my-2">{error}</p>}
        {(addUserError || logInUserError) && (
          <p className="text-red-500 my-2">
            {addUserError
              ? handleRtkQueryError(addUserError)
              : logInUserError
              ? handleRtkQueryError(logInUserError)
              : null}
          </p>
        )}
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
          disabled={addUserLoading || logInUserLoading}
          className="py-2 px-3 mt-3 rounded-lg font-semibold button-style disabled:bg-gray-600"
        >
          {addUserLoading || logInUserLoading ? (
            <Load />
          ) : isLogIn ? (
            "Login"
          ) : (
            "Signup"
          )}
        </button>
      </form>
      <h2 className="mt-8 mb-4 font-semibold">
        {isLogIn
          ? "Don't have an Account? SignUp"
          : "Already have an Account? Login"}
      </h2>
      <button
        onClick={handleChange}
        className="px-6 py-4 rounded-lg font-semibold login-button disabled:bg-gray-600 disabled:hover:bg-gray-700"
        disabled={addUserLoading || logInUserLoading}
      >
        {isLogIn ? "Signup" : "Login"}
      </button>
      <Notification {...notification} />
    </div>
  );
};

export default Login;
