import { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaBell, FaUser, FaEnvelope, FaLock, FaPhone, FaUnlock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [confirmAction, setConfirmAction] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Edit user state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [editUser, setEditUser] = useState(null);


  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
  });

  const handleCreateUser = async () => {
    setCreateError("");
    setFieldErrors({});
    setCreating(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const data = await res.json(); // Map<String, String>
        setCreateError(data.message || "Dữ liệu không hợp lệ");
        setFieldErrors(data.errors || {});
        return;
      }

      const createdUser = await res.json();

      setUsers(prev => [createdUser, ...prev]);
      setFilteredUsers(prev => [createdUser, ...prev]);
      setSelectedUser(createdUser);

      setShowCreateModal(false);
      setNewUser({
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
      });
    } finally {
      setCreating(false);
    }
  };


  const handleLockUser = async (userId) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(prev =>
      prev.map(u =>
        u.userId === userId ? { ...u, active: false } : u
      )
    );

    setSelectedUser(prev => ({ ...prev, active: false }));
  };

  const handleUnlockUser = async (userId) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:8080/api/admin/users/${userId}/unlock`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUsers(prev =>
      prev.map(u =>
        u.userId === userId ? { ...u, active: true } : u
      )
    );

    setSelectedUser(prev => ({ ...prev, active: true }));
  };

  const handleUpdateUser = async () => {
    setEditing(true);
    setEditErrors({});

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/admin/users/${editUser.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editUser),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setEditErrors(data.errors || {});
        return;
      }

      const updated = await res.json();

      // update list
      setUsers(prev =>
        prev.map(u => u.userId === updated.userId ? updated : u)
      );
      setFilteredUsers(prev =>
        prev.map(u => u.userId === updated.userId ? updated : u)
      );
      setSelectedUser(updated);
      setShowEditModal(false);

    } finally {
      setEditing(false);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAdmin(payload); // payload.userId
    }
  }, []);


  useEffect(() => {
    if (showCreateModal || confirmAction) {
      // Khoá scroll
      document.body.style.overflow = "hidden";
    } else {
      // Mở lại scroll
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCreateModal, confirmAction]);

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
              onClick={() => setShowCreateModal(true)}
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
                        className={`border-t border-[#d6d6d6] cursor-pointer
                        ${!u.active ? "opacity-50 bg-gray-100" : ""}
                        ${selectedUser?.userId === u.userId ? "bg-green-600 text-white" : "hover:bg-gray-50"}
                      `}
                      >

                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={u.avatar ? (u.avatar.startsWith("http") ? u.avatar : `http://localhost:8080${u.avatar}`) : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"}
                            onError={(e) => {
                              e.currentTarget.src = "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp";
                            }}
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

                  <p className={`mb-2 mt-2 text-sm font-semibold ${selectedUser.active ? "text-green-600" : "text-red-600"
                    }`}>
                    {selectedUser.active ? "Đang hoạt động" : "Đã bị khóa"}
                  </p>


                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditUser({
                          userId: selectedUser.userId,
                          username: selectedUser.username,
                          email: selectedUser.email,
                          phone: selectedUser.phone || "",
                          role: selectedUser.role,
                        });
                        setEditErrors({});
                        setShowEditModal(true);
                      }}
                      className="p-3 bg-white text-green-700 rounded-lg hover:bg-gray-200"
                      title="Sửa tài khoản"
                    >
                      <FaEdit />
                    </button>


                    {selectedUser.active ? (
                      <button
                        disabled={admin?.userId === selectedUser.userId}
                        onClick={() =>
                          setConfirmAction({ type: "lock", user: selectedUser })
                        }
                        className={`p-3 rounded-lg ${admin?.userId === selectedUser.userId
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-red-700 hover:bg-red-200"
                          }`}
                        title={
                          admin?.userId === selectedUser.userId
                            ? "Không thể khóa chính bạn"
                            : "Khóa tài khoản"
                        }
                      >
                        <FaLock />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmAction({ type: "unlock", user: selectedUser })
                        }
                        className="p-3 bg-green-100 rounded-lg hover:bg-green-200 text-green-700"
                        title="Mở khóa tài khoản"
                      >
                        <FaUnlock />
                      </button>
                    )}



                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[420px] p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Tạo người dùng</h2>

              {createError && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex gap-3 items-center">
                  <MdErrorOutline /> {createError}
                </div>
              )}


              <div className="space-y-3">
                <div className="mb-6">
                  <div className="relative">
                    <input
                      placeholder="Tên đăng nhập"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                      ${fieldErrors.username ? "border border-red-500" : ""}
                    `}
                      value={newUser.username}
                      onChange={e =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                    />

                    <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.username && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <input
                      placeholder="Email"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                      ${fieldErrors.email ? "border border-red-500" : ""}
                    `}
                      value={newUser.email}
                      onChange={e =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />

                    <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <input
                      placeholder="Số điện thoại"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                      ${fieldErrors.phone ? "border border-red-500" : ""}
                    `}
                      value={newUser.phone}
                      onChange={e =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                    />

                    <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <input
                      placeholder="Mật khẩu"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                      ${fieldErrors.password ? "border border-red-500" : ""}
                    `}
                      value={newUser.password}
                      onChange={e =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />

                    <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.password && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <label className="block mb-2 font-semibold text-gray-800">Vai trò</label>
                <select
                  className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none"
                  value={newUser.role}
                  onChange={e =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
                {fieldErrors.role && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.role}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>

                <button
                  disabled={creating}
                  onClick={handleCreateUser}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900 disabled:opacity-60"
                >
                  {creating ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && editUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[420px] p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Cập nhật người dùng</h2>

              <div className="space-y-4">

                {/* Username */}
                <div>
                  <div className="relative">
                    <input
                      className="w-full px-5 py-3 bg-gray-200 rounded-lg"
                      value={editUser.username}
                      placeholder="Tên đăng nhập"
                      onChange={e =>
                        setEditUser({ ...editUser, username: e.target.value })
                      }
                    />
                    <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  {editErrors.username && (
                    <p className="text-red-600 text-sm mt-1">{editErrors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <input
                      className="w-full px-5 py-3 bg-gray-200 rounded-lg"
                      value={editUser.email}
                      placeholder="Email"
                      onChange={e =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                    />
                    <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  {editErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{editErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <div className="relative">
                    <input
                      className="w-full px-5 py-3 bg-gray-200 rounded-lg"
                      value={editUser.phone}
                      placeholder="Số điện thoại"
                      onChange={e =>
                        setEditUser({ ...editUser, phone: e.target.value })
                      }
                    />
                    <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  {editErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{editErrors.phone}</p>
                  )}
                </div>

                <label className="block mb-2 font-semibold text-gray-800">Vai trò</label>
                {/* Role */}
                <select
                  className="w-full px-5 py-3 bg-gray-200 rounded-lg"
                  value={editUser.role}
                  onChange={e =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>

                <button
                  disabled={editing}
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-60 hover:bg-green-900"
                >
                  {editing ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmAction && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[380px] p-6 shadow-lg text-center">
              <h2 className="text-lg font-bold mb-3">
                {confirmAction.type === "lock"
                  ? "Khóa tài khoản"
                  : "Mở khóa tài khoản"}
              </h2>

              <p className="text-gray-600 mb-6">
                {confirmAction.type === "lock"
                  ? `Bạn có chắc chắn muốn khóa tài khoản "${confirmAction.user.username}"?`
                  : `Bạn có chắc chắn muốn mở khóa tài khoản "${confirmAction.user.username}"?`}
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>

                <button
                  onClick={() => {
                    confirmAction.type === "lock"
                      ? handleLockUser(confirmAction.user.userId)
                      : handleUnlockUser(confirmAction.user.userId);

                    setConfirmAction(null);
                  }}
                  className={`px-4 py-2 rounded text-white ${confirmAction.type === "lock"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}
