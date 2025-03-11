import { Outlet } from "react-router-dom";
import login from "../assets/logo.svg";

const AuthLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen ">
      <div className="flex  sm:items-center sm:justify-center sm:p-0">
        <div className="bg-[#121212] flex flex-col px-[150px] lg:px-8 md:px-6 sm:px-3 pt-[70px]   w-1/2">
          <img src={login} alt="" className="ml-10 w-80 h-80" />
          <p className="text-[#C9BDF6] text-3xl font-bold text-center">
            Risk Management <br /> System
          </p>
        </div>
        <div className="md:w-full w-1/2 h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
