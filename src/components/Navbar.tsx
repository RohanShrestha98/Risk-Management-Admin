import { useLocation } from "react-router-dom";
import profile from "../assets/profile.svg";
import { IoNotificationsOutline } from "react-icons/io5";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const loaction = useLocation();
  const headerName = capitalizeFirstLetter(loaction.pathname?.slice(1)).replace(
    /[-/]/g,
    " "
  );
  const { user } = useAuthStore();
  const [showNotification, setShowNotification] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border-b sticky top-0 flex items-center z-10 bg-white justify-between h-14 w-full px-6">
      <h1 className="font-semibold text-md text-[#808080]">
        {headerName === "" ? "Dashboard" : headerName}
      </h1>
      <div className="flex items-center gap-3">
        <div className="relative inline-block">
          <button
            ref={buttonRef}
            onClick={() => setShowNotification(!showNotification)}
            className="px-4 py-2 cursor-pointer rounded-lg  transition duration-200"
          >
            <div className="border-r pr-3 text-[#374253] ">
              <IoNotificationsOutline
                className="border shadow rounded-full p-2"
                size={36}
              />
            </div>
          </button>

          {showNotification && (
            <div className="absolute left-[-60px] mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
              <h4 className="font-semibold text-gray-800">New Messages!</h4>
              <p className="text-sm text-gray-600 mt-2">
                You have 3 unread messages.
              </p>
            </div>
          )}
        </div>
        <div></div>
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
