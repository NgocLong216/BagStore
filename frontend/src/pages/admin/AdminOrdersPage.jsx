import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";


import {
    FaSearch,
    FaEye,
    FaMoneyBill,
    FaTruck,
    FaCheckCircle,
    FaTimesCircle,
    FaPrint 
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

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);

    const statusMap = {
        PENDING: "Đang xử lý",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
      };

    const paymentMap = {
        COD: "Tiền mặt",
        BANK: "Chuyển khoản",
        MOMO: "Momo",
      };

    const openOrderDetail = async orderId => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:8080/api/admin/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!res.ok) throw new Error("Không lấy được chi tiết đơn hàng");

            const data = await res.json();
            setOrderDetail(data);
            setShowDetailModal(true);
        } catch (err) {
            alert(err.message);
        }
    };


    const openConfirmModal = (order, status) => {
        setSelectedOrder(order);
        setNextStatus(status);
        setShowModal(true);
    };

    const printInvoice = async () => {
        try {
          const token = localStorage.getItem("token");
      
          const res = await fetch(
            `http://localhost:8080/api/admin/orders/${orderDetail.orderId}/invoice`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
      
          if (!res.ok) throw new Error("Không in được hóa đơn");
      
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
      
          const a = document.createElement("a");
          a.href = url;
          a.download = `invoice_${orderDetail.orderId}.pdf`;
          a.click();
      
          window.URL.revokeObjectURL(url);
        } catch (err) {
          alert(err.message);
        }
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
        if (showModal || showDetailModal) {
            // Khoá scroll
            document.body.style.overflow = "hidden";
        } else {
            // Mở lại scroll
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal, showDetailModal]);

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
                    paymentMethod: o.paymentMethod,
                    status: o.status,
                    paymentRef: o.paymentRef,
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
                        <table className="w-full ">
                            <thead className="bg-gray-100 ">
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
                                    <tr key={o.orderId} className=" hover:bg-gray-50 border-t border-gray-300">
                                        <td className="p-4 font-medium">#{o.orderId}</td>
                                        <td className="p-4">{o.user}</td>
                                        <td className="p-4 flex items-center gap-1">
                                            
                                            {o.total.toLocaleString()} đ
                                        </td>
                                        <td className="p-4">{paymentMap[o.paymentMethod]}</td>
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
                                            <button className="text-blue-600 hover:text-blue-800 hover:bg-gray-200 p-2 rounded-lg"
                                                onClick={() => openOrderDetail(o.orderId)}>
                                                Chi tiết
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
            {showDetailModal && orderDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto p-6">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Chi tiết đơn hàng #{orderDetail.orderId}
                            </h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        {/* THÔNG TIN KHÁCH */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <p><b>Khách hàng:</b> {orderDetail.fullName}</p>
                                <p><b>SĐT:</b> {orderDetail.phone}</p>
                                <p><b>Trạng thái:</b> {statusMap[orderDetail.status]}</p>
                            </div>
                            <div>
                                <p><b>Ngày đặt:</b> {orderDetail.createdAt.slice(0, 10)}</p>
                                <p><b>Ghi chú:</b> {orderDetail.note || "—"}</p>
                            </div>
                        </div>

                        {/* ĐỊA CHỈ */}
                        <div className="mb-5">
                            <p><b>Địa chỉ giao hàng:</b></p>
                            <p>
                                {orderDetail.subAddress}, {orderDetail.address}
                            </p>
                        </div>

                        {/* DANH SÁCH SẢN PHẨM */}
                        <table className="w-full border border-gray-300 ">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Sản phẩm</th>
                                    <th className="p-3 text-center">Giá</th>
                                    <th className="p-3 text-center">SL</th>
                                    <th className="p-3 text-center">Tạm tính</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetail.items.map(item => (
                                    <tr key={item.productId} className="border-t border-gray-300 ">
                                        <td className="p-3 flex items-center gap-3">
                                            {item.imageUrl && (
                                                <img
                                                    src={item.imageUrl}
                                                    alt=""
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            {item.productName}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.price.toLocaleString()} đ
                                        </td>
                                        <td className="p-3 text-center">{item.quantity}</td>
                                        <td className="p-3 text-center">
                                            {item.subTotal.toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* TỔNG TIỀN */}
                        <div className="flex justify-between items-center mt-5">

                        {orderDetail.status === "COMPLETED" && (
                            <button
                                onClick={printInvoice}
                                className="flex items-center gap-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                            >
                                <FaPrint/> In hóa đơn PDF
                            </button>)}

                            <div className="text-lg font-semibold">
                                Tổng tiền: {orderDetail.totalPrice.toLocaleString()} đ
                            </div>
                        </div>

                    </div>
                </div>
            )}


        </div>
    );
}
