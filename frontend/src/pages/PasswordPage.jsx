import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaLock } from "react-icons/fa";

export default function PasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (res.ok) {
        setMessage("Đổi mật khẩu thành công!");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const err = await res.text();
        setMessage("Lỗi: " + err);
      }
    } catch (err) {
      console.error("Change password error:", err);
      setMessage("Đã xảy ra lỗi, thử lại sau!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f2] pt-6">
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-1">Mật Khẩu</h1>
          <p className="text-gray-500 mb-6">
            Cập nhật mật khẩu tài khoản để bảo mật tốt hơn
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            {/* Old Password */}
            <div className="relative">
              <label className="block mb-2 font-semibold">Mật khẩu hiện tại</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                required
              />
              <FaLock className="absolute right-4 top-11 text-gray-500" />
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block mb-2 font-semibold">Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                required
              />
              <FaLock className="absolute right-4 top-11 text-gray-500" />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block mb-2 font-semibold">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                required
              />
              <FaLock className="absolute right-4 top-11 text-gray-500" />
            </div>

            {/* Message */}
            {message && (
              <div className="text-center text-sm font-medium text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-1/3 py-2 bg-green-800 text-white rounded-lg font-semibold hover:bg-black hover:text-[#d4a373] transition"
            >
              Lưu
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
