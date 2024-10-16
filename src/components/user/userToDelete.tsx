import { UserFetch } from "@/redux/slices/types";
import { faCartShopping, faTrash, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Load from "../utils/Load";
import { useDeleteUserMutation } from "@/redux/slices/user";
import { handleRtkQueryError, Role } from "../utils/utils";

interface UserToDeleteProps {
  UserData: UserFetch;
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
        visible: false,
        remove: false,
      });
    }, 5000);
  };

  const [
    deleteUser,
    { error: deleteUserError, isLoading: deleteUserLoading },
  ] = useDeleteUserMutation();

  const handleDelete = async (userId: string) => {
    try {
      setDeleteUserError(null);
      await deleteUser({ userId });
      if (!deleteUserError) {
        handleDeleteNotification();
      }
    } catch (error) {

      setDeleteUserError(handleRtkQueryError(deleteUserError));
    }
  };

  return (
    <div className="flex justify-between items-center border border-gray-300 shadow-lg p-4 rounded-md bg-white relative">
      {UserData.role === Role.seller || UserData.role === Role.admin ? (
        <div className="inline-flex items-center justify-center p-[6px] mr-2 border rounded-lg shadow-lg button-style transition duration-300">
          <FontAwesomeIcon icon={UserData.role === Role.admin? faUserTie: faCartShopping} className="text-sm" />
        </div>
      ) : null}
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="font-semibold">{UserData.email}</p>
        <p className="text-sm text-gray-500">{UserData.username}</p>
      </div>
      <button
        onClick={() => handleDelete(UserData.id || "")}
        className="text-[#632B24] ml-4 disabled:text-gray-600 hover:text-[#81342a]"
        disabled={
          UserData.role === Role.admin || deleteUserLoading || isFetching
        }
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
