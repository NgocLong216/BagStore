import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      setIsSuccess(true);
      setMessage("Đổi mật khẩu thành công!");
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message);
    }

  };

  return (
    <div className="min-h-screen bg-[#fff8f2] pt-6">
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-1">Mật Khẩu</h1>
          <p className="text-gray-500 mb-6">
            Cập nhật mật khẩu tài khoản để bảo mật tốt hơn
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            {[
              { label: "Mật khẩu hiện tại", name: "oldPassword" },
              { label: "Mật khẩu mới", name: "newPassword" },
              { label: "Xác nhận mật khẩu", name: "confirmPassword" },
            ].map((item) => (
              <div key={item.name} className="relative">
                <label className="block mb-2 font-semibold">
                  {item.label}
                </label>
                <input
                  type="password"
                  name={item.name}
                  value={formData[item.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                  required
                />
                <FaLock className="absolute right-4 top-11 text-gray-500" />
              </div>
            ))}

            {message && (
              <div
                className={`text-center text-sm font-medium ${isSuccess ? "text-green-600" : "text-red-600"
                  }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-1/3 py-2 bg-green-800 text-white rounded-lg font-semibold hover:bg-black hover:text-[#d4a373]"
            >
              Lưu
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
