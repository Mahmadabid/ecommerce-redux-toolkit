import { UserFetch } from "@/redux/slices/types";
import React, { useState } from "react";
import UserToDelete from "./userToDelete";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DeleteUserProps {
  Users: UserFetch[];
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
  setNotification,
  isFetching,
}) => {
  const [deleteUserError, setDeleteUserError] = useState<string | null>(null);

  return (
    <div>
      <p className="text-red-500 my-2">{deleteUserError}</p>
      <div className="font-semibold my-5 text-h-color">Deleting seller <div className="inline-flex items-center justify-center p-[6px] border rounded-lg shadow-lg button-style transition duration-300">
          <FontAwesomeIcon icon={faCartShopping} className="text-sm" />
        </div> will also delete their products</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 my-4 lg:grid-cols-3">
        {Users.map((UserData: UserFetch) => (
          <UserToDelete
            UserData={UserData}
            key={UserData.id}
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
