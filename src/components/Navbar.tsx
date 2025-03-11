import { useLocation } from "react-router-dom";
import profile from "../assets/profile.svg";
import { IoNotificationsOutline } from "react-icons/io5";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const loaction = useLocation();
  const headerName = capitalizeFirstLetter(loaction.pathname?.slice(1)).replace(
    /[-/]/g,
    " "
  );
  const { user } = useAuthStore();

  return (
    <div className="border-b sticky top-0 flex items-center z-10 bg-white justify-between h-14 w-full px-6">
      <h1 className="font-semibold text-md text-[#808080]">
        {headerName === "" ? "Dashboard" : headerName}
      </h1>
      <div className="flex items-center gap-3">
        <div className="border-r pr-3 text-[#374253] ">
          <IoNotificationsOutline
            className="border shadow rounded-full p-2"
            size={36}
          />
        </div>
        <p className="text-[#4D4D4D] font-medium">
          {user?.data?.username ?? "Sakshii"}
        </p>
        <img
          src={profile}
          className="w-9 h-9 rounded-full object-cover"
          alt=""
        />
      </div>
    </div>
  );
}
