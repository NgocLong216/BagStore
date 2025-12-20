import { FaUsers, FaChartBar, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
     ${isActive
        ? "bg-white text-green-700"
        : "hover:bg-white hover:text-green-700"
     }`;

  return (
    <aside className="w-64 bg-[#2c5f2d] text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div
        className="p-6 text-2xl font-bold flex justify-center border-b border-white/20 cursor-pointer hover:text-green-300"
        onClick={() => navigate("/")}
      >
        My Store
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/admin" end className={linkClass}>
          <FaChartBar /> Thống kê
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <FaUsers /> Người dùng
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          <FaShoppingBag /> Sản phẩm
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-4 border-t border-white/20 hover:bg-white/10"
      >
        <FaSignOutAlt />
        Đăng xuất
      </button>
    </aside>
  );
}
