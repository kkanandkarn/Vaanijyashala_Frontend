import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { fetchFromApi } from "../../store/apiSlice";
import { format, parseISO, isValid } from "date-fns";

const COLORS = ["#E51B18", "#18E51B"];
const RADIAN = Math.PI / 180;

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * 0.5 * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface StateData {
  id: string;
  title: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  districts: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  statusCode: number;
  data: {
    states: StateData[];
  };
}

interface ChartData {
  time: string;
  value: number;
}

const calculateHourlyData = (states: StateData[]): ChartData[] => {
  const now = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    return date.toISOString().slice(0, 13); // Format as YYYY-MM-DDTHH
  }).reverse();

  const statePresence = hours.map((hour) => {
    const found = states.some((state) => {
      const createdHour = new Date(state.createdAt).toISOString().slice(0, 13);
      const updatedHour = new Date(state.updatedAt).toISOString().slice(0, 13);
      return createdHour === hour || updatedHour === hour;
    });
    return { time: hour, value: found ? 1 : 0 };
  });

  return statePresence;
};

const DataOperatorDashboard: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [totalState, setTotalState] = useState(0);

  const [totalDistrict, setTotalDistrict] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ApiResponse = await fetchFromApi<ApiResponse>(
          "/state/view-states",
          "GET"
        );
        if (response.status === "success") {
          const processedData = calculateHourlyData(response.data.states);
          setData(processedData);
          const states = response.data.states;

          const totalStates = states.length;
          const totalDistricts = states.reduce(
            (acc, state) => acc + state.districts.length,
            0
          );

          setTotalState(totalStates);
          setTotalDistrict(totalDistricts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const stateData = [
    { name: "Total States + total District", value: 816 },
    { name: "Added States + districts", value: totalState + totalDistrict },
  ];

  const formatXAxis = (tickItem: string) => {
    const date = parseISO(tickItem);
    return isValid(date) ? format(date, "MMM d, HH:mm") : "";
  };

  return (
    <div className="flex flex-col justify-evenly">
      <div className="flex flex-wrap gap-2 mt-8 justify-evenly">
        <div className="bg-slate-700 w-2/12 h-44 shadow p-4 rounded-lg flex flex-col justify-evenly items-center">
          <div className="text-white text-center font-bold font-Poppins text-xl">
            Total States:
          </div>
          <div className="text-white text-center font-bold font-Poppins text-xl">
            28
          </div>
        </div>
        <div className="bg-slate-700 w-2/12 h-44 shadow p-4 rounded-lg flex flex-col justify-evenly items-center">
          <div className="text-white text-center font-bold font-Poppins text-xl">
            Total Districts:
          </div>
          <div className="text-white text-center font-bold font-Poppins text-xl">
            788
          </div>
        </div>
        <div className="bg-slate-700 w-2/12 h-44 shadow p-4 rounded-lg flex flex-col justify-evenly items-center">
          <div className="text-white text-center font-bold font-Poppins text-xl">
            Added States:
          </div>
          <div className="text-white text-center font-bold font-Poppins text-xl">
            {totalState}
          </div>
        </div>
        <div className="bg-slate-700 w-2/12 h-44 shadow p-4 rounded-lg flex flex-col justify-evenly items-center">
          <div className="text-white text-center font-bold font-Poppins text-xl">
            Added Districts:
          </div>
          <div className="text-white text-center font-bold font-Poppins text-xl">
            {totalDistrict}
          </div>
        </div>
        <div className="w-2/12 h-44 bg-slate-700 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stateData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-8 justify-evenly"></div>
      <div className="w-full h-80 bg-slate-700 rounded-lg mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FFFFFF"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataOperatorDashboard;
