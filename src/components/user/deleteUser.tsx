import { UserFetch } from "@/redux/slices/types";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Load from "../utils/Load";
import { useDeleteUserMutation } from "@/redux/slices/user";
import React, { useState } from "react";

interface DeleteUserProps {
  Users: UserFetch[];
  id: string | undefined;
  refetch: () => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const DeleteUser: React.FC<DeleteUserProps> = ({
  Users,
  id,
  refetch,
  setError,
}) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const [deleteUser, { error: deleteUserError = "" }] = useDeleteUserMutation();

  const handleDelete = async (id: string, adminId: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      setError(null);
      await deleteUser({ id, adminId });
      await refetch();
    } catch (_) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
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
              onClick={() => handleDelete(UserData.id || '', id || "")}
              className="text-[#632B24] ml-4 disabled:text-gray-600 hover:text-[#81342a]"
              disabled={!UserData.id}
            >
              {loadingStates[UserData.id || ''] ? (
                <Load className="fill-black w-6 h-6" />
              ) : (
                <FontAwesomeIcon icon={faTrash} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeleteUser;
