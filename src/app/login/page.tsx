"use client";

import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import Notification from "@/components/products/Notification";
import Load from "@/components/utils/Load";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import { Role } from "@/components/utils/utils";
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
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(Role.buyer);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
  }>({
    message: "Added user, Please Login",
    visible: false,
  });
  const router = useRouter();

  useEffect(() => {
    dispatch(refreshAuthentication());
  }, [dispatch]);

  useEffect(() => {
    if (user?.ok) {
      router.push("/profile");
    }
  }, [user]);

  const handleAddUser = () => {
    setNotification({ message: `Added user, Please Login`, visible: true });
    setTimeout(() => {
      setNotification({ message: "Added user, Please Login", visible: false });
    }, 5000);
  };

  const {
    error: errorUsers = "",
    isLoading,
    refetch,
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
      setLoading(true);
      const { data: refetchedUsers = [], error: refetchError } =
        await refetch();

      if (refetchError) {
        setError("Failed to fetch users. Please try again.");
        return;
      }

      if (isLogIn) {
        try {
          const userExists = refetchedUsers.some(
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
          console.log(err);
          setError("Login failed. Please check your credentials.");
        }
      } else {
        try {
          const emailExists = refetchedUsers.some(
            (user: UserProps) => user.email === email
          );
          const userNameExists = refetchedUsers.some(
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
              await refetch();
              handleAddUser();
              handleChange();
            }
          }
        } catch (err) {
          setError("Sign-up failed. Please try again.");
        }
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = () => {
    setIsLogIn((state) => !state);
    setPassword("");
    setError(null);
  };

  if (isLoading) return <PageLoad />;
  if (errorUsers) return <PageError />;

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
              ? "data" in addUserError &&
                typeof addUserError.data === "object" &&
                addUserError.data !== null
                ? (addUserError.data as { message: string }).message ||
                  "Error occurred while adding user"
                : "Error occurred while adding user"
              : logInUserError
              ? "data" in logInUserError &&
                typeof logInUserError.data === "object" &&
                logInUserError.data !== null
                ? (logInUserError.data as { message: string }).message ||
                  "Error occurred while logging in"
                : "Error occurred while logging in"
              : "An unknown error occurred."}
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
          disabled={addUserLoading || logInUserLoading || loading}
          className="py-2 px-3 mt-3 rounded-lg font-semibold button-style disabled:bg-gray-600"
        >
          {addUserLoading || logInUserLoading || loading ? (
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
        disabled={addUserLoading || logInUserLoading || loading}
      >
        {isLogIn ? "Signup" : "Login"}
      </button>
      <Notification {...notification} />
    </div>
  );
};

export default Login;
