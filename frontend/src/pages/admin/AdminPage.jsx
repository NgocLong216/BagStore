import { FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaBell, FaShoppingBag } from "react-icons/fa";
import { Link, useNavigate, NavLink } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // hoặc "/"
    window.location.reload(); // đảm bảo App re-render lại user = null
  };

  const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
   ${isActive
     ? "bg-white text-green-700"
     : "hover:bg-white hover:text-green-700"
   }`;


  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar/>
      {/* Main */}
      <main className="flex-1">
        {/* Topbar */}
        <AdminHeader title="Thống Kê Dữ Liệu" />

        {/* Content */}
        <section className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Purchases" value="17,663" />
            <StatCard title="Refunds" value="$4,523" />
            <StatCard title="Visitors" value="46,085" />
          </div>

          {/* User table */}
          <div className="bg-white rounded-xl shadow">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">User Management</h2>
              <button className="px-4 py-2 bg-[#2c5f2d] text-white rounded-lg">Add User</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(i => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">User {i}</td>
                    <td className="p-3">user{i}@mail.com</td>
                    <td className="p-3">0123456789</td>
                    <td className="p-3">USER</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
