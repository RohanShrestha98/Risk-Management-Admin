import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import dashCash from "../../assets/dashDollar.png";
import dashKhalti from "../../assets/dashKhalti.png";
import dasheSewa from "../../assets/dasheSewa.png";

const data = [
  {
    name: "Payment Gateway",
    Cash: 35,
    Khalti: 20,
    eSewa: 40,
  },
];

const legends = [
  { image: dashCash, name: "Cash", amount: 35 },
  { image: dashKhalti, name: "Khalti", amount: 20 },
  { image: dasheSewa, name: "eSewa", amount: 40 },
];

export default function PaymentGateway() {
  // Custom legend component
  const CustomLegend = () => (
    <div className="flex gap-2 justify-center">
      {legends.map((item, index) => (
        <div
          className="border border-[#F2F2F2] rounded-xl px-2 py-2 cursor-pointer flex flex-col gap-1"
          key={index}
        >
          <div className="flex items-center gap-1">
            <img src={item.image} alt="" />
            <p className="text-[#808080] font-medium text-sm">{item.name}</p>
          </div>
          <p className="text-[#4C4C4C] font-semibold text-base">
            {item.amount}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-5 bg-white rounded-xl">
      <h2 className="text-[#4C4C4C] text-lg font-semibold mb-5">
        Rating Breakdown
      </h2>
      <div className="-ml-14">
        <ResponsiveContainer width="100%" height={150}>
          <ComposedChart
            layout="vertical"
            data={data}
            barCategoryGap={10}
            barGap={14}
          >
            <XAxis type="number" axisLine={false} tick={null} />
            <YAxis
              dataKey="name"
              type="category"
              scale="band"
              axisLine={false}
            />
            <Bar
              dataKey="Cash"
              barSize={20}
              fill="#F28D20"
              radius={[0, 10, 10, 0]}
            />
            <Bar
              dataKey="Khalti"
              barSize={20}
              fill="#5C2D91"
              radius={[0, 10, 10, 0]}
            />
            <Bar
              dataKey="eSewa"
              barSize={20}
              fill="#60BB47"
              radius={[0, 10, 10, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
    </div>
  );
}
