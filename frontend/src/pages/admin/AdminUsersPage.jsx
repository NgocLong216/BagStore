import { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaBell } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách user");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
        setSelectedUser(data[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const f = users.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(f);
  }, [search, users]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1">
        <div>
          <AdminHeader title="Quản Lý Người Dùng" />
        </div>

        {/* LEFT CONTENT */}
        <div className="flex-1 p-8">
          <div className="flex gap-4 mb-6 w-[70%]">

            {/* Search */}
            <div className="flex items-center gap-3  bg-white px-4 rounded-lg shadow mb-4 justify-between w-[500px]">
              <FaSearch className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                className="w-full outline-none"
              />
            </div>

            <div className="flex-1" />

            {/* Create */}
            <button
              className="flex items-center gap-2 bg-green-700 text-white font-bold p-3 rounded-lg shadow mb-4 max-w-md hover:bg-green-900 transition"
            >
              <IoIosAddCircleOutline size={22} /> Tạo người dùng
            </button>

          </div>

          <div className="flex justify-between">

            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
              <div className="bg-white rounded-xl shadow overflow-hidden w-[70%]">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4">Tên</th>
                      <th className="p-4">ID</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr
                        key={u.userId}
                        onClick={() => setSelectedUser(u)}
                        className={`border-t border-[#d6d6d6] cursor-pointer ${selectedUser?.userId === u.userId ? "bg-green-600 text-white" : "hover:bg-gray-50"}`}
                      >
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={u.avatar ? (u.avatar.startsWith("http") ? u.avatar : `http://localhost:8080${u.avatar}`) : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"}
                            className="w-8 h-8 rounded-full"
                          />
                          {u.username}
                        </td>
                        <td className="p-4">{u.userId}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">{u.phone || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* RIGHT PROFILE */}
            {selectedUser && (
              <aside className="w-80 p-6 rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={selectedUser.avatar ? (selectedUser.avatar.startsWith("http") ? selectedUser.avatar : `http://localhost:8080${selectedUser.avatar}`) : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                  <h2 className="text-xl font-bold">{selectedUser.username}</h2>
                  <p className="text-gray-500 mb-6">{selectedUser.email}</p>

                  <div className="flex gap-4">
                    <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <FaEdit />
                    </button>
                    <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
