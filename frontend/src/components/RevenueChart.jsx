import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function RevenueChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(
            "http://localhost:8080/api/admin/dashboard/revenue-by-month?year=2025",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then(res => res.json())
            .then(setData);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-12">
            <h2 className="text-lg font-semibold mb-4">
                Doanh thu theo tháng
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                    <XAxis dataKey="month" />
                    <YAxis
                        width={80}
                        tickFormatter={v => v.toLocaleString()}
                    />
                    <Tooltip formatter={v => v.toLocaleString() + " đ"} />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        strokeWidth={3}
                        name="Doanh thu"
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}
