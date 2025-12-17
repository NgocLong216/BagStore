import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBell } from "react-icons/fa";

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/notices", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notices:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fff8f2] pt-6">
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-1">Thông Báo</h1>
          <p className="text-gray-500 mb-6">
            Xem danh sách thông báo mới nhất của bạn
          </p>

          {loading ? (
            <div className="text-center text-gray-500">Đang tải...</div>
          ) : notices.length === 0 ? (
            <div className="text-center text-gray-500">
              Không có thông báo nào
            </div>
          ) : (
            <ul className="space-y-4">
              {notices.map((notice) => (
                <li
                  key={notice.id}
                  className={`p-4 border rounded-lg shadow-sm flex items-start gap-4 transition ${
                    notice.read ? "bg-gray-100" : "bg-[#fdf6ec]"
                  }`}
                >
                  <div className="mt-1">
                    <FaBell
                      className={`text-xl ${
                        notice.read ? "text-gray-400" : "text-yellow-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{notice.title}</h2>
                    <p className="text-gray-600">{notice.content}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(notice.date).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  {!notice.read && (
                    <button className="text-sm text-green-700 font-semibold hover:underline">
                      Đánh dấu đã đọc
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
