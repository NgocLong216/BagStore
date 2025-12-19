import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [avatar, setAvatar] = useState("");


  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setFormData({
        username: savedUser.username,
        email: savedUser.email,
        phone: savedUser.phone || ""
      });
    }

    // Fetch từ backend để lấy dữ liệu mới nhất
    fetch("http://localhost:8080/api/users/me", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          username: data.username,
          email: data.email,
          phone: data.phone || ""
        });
        setAvatar(data.avatar);
      })
      .catch(err => console.error("Error loading profile:", err));
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const updatedUser = await res.json();

      // Cập nhật lại localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Set lại formData để không bị mất khi username đổi
      setFormData({
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone || ""
      });

      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/users/me/avatar", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    const imageUrl = await res.text();

    // Cập nhật UI
    setAvatar(imageUrl);

    // Cập nhật localStorage user
    const saved = JSON.parse(localStorage.getItem("user"));
    saved.avatar = imageUrl;
    localStorage.setItem("user", JSON.stringify(saved));

    alert("Upload avatar thành công!");
  };


  return (
    <div className="min-h-screen bg-[#fff8f2] pt-6">
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar username={formData.username} />

        {/* Main Content */}
        <main className="flex-1 flex justify-between p-10">
          {/* Form */}
          <div className="w-1/2">
            <h1 className="text-2xl font-bold mb-1">Hồ Sơ</h1>
            <p className="text-gray-500 mb-6">Quản lý thông tin hồ sơ của bạn</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="relative">
                <label className="block mb-2 font-semibold">Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                />
                <FaUser className="absolute right-4 top-11 text-gray-500" />
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                />
                <FaEnvelope className="absolute right-4 top-11   text-gray-500" />
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block mb-2 font-semibold">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  placeholder="Thêm số điện thoại"
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                />
                <FaPhone className="absolute right-4 top-11  text-gray-500" />
              </div>

              <button
                type="submit"
                className="w-1/3 py-2 bg-green-800 text-white rounded-lg font-semibold hover:bg-black hover:text-[#d4a373] transition"
              >
                Lưu
              </button>
            </form>
          </div>

          {/* Upload Photo */}
          <div className="w-1/2 text-center">
            <img
              src={
                avatar
                  ? avatar.startsWith("http")
                    ? avatar
                    : `http://localhost:8080${avatar}`
                  : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"
              }
              
              alt="avatar"
              onError={(e) => {
                e.currentTarget.src = "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp";
              }}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />


            <label
              htmlFor="upload"
              className="inline-block px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-black hover:text-white transition"
            >
              Chọn Ảnh
            </label>
            <input type="file" id="upload" hidden onChange={handleUpload} />

            <p className="text-sm text-gray-500 mt-3">
              Dung lượng file tối đa 1 MB <br />
              Định dạng: .jpeg, .png
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
