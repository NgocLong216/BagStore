import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Demo dữ liệu giả lập, sau này thay bằng fetch API từ backend
    setOrders([
      {
        id: "DH001",
        date: "2025-08-20",
        status: "Đang xử lý",
        total: 450000,
      },
      {
        id: "DH002",
        date: "2025-08-18",
        status: "Đã giao",
        total: 1200000,
      },
      {
        id: "DH003",
        date: "2025-08-15",
        status: "Đã hủy",
        total: 250000,
      },
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang xử lý":
        return "text-yellow-600 bg-yellow-100";
      case "Đã giao":
        return "text-green-600 bg-green-100";
      case "Đã hủy":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f2] pt-6">
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-1">Đơn Mua</h1>
          <p className="text-gray-500 mb-6">
            Xem lịch sử đơn hàng của bạn tại đây
          </p>

          {orders.length === 0 ? (
            <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left font-medium">Mã đơn</th>
                    <th className="p-3 text-left font-medium">Ngày đặt</th>
                    <th className="p-3 text-left font-medium">Trạng thái</th>
                    <th className="p-3 text-right font-medium">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{order.id}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold">
                        {order.total.toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
