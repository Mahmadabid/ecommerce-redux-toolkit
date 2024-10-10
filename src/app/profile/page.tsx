"use client";

import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import Notification from "@/components/products/Notification";
import Load from "@/components/utils/Load";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import { Role } from "@/components/utils/utils";
import { UserFetch, UserProps } from "@/redux/slices/types";
import {
  refreshAuthentication,
  useDeleteUserMutation,
  useFetchCredentialsQuery,
  useUpdateUserMutation,
} from "@/redux/slices/user";
import { RootState } from "@/redux/store";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const [id, setId] = useState("");
  const [role, setRole] = useState(Role.buyer);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
  }>({
    message: "Updated Profile",
    visible: false,
  });

  const [initialUserData, setInitialUserData] = useState({
    email: "",
    username: "",
    name: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
    role: Role.buyer,
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
    data: Users = [],
    error: errorUsers = "",
    isLoading,
    refetch,
  } = useFetchCredentialsQuery({});

  useEffect(() => {
    if (!user?.ok) {
      router.push("/login");
    } else {
      const initialData = {
        email: user.email,
        username: user.username,
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
      setId(user.id);
    }
  }, [user]);

  const [
    updateUser,
    { error: updateUserError = "", isLoading: updateUserLoading },
  ] = useUpdateUserMutation();

  const [
    deleteUser,
    { error: deleteUserError = "", isLoading: deleteUserLoading },
  ] = useDeleteUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const hasChanges =
        username !== initialUserData.username ||
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

      const { data: refetchedUsers = [], error: refetchError } =
        await refetch();

      if (refetchError) {
        setError("Failed to fetch users. Please try again.");
        return;
      }

      const userNameExists = refetchedUsers.some(
        (User: UserProps) => User.username === username
      );

      if (userNameExists && username !== user?.username) {
        setError("Username is already taken. Please choose another.");
        return;
      }

      await updateUser({
        id,
        email,
        username: username !== user?.username ? username : "",
        name,
        address,
        city,
        country,
        zipcode,
        password,
        role,
      });

      if (!updateUserError) {
        handleAddUser();
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleisAdmin = () => {
    setIsAdmin((state) => !state);
  };

  const handleDelete = async (id: string, adminId: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      setError(null);
      await deleteUser({ id, adminId });
      await refetch();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (isLoading) return <PageLoad />;
  if (errorUsers) return <PageError />;

  return (
    <div className="text-center flex justify-center items-center flex-col">
      <h1 className="text-4xl my-4 font-bold text-h-color">
        {isAdmin ? "Admin" : "Profile"}
      </h1>
      {user?.role === Role.admin && (
        <div className="flex justify-center space-x-16">
          <button
            onClick={handleisAdmin}
            className={`button-style p-3 py-2 rounded disabled:bg-gray-500`}
            disabled={!isAdmin}
          >
            Profile
          </button>
          <button
            onClick={handleisAdmin}
            className={`login-button p-3 py-2 rounded disabled:bg-gray-500`}
            disabled={isAdmin}
          >
            Admin
          </button>
        </div>
      )}
      {isAdmin ? (
        <>
          <p className="text-red-500 my-2">
            {deleteUserError
              ? "data" in deleteUserError &&
                typeof deleteUserError.data === "object" &&
                deleteUserError.data !== null
                ? (deleteUserError.data as { message: string }).message ||
                  "Error occurred while updating profile"
                : "Error occurred while updating profile"
              : null}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 my-4 lg:grid-cols-3">
            {Users.map((UserData: UserFetch) => (
              <div
                key={UserData.id}
                className="flex justify-between items-center border border-gray-300 shadow-lg p-4 rounded-md bg-white relative"
              >
                <div className="flex flex-col items-center justify-center flex-1">
                  <p className="font-semibold">{UserData.email}</p>
                  <p className="text-sm text-gray-500">{UserData.username}</p>
                </div>
                <button
                  onClick={() => handleDelete(UserData.id, user?.id || "")}
                  className="text-[#632B24] ml-4 hover:text-[#81342a]"
                >
                  {loadingStates[UserData.id] ? (
                    <Load className="fill-black w-6 h-6" />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 my-2">{error}</p>}
          <p className="text-red-500 my-2">
            {updateUserError
              ? "data" in updateUserError &&
                typeof updateUserError.data === "object" &&
                updateUserError.data !== null
                ? (updateUserError.data as { message: string }).message ||
                  "Error occurred while updating profile"
                : "Error occurred while updating profile"
              : null}
          </p>
          <div className="grid grid-cols-1 fsm:grid-cols-2 mt-6 mx-auto gap-4 gap-x-16">
            <FloatingLabelInput
              classname="max-w-md"
              label="Username"
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
            disabled={updateUserLoading || loading}
          >
            {updateUserLoading || loading ? <Load /> : "Update Profile"}
          </button>
        </form>
      )}
      <Notification {...notification} />
    </div>
  );
};

export default Profile;
