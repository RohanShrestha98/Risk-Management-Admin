import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function BaseLayout() {
    const [hideSidebar, setHideSidebar] = useState(false)
    return (
        <div className="flex ">
            <div className={`${hideSidebar ? "w-16" : "w-1/6"} h-screen overflow-hidden sticky top-0`}>
                <Sidebar setHideSidebar={setHideSidebar} hideSidebar={hideSidebar} />
            </div>
            <div className={`${hideSidebar ? "w-full" : "w-5/6"} bg-[#f9f9f9]`}>
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}
