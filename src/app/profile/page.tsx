"use client";

import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import Notification from "@/components/products/Notification";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import { Role } from "@/components/utils/utils";
import { UserProps } from "@/redux/slices/types";
import {
  refreshAuthentication,
  useFetchCredentialsQuery,
} from "@/redux/slices/user";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(Role.buyer);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
  }>({
    message: "Updated Profile",
    visible: false,
  });

  useEffect(() => {
    dispatch(refreshAuthentication());
  }, [dispatch]);

  const handleAddUser = () => {
    setNotification({ message: `Updated Profile`, visible: true });
    setTimeout(() => {
      setNotification({ message: "Updated Profile", visible: false });
    }, 5000);
  };

  const {
    error: errorUsers = "",
    isLoading,
    refetch,
  } = useFetchCredentialsQuery({});

  useEffect(() => {
    if (!user?.ok) {
      router.push("/login");
    } else {
      setEmail(user.email);
      setUsername(user.username);
      setName(user.name);
      setAddress(user.address);
      setCity(user.city);
      setCountry(user.country);
      setZipcode(user.zipcode);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { data: refetchedUsers = [], error: refetchError } = await refetch();

    if (refetchError) {
      setError("Failed to fetch users. Please try again.");
      return;
    }
  
    const userNameExists = refetchedUsers.some(
      (user: UserProps) => user.username === username
    );
  
    if (userNameExists) {
      setError("Username is already taken. Please choose another.");
      return;
    }

    handleAddUser();
    console.log({
      email,
      username,
      name,
      address,
      city,
      country,
      zipcode,
      password,
      role,
    });
  };

  if (isLoading) return <PageLoad />;
  if (errorUsers) return <PageError />;

  return (
    <div className="text-center flex justify-center items-center flex-col">
      <h1 className="text-4xl my-4 font-bold text-h-color">Profile</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 my-2">{error}</p>}
        <div className="grid grid-cols-1 fsm:grid-cols-2 mt-6 mx-auto gap-4 gap-x-16">
          <FloatingLabelInput
            classname="max-w-md"
            label="Username"
            required
            value={username}
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
        <button
          type="submit"
          className="py-2 px-3 w-fit mt-3 rounded-lg font-semibold button-style col-span-2"
        >
          Update Profile
        </button>
      </form>
      <Notification {...notification} />
    </div>
  );
};

export default Profile;
