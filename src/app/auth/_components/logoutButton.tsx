import { logoutUser } from "../_lib/actions";

const LogoutButton = () => {
  return (
    <button
      type="submit"
      onClick={logoutUser}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
