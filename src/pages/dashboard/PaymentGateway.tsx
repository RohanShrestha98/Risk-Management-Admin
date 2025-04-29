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
import { useRiskData } from "@/hooks/useQueryData";

export default function PaymentGateway() {
  const { data: riskData } = useRiskData();
  const low = riskData?.data?.filter((item) => item?.impact == "low");
  const medium = riskData?.data?.filter((item) => item?.impact == "medium");
  const high = riskData?.data?.filter((item) => item?.impact == "high");
  const critical = riskData?.data?.filter((item) => item?.impact == "critical");

  const data = [
    {
      name: "Impact",
      Low: low?.length,
      Medium: medium?.length,
      High: high?.length,
      Critical: critical?.length,
    },
  ];

  const legends = [
    { name: "Low", amount: low?.length },
    { name: "Medium", amount: medium?.length },
    { name: "High", amount: high?.length },
    { name: "Critical", amount: critical?.length },
  ];
  // Custom legend component
  const CustomLegend = () => (
    <div className="flex gap-2 justify-center">
      {legends.map((item, index) => (
        <div
          className="border border-[#F2F2F2] rounded-xl px-2 py-2 cursor-pointer flex flex-col gap-1"
          key={index}
        >
          <div className="flex items-center gap-1">
            <img src={item?.image} alt="" />
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
      <h2 className="text-[#4C4C4C] text-lg font-semibold mb-5">Impact</h2>
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
              dataKey="Low"
              barSize={20}
              fill="#F28D20"
              radius={[0, 10, 10, 0]}
            />
            <Bar
              dataKey="Medium"
              barSize={20}
              fill="#5C2D91"
              radius={[0, 10, 10, 0]}
            />
            <Bar
              dataKey="High"
              barSize={20}
              fill="#60BB47"
              radius={[0, 10, 10, 0]}
            />
            <Bar
              dataKey="Critical"
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
