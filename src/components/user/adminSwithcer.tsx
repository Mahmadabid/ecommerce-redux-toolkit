import { Role } from "../utils/utils";

interface AdminSwithcerProps {
  role: Role | undefined;
  handleProfileSwitcher: (value: number) => void;
  profileSwitcher: number;
  handleisAddUser: () => void;
  isAddUser: boolean;
}

const AdminSwithcer: React.FC<AdminSwithcerProps> = ({
  role,
  handleProfileSwitcher,
  profileSwitcher,
  handleisAddUser,
  isAddUser,
}) => {
  return (
    <>
      <div className="flex justify-center space-x-16 xxmd:space-x-3">
        <button
          onClick={() => handleProfileSwitcher(0)}
          className={`button-style p-3 py-2 xxmd:p-[6px] xxmd:py-1 rounded xxmd:!font-medium font-semibold disabled:bg-gray-500`}
          disabled={profileSwitcher === 0}
        >
          Profile
        </button>
        {role === Role.admin && (
          <button
          onClick={() => handleProfileSwitcher(1)}
            className={`login-button p-3 py-2 xxmd:p-[6px] xxmd:py-1 rounded xxmd:!font-medium disabled:bg-gray-500`}
            disabled={profileSwitcher === 1}
          >
            Admin
          </button>
        )}
        <button
          onClick={() => handleProfileSwitcher(2)}
          className={`button-style p-3 py-2 xxmd:p-[6px] xxmd:py-1 rounded xxmd:!font-medium font-semibold disabled:bg-gray-500`}
          disabled={profileSwitcher === 2}
        >
          Purchases
        </button>
      </div>
      {profileSwitcher === 1 && (
        <div>
          <div className="w-[600px] xmd:w-[400px] xxmd:w-full my-4 h-[2px] bg-gray-200" />
          <div className="flex justify-center space-x-16">
            <button
              onClick={handleisAddUser}
              className={`bg-[#632B24] hover:bg-white hover:text-[#632B24] font-semibold text-white border hover:border-[#632B24] p-2 xxmd:p-1 rounded xxmd:!font-medium disabled:bg-gray-500 disabled:hover:text-white disabled:border-none`}
              disabled={!isAddUser}
            >
              Delete User
            </button>
            <button
              onClick={handleisAddUser}
              className={`bg-[#22492d] text-white font-semibold hover:border-[#22492d] border hover:bg-white hover:text-[#22492d] p-3 py-2 xxmd:p-[6px] xxmd:py-1 rounded xxmd:!font-medium disabled:bg-gray-500 disabled:hover:text-white disabled:border-none`}
              disabled={isAddUser}
            >
              Add User
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSwithcer;
