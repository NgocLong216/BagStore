import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function SettingPage() {
  const [language, setLanguage] = useState("vi");
  const [emailNotify, setEmailNotify] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    console.log({
      language,
      emailNotify,
      darkMode,
    });
    alert("Cập nhật thiết lập thành công!");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-[#fff8f2]"} pt-6`}>
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-1">Thiết Lập</h1>
          <p className="text-gray-500 mb-6">
            Quản lý các thiết lập tài khoản và ứng dụng của bạn
          </p>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Ngôn ngữ */}
            <div>
              <label className="block font-medium mb-2">Ngôn ngữ</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border rounded-lg p-3"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Email Notification */}
            <div className="flex items-center justify-between">
              <label className="font-medium">Nhận thông báo qua Email</label>
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="h-5 w-5 accent-green-600"
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <label className="font-medium">Chế độ tối (Dark Mode)</label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="h-5 w-5 accent-green-600"
              />
            </div>

            {/* Save button */}
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Lưu thay đổi
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
