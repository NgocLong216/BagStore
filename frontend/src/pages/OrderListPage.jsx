import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ===== MAP TRẠNG THÁI =====
    const ORDER_STATUS = {
        PENDING: {
            label: "Đang xử lý",
            className: "bg-yellow-100 text-yellow-700",
        },
        COMPLETED: {
            label: "Hoàn thành",
            className: "bg-green-100 text-green-700",
        },
        CANCELLED: {
            label: "Đã hủy",
            className: "bg-red-100 text-red-700",
        },
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    
        try {
            const token = localStorage.getItem("token");
    
            const res = await fetch(
                `http://localhost:8080/api/orders/${orderId}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (!res.ok) {
                throw new Error("Hủy đơn thất bại");
            }
    
            // Cập nhật lại state
            setOrders(prev =>
                prev.map(order =>
                    order.orderId === orderId
                        ? { ...order, status: "CANCELLED" }
                        : order
                )
            );
    
            alert("Hủy đơn hàng thành công");
        } catch (err) {
            console.error(err);
            alert("Không thể hủy đơn hàng");
        }
    };
    

    // ===== FETCH ORDERS =====
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8080/api/orders/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi load orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <p className="text-center mt-20">Đang tải đơn hàng...</p>;
    }

    return (
        <div className="min-h-screen pt-6 bg-[#fff8f2] pb-26">
            <div className="flex max-w-6xl mx-auto mt-36 bg-white shadow-md rounded-2xl overflow-hidden">

                {/* Sidebar */}
                <Sidebar />

                <main className="flex-1 p-10 ">
                    <h1 className="text-2xl font-bold mb-1">
                        Đơn Mua
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Quản lý tất cả đơn đặt hàng của bạn
                    </p>

                    {orders.length === 0 ? (
                        <div className="text-center bg-white p-10 rounded-xl shadow">
                            <p className="text-gray-600 mb-4">
                                Bạn chưa có đơn hàng nào
                            </p>
                            <button
                                onClick={() => navigate("/products")}
                                className="bg-green-700 text-white px-6 py-2 rounded-lg"
                            >
                                Mua sắm ngay
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {orders.map(order => {
                                const statusInfo = ORDER_STATUS[order.status] || {
                                    label: order.status,
                                    className: "bg-gray-100 text-gray-600",
                                };

                                return (
                                    <div
                                        key={order.orderId}
                                        className="bg-white shadow rounded-xl border border-[#d6d6d6]"
                                    >
                                        {/* ===== HEADER ===== */}
                                        <div className="flex justify-between items-center px-6 py-4 border-b border-[#d6d6d6]">
                                            <div>
                                                <p className="font-semibold">
                                                    Mã đơn hàng: #{order.orderId}
                                                </p>
                                            </div>

                                            <span
                                                className={`px-4 py-1 rounded-full text-sm font-semibold ${statusInfo.className}`}
                                            >
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        {/* ===== PRODUCT LIST ===== */}
                                        <div className="divide-y">
                                            {order.items?.map(item => (
                                                <div
                                                    key={item.productId}
                                                    className="flex items-center gap-4 px-6 py-4 border-[#d6d6d6]"
                                                >
                                                    <img
                                                        src={item.imageUrl || "/images/default.jpg"}
                                                        alt={item.productName}
                                                        className="w-20 h-20 object-cover rounded border border-[#d6d6d6]"
                                                    />

                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Số lượng: x{item.quantity}
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">
                                                            {(item.price ?? 0).toLocaleString()} ₫
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* ===== FOOTER ===== */}
                                        <div className="flex justify-between items-center px-6 py-4 border-t border-[#d6d6d6]">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => navigate(`/orders/${order.orderId}`)}
                                                    className="text-green-700 font-semibold hover:underline"
                                                >
                                                    Xem chi tiết
                                                </button>

                                                {order.status === "PENDING" && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.orderId)}
                                                        className="text-red-600 font-semibold hover:underline"
                                                    >
                                                        Hủy đơn
                                                    </button>
                                                )}
                                            </div>

                                            <p className="text-lg font-bold text-red-600">
                                                Tổng tiền: {(order.totalPrice ?? 0).toLocaleString()} ₫
                                            </p>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
