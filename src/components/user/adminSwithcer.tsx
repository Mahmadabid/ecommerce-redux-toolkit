import { Role } from "../utils/utils";

interface AdminSwithcerProps {
  role: Role | undefined;
  handleisAdmin: () => void;
  isAdmin: boolean;
  handleisAddUser: () => void;
  isAddUser: boolean;
}

const AdminSwithcer: React.FC<AdminSwithcerProps> = ({
  role,
  handleisAdmin,
  isAdmin,
  handleisAddUser,
  isAddUser,
}) => {
  return (
    role === Role.admin && (
      <>
        <div className="flex justify-center space-x-16">
          <button
            onClick={handleisAdmin}
            className={`button-style p-3 py-2 rounded font-semibold disabled:bg-gray-500`}
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
        {isAdmin && (
          <div>
            <div className="w-[600px] my-4 h-[2px] bg-gray-200" />
            <div className="flex justify-center space-x-16">
              <button
                onClick={handleisAddUser}
                className={`bg-[#632B24] hover:bg-white hover:text-[#632B24] font-semibold text-white border hover:border-[#632B24] p-2 rounded disabled:bg-gray-500 disabled:hover:text-white disabled:border-none`}
                disabled={!isAddUser}
              >
                Delete User
              </button>
              <button
                onClick={handleisAddUser}
                className={`bg-[#22492d] text-white font-semibold hover:border-[#22492d] border hover:bg-white hover:text-[#22492d] p-3 py-2 rounded disabled:bg-gray-500 disabled:hover:text-white disabled:border-none`}
                disabled={isAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default AdminSwithcer;
