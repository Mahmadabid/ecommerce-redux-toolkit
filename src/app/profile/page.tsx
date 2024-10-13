"use client";

import Notification from "@/components/products/Notification";
import AddUser from "@/components/user/addUser";
import AdminSwithcer from "@/components/user/adminSwithcer";
import DeleteUser from "@/components/user/deleteUser";
import UpdateUser from "@/components/user/updateUser";
import PageError from "@/components/utils/pageError";
import PageLoad from "@/components/utils/pageLoad";
import PageLogin from "@/components/utils/pageLogin";
import {
  useFetchCredentialsQuery,
} from "@/redux/slices/user";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [isAdmin, setIsAdmin] = useState(false);
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
    error: errorUsers = "",
    isFetching,
    refetch,
  } = useFetchCredentialsQuery({});

  const handleisAdmin = () => {
    setIsAdmin((state) => !state);
  };

  const handleisAddUser = () => {
    setIsAddUser((state) => !state);
  };

  if (!user) return <PageLogin message="Login to view Profile" />;
  if (isFetching) return <PageLoad />;
  if (errorUsers) return <PageError />;

  return (
    <div className="text-center flex justify-center items-center flex-col">
      <h1 className="text-4xl my-4 font-bold text-h-color">
        {isAdmin ? "Admin" : "Profile"}
      </h1>
      <AdminSwithcer
        role={user?.role}
        isAdmin={isAdmin}
        handleisAdmin={handleisAdmin}
        handleisAddUser={handleisAddUser}
        isAddUser={isAddUser}
      />
      {isAdmin ? (
        isAddUser ? (
          <AddUser setNotification={setNotification} />
        ) : (
          <DeleteUser
            Users={Users}
            id={user?.id}
            refetch={refetch}
            setNotification={setNotification}
            isFetching={isFetching}
          />
        )
      ) : (
        <UpdateUser setNotification={setNotification} user={user} />
      )}
      <Notification {...notification} />
    </div>
  );
};

export default Profile;
