import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import LogoutModal from "./LogoutModal";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { DiAsterisk } from "react-icons/di";
import { FiUsers } from "react-icons/fi";
import { TbReportSearch } from "react-icons/tb";
import SideBarItems from "./SideBarItems";
import { useAuthStore } from "@/store/useAuthStore";

export default function Sidebar({ hideSidebar, setHideSidebar }) {
  const [active, setActive] = useState(window.location.pathname);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.data?.role?.id;

  useEffect(() => {
    setActive(window.location.pathname);
  }, [window.location.pathname]);
  const sidebar = [
    { id: 7, name: "Dashboard", icon: <LuLayoutDashboard />, link: "/" },
    {
      id: 1,
      name: "Notification",
      icon: <IoNotificationsOutline />,
      link: "/notification",
    },
    { id: 2, name: "Risk Table", icon: <DiAsterisk />, link: "/risk" },
    {
      id: 3,
      name: "Users",
      visiable: role == 1 ? false : true,
      icon: <FiUsers />,
      link: "/user",
    },
    // { id: 4, name: "Task", icon: <GoTasklist />, link: "/task" },
    {
      id: 5,
      name: "Risk Details",
      icon: <TbReportSearch />,
      link: "/risk-details",
    },
    { id: 6, name: "Settings", icon: <IoSettingsOutline />, link: "/settings" },
  ];

  const handleActive = (item) => {
    setActive(item?.link);
    navigate(`${item?.link}`);
  };

  return (
    <div className="border-r h-full w-full flex flex-col ">
      <div
        onClick={() => {
          setActive("/");
          navigate("/");
        }}
        className="flex md:justify-center p-4 gap-1 items-center mb-3"
      >
        <img className="h-12 w-12" src={logo} alt="logo" />
        <div className="font-bold text-sm text-[#121212] flex flex-col">
          <p>Risk Management</p>
          <p className="mt-[-2px]">System</p>
        </div>
      </div>
      <div className="flex  flex-col  h-[84vh] overflow-auto no-scrollbar ">
        <div className="flex flex-col ">
          {sidebar?.map((item) => {
            if (!item?.visiable) {
              return (
                <SideBarItems
                  item={item}
                  handleActive={handleActive}
                  active={active}
                  hideSidebar={hideSidebar}
                />
              );
            }
          })}
        </div>
        {/* {sidebar?.map((items) => {
          return (
            <div key={items?.id} className="flex flex-col gap-2 ">
              {items?.map((item) => {
                return (
                  <SideBarItems
                    item={item}
                    handleActive={handleActive}
                    active={active}
                    hideSidebar={hideSidebar}
                  />
                );
              })}
            </div>
          );
        })} */}
      </div>
      <LogoutModal asChild>
        <div
          onClick={() => {}}
          className={`flex  px-4 py-[2px] font-medium items-center  gap-2 text-red-600  mt-4  border-l-4 border-transparent cursor-pointer `}
        >
          <div className="text-lg">
            <IoIosLogOut />
          </div>
          {!hideSidebar && <div className="line-clamp-1">Logout</div>}
        </div>
      </LogoutModal>
    </div>
  );
}
