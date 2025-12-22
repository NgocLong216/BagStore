import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

import {
    FaSearch,
    FaEye,
    FaMoneyBill,
    FaTruck,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [nextStatus, setNextStatus] = useState("");

    const openConfirmModal = (order, status) => {
        setSelectedOrder(order);
        setNextStatus(status);
        setShowModal(true);
    };



    const confirmUpdateStatus = async () => {
        if (!selectedOrder) return;

        try {
            setUpdatingId(selectedOrder.orderId);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:8080/api/admin/orders/${selectedOrder.orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: nextStatus })
                }
            );

            if (!res.ok) throw new Error(await res.text());

            setOrders(prev =>
                prev.map(o =>
                    o.orderId === selectedOrder.orderId
                        ? { ...o, status: nextStatus }
                        : o
                )
            );

            setFilteredOrders(prev =>
                prev.map(o =>
                    o.orderId === selectedOrder.orderId
                        ? { ...o, status: nextStatus }
                        : o
                )
            );

            setShowModal(false);
        } catch (err) {
            alert(err.message || "Cập nhật thất bại");
        } finally {
            setUpdatingId(null);
            setSelectedOrder(null);
        }
    };


    useEffect(() => {
        if (showModal) {
          // Khoá scroll
          document.body.style.overflow = "hidden";
        } else {
          // Mở lại scroll
          document.body.style.overflow = "auto";
        }
    
        return () => {
          document.body.style.overflow = "auto";
        };
      }, [showModal]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/api/admin/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Không lấy được đơn hàng");

                const data = await res.json();

                // map DTO backend → format frontend đang dùng
                const mapped = data.map(o => ({
                    orderId: o.orderId,
                    user: o.fullName,
                    total: o.totalPrice,
                    paymentMethod: "COD",
                    status: o.status,
                    createdAt: o.createdAt.slice(0, 10)
                }));

                setOrders(mapped);
                setFilteredOrders(mapped);
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrders();
    }, []);


    useEffect(() => {
        let data = [...orders];

        if (keyword) {
            data = data.filter(o =>
                o.user.toLowerCase().includes(keyword.toLowerCase())
                || o.orderId.toString().includes(keyword)
            );
        }

        if (statusFilter) {
            data = data.filter(o => o.status === statusFilter);
        }

        setFilteredOrders(data);
    }, [keyword, statusFilter, orders]);

    const renderStatus = status => {
        switch (status) {
            case "PENDING":
                return <span className="text-yellow-600 flex items-center gap-1">
                    <FaTruck /> Chờ xử lý
                </span>;
            case "COMPLETED":
                return <span className="text-green-600 flex items-center gap-1">
                    <FaCheckCircle /> Hoàn thành
                </span>;
            case "CANCELLED":
                return <span className="text-red-600 flex items-center gap-1">
                    <FaTimesCircle /> Đã hủy
                </span>;
            default:
                return status;
        }
    };

    return (
        <div className="flex">
            <AdminSidebar />

            <div className="flex-1 bg-gray-100 min-h-screen">
                <AdminHeader title="Quản Lý Đơn Hàng" />

                <div className="p-8">

                    {/* SEARCH + FILTER */}
                    <div className="flex gap-4 mb-6 w-[70%]">
                        <div className="flex items-center gap-3 bg-white px-4 rounded-lg shadow w-[500px]">
                            <FaSearch className="text-gray-400" />
                            <input
                                placeholder="Tìm theo mã đơn / khách hàng"
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-4 py-3 rounded bg-white rounded-lg shadow"
                        >
                            <option value="">-- Tất cả trạng thái --</option>
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                        </select>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Mã đơn</th>
                                    <th className="p-4 text-left">Khách hàng</th>
                                    <th className="p-4 text-left">Tổng tiền</th>
                                    <th className="p-4 text-left">Thanh toán</th>
                                    <th className="p-4 text-left">Trạng thái</th>
                                    <th className="p-4 text-left">Ngày đặt</th>
                                    <th className="p-4 text-center">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOrders.map(o => (
                                    <tr key={o.orderId} className=" hover:bg-gray-50">
                                        <td className="p-4 font-medium">#{o.orderId}</td>
                                        <td className="p-4">{o.user}</td>
                                        <td className="p-4 flex items-center gap-1">
                                            <FaMoneyBill className="text-green-700" />
                                            {o.total.toLocaleString()} đ
                                        </td>
                                        <td className="p-4">{o.paymentMethod}</td>
                                        <td className="p-4">
                                            {o.status === "PENDING" ? (

                                                <select
                                                    value={o.status}
                                                    disabled={updatingId === o.orderId}
                                                    onChange={e => openConfirmModal(o, e.target.value)}
                                                    className="px-3 py-2 rounded bg-white border border-gray-300"
                                                >

                                                    <option value="PENDING">Chờ xử lý</option>
                                                    <option value="COMPLETED">Hoàn thành</option>
                                                    <option value="CANCELLED"> Hủy</option>
                                                </select>
                                            ) : (
                                                renderStatus(o.status)
                                            )}
                                        </td>

                                        <td className="p-4">{o.createdAt}</td>
                                        <td className="p-4 text-center">
                                            <button className="text-blue-600 hover:text-blue-800">
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-6 text-center text-gray-500">
                                            Không có đơn hàng
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg animate-fadeIn">

                        <h2 className="text-lg font-semibold mb-3">
                            {nextStatus === "CANCELLED"
                                ? "Xác nhận hủy đơn hàng"
                                : "Xác nhận hoàn thành đơn hàng"}
                        </h2>

                        <p className="text-gray-600 mb-5">
                            Bạn có chắc chắn muốn{" "}
                            <span className="font-semibold">
                                {nextStatus === "CANCELLED" ? "HỦY" : "HOÀN THÀNH"}
                            </span>{" "}
                            đơn hàng <b>#{selectedOrder?.orderId}</b> không?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={confirmUpdateStatus}
                                className={`px-4 py-2 rounded text-white
                                 ${nextStatus === "CANCELLED"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"}`}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
