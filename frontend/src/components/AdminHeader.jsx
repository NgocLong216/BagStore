import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";

export default function AdminHeader({ title }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setAdmin(savedUser);
    }
  }, []);

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex items-center gap-6">
        <FaRegBell className="text-xl" />

        {admin && (
          <div className="flex items-center gap-2">
            <img
              src={
                admin.avatar
                  ? admin.avatar.startsWith("http")
                    ? admin.avatar
                    : `http://localhost:8080${admin.avatar}`
                  : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"
              }
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{admin.username}</p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
