import { useNotificationData } from "@/hooks/useQueryData";
import CustomSelect from "@/ui/CustomSelect";
import { Pointer } from "lucide-react";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const notification = [
  {
    title: "Referral Code Offer",
    meassage:
      "Dear students you get 10% discount on all courses by using referral code. For referral code you can contract us  9849168659.",
  },
];

export default function DashboardNotification() {
  const { data, isLoading, isError } = useNotificationData();

  const [active, setActive] = useState("push notification");

  return (
    <div className="py-5 bg-white rounded-xl">
      <div className="px-5 flex justify-between items-center mb-5">
        <h2 className="text-[#4C4C4C] text-lg font-semibold">Notification</h2>
        <CustomSelect placeholder="All Users" />
      </div>
      <div className="flex flex-col gap-5 px-5">
        <div className="flex gap-4">
          <div
            className={`text-sm font-medium cursor-pointer ${
              active === "push notification"
                ? "text-[#4365a7] border-b-2 border-[#4365a7]"
                : "text-[#4D4D4D]"
            }`}
            onClick={() => setActive("push notification")}
          >
            Push Notifications
          </div>
          <div
            className={`text-sm font-medium cursor-pointer ${
              active === "announcement"
                ? "text-[#4365a7] border-b-2 border-[#4365a7]"
                : "text-[#4D4D4D]"
            }`}
            onClick={() => setActive("announcement")}
          >
            Announcements
          </div>
        </div>
        <div>
          {data?.data
            ?.filter((item) => item.notificationType === active)
            ?.map((item, index) => (
              <div
                key={index}
                className="bg-[#F7F9FC] p-4 rounded-xl flex justify-between"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-[#4D4D4D] text-base font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-[#666666] text-sm font-normal">
                    {item.description}
                  </p>
                </div>
                <div>
                  <BsThreeDotsVertical
                    color="#4365a7"
                    fontSize={18}
                    cursor="pointer"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
