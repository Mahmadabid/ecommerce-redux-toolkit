import React, { useEffect, useState } from "react";
import FloatingLabelInput from "../form/FloatingLabelInput";
import Load from "../utils/Load";
import { handleRtkQueryError, Role } from "../utils/utils";
import { useUpdateUserMutation } from "@/redux/slices/user";
import { UserType } from "@/redux/slices/types";

interface UpdateProps {
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      visible: boolean;
      remove: boolean;
    }>
  >;
  user: UserType;
}

const UpdateUser: React.FC<UpdateProps> = ({ setNotification, user }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState(Role.buyer);
  const [change, setChange] = useState(false);
  const [initialUserData, setInitialUserData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
    role: Role.buyer,
  });

  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name,
        address: user.address,
        city: user.city,
        country: user.country,
        zipcode: user.zipcode,
        role: user.role,
      };

      setInitialUserData(initialData);
      setEmail(user.email);
      setUsername(user.username);
      setName(user.name);
      setAddress(user.address);
      setCity(user.city);
      setCountry(user.country);
      setZipcode(user.zipcode);
      setRole(user.role);
    }
  }, [user, change]);

  const handleUpdateNotification = () => {
    setNotification({
      message: `Updated Profile`,
      visible: true,
      remove: false,
    });
    setTimeout(() => {
      setNotification({
        message: "Updated Profile",
        visible: false,
        remove: false,
      });
    }, 5000);
  };

  const [updateUser, { error: updateUserError, isLoading: updateUserLoading }] =
    useUpdateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const hasChanges =
        name !== initialUserData.name ||
        address !== initialUserData.address ||
        city !== initialUserData.city ||
        country !== initialUserData.country ||
        zipcode !== initialUserData.zipcode ||
        role !== initialUserData.role ||
        password !== "";

      if (!hasChanges) {
        setError("No changes detected. Please update at least one field.");
        return;
      }

      const { error: updateUserFinalError } = await updateUser({
        name,
        address,
        city,
        country,
        zipcode,
        password,
        role: user.role === Role.admin ? undefined : role,
      });

      if (!updateUserFinalError) {
        handleUpdateNotification();
        setChange((state) => !state);
      }
    } catch (error) {
      setError(error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 my-2">{error}</p>}
      <p className="text-red-500 my-2">
        {updateUserError ? handleRtkQueryError(updateUserError) : null}
      </p>
      <div className="grid grid-cols-1 fsm:grid-cols-2 mt-6 mx-auto gap-4 gap-x-16">
        <FloatingLabelInput
          classname="max-w-md"
          label="Username"
          value={username}
          required
          isDisabled={true}
          onChange={setUsername}
        />
        <FloatingLabelInput
          classname="max-w-md"
          label="Email"
          required
          isDisabled={true}
          value={email}
          onChange={setEmail}
          type="email"
        />
        <FloatingLabelInput
          classname="max-w-md"
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
        />
        <FloatingLabelInput
          classname="max-w-md"
          label="Name"
          value={name}
          onChange={setName}
        />
        <FloatingLabelInput
          classname="max-w-md"
          label="Address"
          value={address}
          onChange={setAddress}
        />
        <FloatingLabelInput
          classname="max-w-md"
          label="City"
          value={city}
          onChange={setCity}
        />
        <FloatingLabelInput
          classname="max-w-md"
          label="Country"
          value={country}
          onChange={setCountry}
        />
        <FloatingLabelInput
          classname="max-w-md"
          label="Zipcode"
          value={zipcode}
          onChange={setZipcode}
        />
      </div>
      {user?.role !== Role.admin && (
        <div className="mb-6 text-start text-h-color col-span-2">
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
      )}
      <button
        type="submit"
        className="py-2 px-3 w-fit mt-3 rounded-lg font-semibold button-style col-span-2 disabled:bg-gray-600"
        disabled={updateUserLoading}
      >
        {updateUserLoading ? <Load /> : "Update Profile"}
      </button>
    </form>
  );
};

export default UpdateUser;
