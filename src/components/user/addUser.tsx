import React, { useState } from "react";
import FloatingLabelInput from "../form/FloatingLabelInput";
import Load from "../utils/Load";
import { handleRtkQueryError, Role } from "../utils/utils";
import {
  useAddUserMutation,
  useFetchCredentialsQuery,
} from "@/redux/slices/user";
import { UserProps } from "@/redux/slices/types";

interface AddUserProps {
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      visible: boolean;
      remove: boolean;
    }>
  >;
}

const AddUser: React.FC<AddUserProps> = ({setNotification}) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(Role.buyer);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateNotification = () => {
    setNotification({
      message: `Added Profile`,
      visible: true,
      remove: false,
    });
    setTimeout(() => {
      setNotification({
        message: "Added Profile",
        visible: false,
        remove: false,
      });
    }, 5000);
  };

  const { refetch } = useFetchCredentialsQuery({});

  const [addUser, { error: addUserError = "" }] =
    useAddUserMutation();

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
          handleUpdateNotification();
        }
      }
    } catch (error) {
      setError(error as string);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6">
        {error && <p className="text-red-500 my-2">{error}</p>}
        {addUserError
          ? handleRtkQueryError(addUserError)
          : null}
        <FloatingLabelInput
          label="Email"
          required
          value={email}
          onChange={setEmail}
          type="email"
        />
        <div className="my-6"></div>
        <FloatingLabelInput
          label="UserName"
          required
          value={userName}
          onChange={setUserName}
        />

        <div className="my-6"></div>
        <FloatingLabelInput
          label="Password"
          required
          value={password}
          onChange={setPassword}
          type="password"
        />
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
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-3 mt-3 rounded-lg font-semibold button-style disabled:bg-gray-600"
        >
          {loading ? <Load /> : "Add User"}
        </button>
      </form>
    </>
  );
};

export default AddUser;
