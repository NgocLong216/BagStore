import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import Sidebar from "../components/Sidebar";


export default function ProfilePage() {
  const [formData, setFormData] = useState({
    username: "",
    // email: "",
    phone: "",
  });

  const [avatar, setAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup khi unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);


  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setFormData({
        username: savedUser.username,
        // email: savedUser.email,
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
          // email: data.email,
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

    if (!formData.username || formData.username.length < 4) {
      setErrors({ username: "Username phải từ 4–20 ký tự" });
      return;
    }

    if (formData.phone && !/^[0-9]{9,11}$/.test(formData.phone)) {
      setErrors({ phone: "Số điện thoại không hợp lệ" });
      return;
    }
    

    setErrors({});

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await res.json();
          setErrors(data);        // lỗi validate
          return;                //  KHÔNG update
        }
        throw new Error("Update thất bại");
      }

      const data = await res.json();

      // cập nhật localStorage
      localStorage.setItem("user", JSON.stringify(data));

      setModalMessage("Cập nhật thông tin thành công!");
      setShowModal(true);

    } catch (err) {
      setModalMessage("Có lỗi xảy ra khi cập nhật!");
      setShowModal(true);
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

    setModalMessage("Upload avatar thành công!");
    setShowModal(true);

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
                <label className="font-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    setErrors(prev => ({ ...prev, username: null }));
                  }}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none
      ${errors.username ? "border border-red-500" : ""}`}
                />
<FaUser className="absolute right-4 top-9 text-gray-500" />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>


              {/* Email */}
              {/* <div className="relative">
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
                />
                <FaEnvelope className="absolute right-4 top-11   text-gray-500" />
              </div> */}

              {/* Phone */}
              <div className="relative">
                <label className="font-semibold">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setErrors(prev => ({ ...prev, phone: null }));
                  }}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none
      ${errors.phone ? "border border-red-500" : ""}`}
                />
                <FaPhone className="absolute right-4 top-9 text-gray-500" />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
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
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-2 text-green-700">
              Thành công
            </h2>

            <p className="text-gray-600 mb-6">
              {modalMessage}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-black transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
