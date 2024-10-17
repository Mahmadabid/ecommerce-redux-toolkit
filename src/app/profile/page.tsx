"use client";

import Notification from "@/components/products/Notification";
import AddUser from "@/components/user/addUser";
import AdminSwithcer from "@/components/user/adminSwithcer";
import DeleteUser from "@/components/user/deleteUser";
import Purchases from "@/components/user/Purchases";
import UpdateUser from "@/components/user/updateUser";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import PageLogin from "@/components/utils/pageLogin";
import { handleRtkQueryError } from "@/components/utils/utils";
import { useFetchCredentialsQuery } from "@/redux/slices/user";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [profileSwitcher, setProfileSwithcer] = useState(0);
  const [isAddUser, setIsAddUser] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    visible: boolean;
    remove: boolean;
  }>({
    message: "Success",
    visible: false,
    remove: false,
  });

  const {
    data: Users = [],
    error: errorUsers,
    isFetching,
    isLoading
  } = useFetchCredentialsQuery({});

  const handleProfileSwitcher = (value: number) => {
    setProfileSwithcer(value);
  };

  const handleisAddUser = () => {
    setIsAddUser((state) => !state);
  };

  if (!user) return <PageLogin message="Login to view Profile" />;
  if (isLoading) return <PageLoad />;
  if (errorUsers) return <PageError message={handleRtkQueryError(errorUsers)} />;

  return (
    <div className="text-center flex justify-center items-center flex-col">
      <h1 className="text-4xl my-4 font-bold text-h-color">
        {profileSwitcher === 1
          ? "Admin"
          : profileSwitcher === 2
          ? "Purchases"
          : "Profile"}
      </h1>
      <AdminSwithcer
        role={user?.role}
        profileSwitcher={profileSwitcher}
        handleProfileSwitcher={handleProfileSwitcher}
        handleisAddUser={handleisAddUser}
        isAddUser={isAddUser}
      />
      {profileSwitcher === 1 ? (
        isAddUser ? (
          <AddUser setNotification={setNotification} handleIsAddUser={handleisAddUser} />
        ) : (
          <DeleteUser
            Users={Users}
            setNotification={setNotification}
            isFetching={isFetching}
          />
        )
      ) : profileSwitcher === 0? (
        <UpdateUser setNotification={setNotification} user={user} />
      ): (<Purchases />)}
      <Notification {...notification} />
    </div>
  );
};

export default Profile;
