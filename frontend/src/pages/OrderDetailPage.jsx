import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `http://localhost:8080/api/orders/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Không tìm thấy đơn hàng");

                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error(err);
                alert("Không thể tải chi tiết đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    if (loading) {
        return <p className="text-center mt-20">Đang tải đơn hàng...</p>;
    }

    if (!order) {
        return <p className="text-center mt-20">Không tìm thấy đơn hàng</p>;
    }

    return (
        <div className="min-h-screen pt-6 bg-[#fff8f2] pb-26">
            <div className="flex max-w-6xl mx-auto mt-36 bg-white shadow-md rounded-2xl overflow-hidden">

                {/* SIDEBAR */}
                <Sidebar />

                {/* MAIN CONTENT */}
                <main className="flex-1 p-10">
                    {/* HEADER */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-green-700 font-semibold hover:underline mb-2"
                        >
                            ← Quay lại
                        </button>

                        <h1 className="text-2xl font-bold">
                            Chi tiết đơn hàng #{order.orderId}
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Ngày đặt:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* THÔNG TIN GIAO HÀNG */}
                    <div className="bg-white border border-[#d6d6d6] rounded-xl p-6 mb-8">
                        <h2 className="text-lg font-semibold mb-4">
                            Thông tin giao hàng
                        </h2>

                        <div className="space-y-2 text-gray-700">
                            <p>
                                <b>Họ tên:</b> {order.fullName}
                            </p>
                            <p>
                                <b>Số điện thoại:</b> {order.phone}
                            </p>
                            <p>
                                <b>Địa chỉ:</b>{" "}
                                {order.subAddress}, {order.address}
                            </p>
                            {order.note && (
                                <p>
                                    <b>Ghi chú:</b> {order.note}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* DANH SÁCH SẢN PHẨM */}
                    <div className="bg-white border border-[#d6d6d6] rounded-xl mb-8">
                        <div className="px-6 py-4 border-b border-[#d6d6d6]">
                            <h2 className="text-lg font-semibold">
                                Sản phẩm đã đặt
                            </h2>
                        </div>

                        <div>
                            {order.items.map(item => (
                                <div
                                    key={item.productId}
                                    className="flex items-center gap-4 px-6 py-4 border-t border-[#d6d6d6]"
                                >
                                    <img
                                        src={item.imageUrl || "/images/default.jpg"}
                                        alt={item.productName}
                                        className="w-20 h-20 object-cover rounded"
                                    />

                                    <p className="font-medium">
                                        {item.product?.name}
                                    </p>


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
                                            {item.price.toLocaleString()} ₫
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TỔNG TIỀN */}
                    <div className="flex justify-end text-xl font-bold text-red-600">
                        Tổng tiền: {order.totalPrice.toLocaleString()} ₫
                    </div>
                </main>
            </div>
        </div>
    );
}
