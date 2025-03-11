import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    Monthly: 4000,
    Daily: 2400,
    Yearly: 2400,
  },
  {
    name: "Feb",
    Monthly: 3000,
    Daily: 1398,
    Yearly: 2210,
  },
  {
    name: "Mar",
    Monthly: 2000,
    Daily: 9800,
    Yearly: 2290,
  },
  {
    name: "Apr",
    Monthly: 2780,
    Daily: 3908,
    Yearly: 2000,
  },
  {
    name: "May",
    Monthly: 1890,
    Daily: 4800,
    Yearly: 2181,
  },
  {
    name: "Jun",
    Monthly: 2390,
    Daily: 3800,
    Yearly: 2500,
  },
  {
    name: "Jul",
    Monthly: 3490,
    Daily: 4300,
    Yearly: 2100,
  },
];

const legends = [
  { color: "bg-[#4365a7]", name: "Daily" },
  { color: "bg-[#4D8AFF]", name: "Monthly" },
  { color: "bg-[#ABBCDD]", name: "Yearly" },
];

export default function UserTrends() {
  const CustomLegend = () => (
    <div className="flex gap-2 items-center">
      {legends.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
          <p className="text-[#667085] text-sm font-normal">{item.name}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="p-5 bg-white rounded-xl"
      style={{ width: "100%", height: "300px" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#4C4C4C] text-lg font-semibold">User Trends</h2>
        <CustomLegend />
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 30,
            }}
          >
            <XAxis dataKey="name" />
            {/* <Legend/> */}
            {/* <Tooltip /> */}
            <Line
              type="monotone"
              dataKey="Daily"
              stroke="#4365a7"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Monthly"
              stroke="#4D8AFF"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Yearly"
              stroke="#ABBCDD"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
