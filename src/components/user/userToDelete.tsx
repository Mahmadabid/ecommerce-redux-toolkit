import { UserFetch } from "@/redux/slices/types";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Load from "../utils/Load";
import { useDeleteUserMutation } from "@/redux/slices/user";

interface UserToDeleteProps {
  UserData: UserFetch;
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
  setDeleteUserError: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserToDelete: React.FC<UserToDeleteProps> = ({
  UserData,
  id,
  refetch,
  setNotification,
  isFetching,
  setDeleteUserError,
}) => {
  const handleDeleteNotification = () => {
    setNotification({
      message: `Deleted Profile`,
      visible: true,
      remove: true,
    });
    setTimeout(() => {
      setNotification({
        message: "Deleted Profile",
        visible: true,
        remove: false,
      });
    }, 5000);
  };

  const [
    deleteUser,
    { error: deleteUserError = "", isLoading: deleteUserLoading },
  ] = useDeleteUserMutation();

  const handleDelete = async (id: string, adminId: string) => {
    try {
      setDeleteUserError(null);
      await deleteUser({ id, adminId });
      if (!deleteUserError) {
        await refetch();
        handleDeleteNotification();
      }
    } catch (error) {
      const errorMessage = deleteUserError
        ? "data" in deleteUserError &&
          typeof deleteUserError.data === "object" &&
          deleteUserError.data !== null
          ? (deleteUserError.data as { message: string }).message ||
            "Error occurred while deleting the product"
          : "Error occurred while deleting the product"
        : "Unknown error occurred";

      setDeleteUserError(errorMessage);
    }
  };

  return (
    <div className="flex justify-between items-center border border-gray-300 shadow-lg p-4 rounded-md bg-white relative">
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="font-semibold">{UserData.email}</p>
        <p className="text-sm text-gray-500">{UserData.username}</p>
      </div>
      <button
        onClick={() => handleDelete(UserData.id || "", id || "")}
        className="text-[#632B24] ml-4 disabled:text-gray-600 hover:text-[#81342a]"
        disabled={!UserData.id || deleteUserLoading || isFetching}
      >
        {deleteUserLoading || isFetching ? (
          <Load className="fill-black w-6 h-6" />
        ) : (
          <FontAwesomeIcon icon={faTrash} />
        )}
      </button>
    </div>
  );
};

export default UserToDelete;
