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
  handleIsAddUser: () => void;
}

const AddUser: React.FC<AddUserProps> = ({
  setNotification,
  handleIsAddUser,
}) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(Role.buyer);
  const [error, setError] = useState<string | null>(null);

  const handleAddNotification = (remove?: boolean) => {
    setNotification({
      message: remove ? "Failed to Add Profile" : `Added Profile`,
      visible: true,
      remove: remove ? true : false,
    });
    setTimeout(() => {
      setNotification({
        message: "Added Profile",
        visible: false,
        remove: false,
      });
    }, 5000);
  };

  const { refetch, isFetching } = useFetchCredentialsQuery({});

  const [addUser, { error: addUserError, isLoading }] = useAddUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

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
        return;
      } else if (userNameExists) {
        setError("Username is already taken. Please choose another.");
        return;
      } else {
        const { error: addUsersError } = await addUser({
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

        if (addUsersError) {
          handleAddNotification(true);
        } else {
          await refetch();
          handleAddNotification();
          handleIsAddUser();
        }
      }
    } catch (error) {
      setError(error as string);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6">
        {error && <p className="text-red-500 my-2">{error}hi</p>}
        {addUserError ? handleRtkQueryError(addUserError) : null}
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
          disabled={isFetching || isLoading}
          className="py-2 px-3 mt-3 rounded-lg font-semibold button-style disabled:bg-gray-600"
        >
          {isFetching || isLoading ? <Load /> : "Add User"}
        </button>
      </form>
    </>
  );
};

export default AddUser;
