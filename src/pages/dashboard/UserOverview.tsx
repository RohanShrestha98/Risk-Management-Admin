import { useCourseData } from "@/hooks/useQueryData";
import CustomSelect from "@/ui/CustomSelect";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data01 = [
  { name: "Free", value: 100 },
  { name: "Paid", value: 45 },
  { name: "Active", value: 35 },
  { name: "Expired", value: 55 },
];
const COLORS = ["#FDE047", "#1E3A8A", "#22C55E", "#E05252"];

const legends = [
  { color: "bg-[#FDE047]", name: "Free", amount: 100 },
  { color: "bg-[#1E3A8A]", name: "Paid", amount: 45 },
  { color: "bg-[#22C55E]", name: "Active", amount: 35 },
  { color: "bg-[#E05252]", name: "Expired", amount: 55 },
];

export default function UserOverview() {
  const CustomLegend = () => (
    <div className="px-5 flex gap-2 justify-center">
      {legends.map((item, index) => (
        <div
          className="border border-[#F2F2F2] rounded-xl px-3 py-2 cursor-pointer flex flex-col gap-1"
          key={index}
        >
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
            <p className="text-[#808080] font-medium text-sm">{item.name}</p>
          </div>
          <p className="text-[#4C4C4C] font-semibold text-base">{item.amount}</p>
        </div>
      ))}
    </div>
  );

  const { data } = useCourseData();
  const courseOptions = convertToSelectOptions(data?.data);
  return (
    <div className="py-5 bg-white rounded-xl">
      <div className="px-5 flex justify-between items-center">
        <h2 className="text-[#4C4C4C] text-lg font-semibold">User Overview</h2>
        {/* <CustomSelect placeholder="Select User" /> */}
      </div>
      <div className="my-5">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data01}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#8884d8"
            >
              {data01.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
    </div>
  );
}
