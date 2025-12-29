import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

export default function SettingPage() {

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      // Clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect về login / home
      window.location.href = "/login";
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa tài khoản");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };



  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);


  return (
    <div className="min-h-screen bg-[#fff8f2] pt-6">
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-1">Thiết Lập</h1>
          <p className="text-gray-500 mb-6">
            Quản lý các thiết lập tài khoản và ứng dụng của bạn
          </p>
          <div className="mt-10 border-t border-gray-300 pt-6">
            <h2 className="text-lg font-bold text-red-600 mb-2">
              Vùng nguy hiểm
            </h2>

            <p className="text-gray-600 mb-4">
              Việc xóa tài khoản là <b>vĩnh viễn</b> và không thể khôi phục.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-black transition flex gap-2 items-center"
            >
              <FaTrash /> Xóa tài khoản
            </button>
          </div>


        </main>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 text-center animate-fadeIn">
            <h2 className="text-xl font-bold text-red-600 mb-3">
              Xác nhận xóa tài khoản
            </h2>

            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tài khoản? <br />
              Hành động này <b>không thể hoàn tác</b>.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-5 py-2 rounded-lg border hover:bg-black hover:text-white"
              >
                Hủy
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-black disabled:opacity-50"
              >
                {loading ? "Đang xóa..." : "Xóa tài khoản"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
