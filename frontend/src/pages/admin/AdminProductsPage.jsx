import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers(await res.json());
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Avatar</th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4">Active</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.userId}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  <img
                    src={
                      u.avatar
                        ? `http://localhost:8080${u.avatar}`
                        : "https://i.pravatar.cc/40"
                    }
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-4 font-medium">{u.username}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.phone || "-"}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  {u.active ? "✅" : "❌"}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {u.createdAt?.slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
