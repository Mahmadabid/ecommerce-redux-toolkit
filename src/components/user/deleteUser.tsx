import { UserFetch } from "@/redux/slices/types";
import React, { useState } from "react";
import UserToDelete from "./userToDelete";

interface DeleteUserProps {
  Users: UserFetch[];
  id: string | undefined;
  refetch: () => void;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      visible: boolean;
      remove: boolean;
    }>
  >;
  isFetching: boolean;
}

const DeleteUser: React.FC<DeleteUserProps> = ({
  Users,
  id,
  refetch,
  setNotification,
  isFetching,
}) => {
  const [deleteUserError, setDeleteUserError] = useState<string | null>(null);

  return (
    <div>
      <p className="text-red-500 my-2">{deleteUserError}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 my-4 lg:grid-cols-3">
        {Users.map((UserData: UserFetch) => (
          <UserToDelete
            UserData={UserData}
            key={UserData.id}
            id={id}
            refetch={refetch}
            setNotification={setNotification}
            isFetching={isFetching}
            setDeleteUserError={setDeleteUserError}
          />
        ))}
      </div>
    </div>
  );
};

export default DeleteUser;
