import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import TopProducts from "../../components/TopProducts";
import RevenueChart from "../../components/RevenueChart";
import {
  FaShoppingCart,
  FaUsers,
  FaMoneyBill,
  FaTruck
} from "react-icons/fa";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <AdminHeader title="Dashboard" />

        <div className="p-8">
          <div className="grid grid-cols-4 gap-6">

            {/* Tổng đơn */}
            <StatCard
              icon={<FaShoppingCart />}
              title="Tổng đơn"
              value={data.totalOrders}
              color="bg-blue-500"
            />

            {/* Đơn chờ */}
            <StatCard
              icon={<FaTruck />}
              title="Chờ xử lý"
              value={data.pendingOrders}
              color="bg-yellow-500"
            />

            {/* Doanh thu */}
            <StatCard
              icon={<FaMoneyBill />}
              title="Doanh thu"
              value={data.totalRevenue.toLocaleString() + " đ"}
              color="bg-green-500"
            />

            {/* Users */}
            <StatCard
              icon={<FaUsers />}
              title="Người dùng"
              value={data.totalUsers}
              color="bg-purple-500"
            />



          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="col-span-2">
              <RevenueChart />
            </div>
            <TopProducts />
          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
      <div className={`${color} text-white p-4 rounded-full text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
