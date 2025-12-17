import { NavLink } from "react-router-dom";
import {
  FaAddressBook,
  FaMapMarkerAlt,
  FaLock,
  FaBell,
  FaCog,
  FaListAlt,
} from "react-icons/fa";

export default function Sidebar() {
  // Lấy user từ localStorage
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const username = savedUser.username || "Khách";
  const avatar = savedUser.avatar
  ? `http://localhost:8080${savedUser.avatar}`
  : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp";

  
  const menuItems = [
    { path: "/profile", label: "Hồ Sơ", icon: <FaAddressBook /> },
    { path: "/address", label: "Địa Chỉ", icon: <FaMapMarkerAlt /> },
    { path: "/password", label: "Mật Khẩu", icon: <FaLock /> },
    { path: "/notice", label: "Thông Báo", icon: <FaBell /> },
    { path: "/setting", label: "Thiết Lập", icon: <FaCog /> },
  ];

  return (
    <aside className="w-64 p-5 bg-green-800 text-white rounded-2xl">
      {/* Profile */}
      <div className="text-center mb-8">
        <img
          src={avatar}
          alt="avatar"
          className="w-16 h-16 rounded-full mx-auto"
        />
        <div className="mt-3 font-bold">{username}</div>
      </div>

      {/* Menu */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg transition ${
                    isActive
                      ? "bg-white text-green-700 font-semibold"
                      : "hover:bg-white hover:text-green-700"
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Other menu */}
        <ul className="mt-6 pt-4 border-t border-gray-500">
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg transition ${
                  isActive
                    ? "bg-white text-green-700 font-semibold"
                    : "hover:bg-white hover:text-green-700"
                }`
              }
            >
              <FaListAlt /> Đơn Mua
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
