import { useLocation, useNavigate } from "react-router-dom";
import { IoMdCopy } from "react-icons/io";
import { useState } from "react";
import { BsBank } from "react-icons/bs";
import { CiCircleAlert } from "react-icons/ci";

export default function BankTransferPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleConfirmTransfer = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName: state.fullName,
                    phone: state.phone,
                    subAddress: state.subAddress,
                    address: state.address,
                    note: state.note,
                    paymentRef: state.tempCode,
                    items: state.items.map(i => ({
                        cartId: i.cart_id,
                        productId: i.productId,
                        quantity: i.quantity,
                    })),
                    paymentMethod: "BANK"
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Tạo đơn hàng thất bại");

            navigate("/order-success", {
                state: {
                    orderId: data.orderId,
                    totalPrice: data.totalPrice
                }
            });
        } catch (err) {
            alert(err.message);
        }
    };


    if (!state) {
        navigate("/");
        return null;
    }

    const { tempCode, totalPrice } = state;

    const BANK_INFO = {
        name: "MB BANK",
        accountName: "NGUYEN NGOC LONG",
        accountNumber: "210699992005",
        bin: "970422"
    };

    const transferContent = tempCode;

    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bin}-${BANK_INFO.accountNumber}-compact2.png?amount=${totalPrice}&addInfo=${transferContent}&accountName=${BANK_INFO.accountName}`;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10 pt-30">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* HEADER */}
                <div className="text-center py-8 border-b border-gray-300">
                    <h1 className="text-3xl font-bold text-green-700">
                        Thanh toán chuyển khoản ngân hàng
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Quét mã QR hoặc chuyển khoản thủ công theo thông tin bên dưới
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* LEFT - BANK INFO */}
                    <div className="p-8 border-r border-gray-300 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <BsBank /> Thông tin tài khoản
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: "CHỦ TÀI KHOẢN", value: BANK_INFO.accountName },
                                { label: "SỐ TÀI KHOẢN", value: BANK_INFO.accountNumber },
                                { label: "NGÂN HÀNG", value: BANK_INFO.name },
                                { label: "NỘI DUNG CHUYỂN", value: transferContent },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-4 rounded-xl border border-gray-300 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">
                                            {item.label}
                                        </p>
                                        <p className="text-green-700 font-bold tracking-wide">
                                            {item.value}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.value);
                                            setCopiedIndex(i);
                                            setTimeout(() => setCopiedIndex(null), 1500);
                                        }}
                                        className="relative text-gray-400 p-2 rounded-xl hover:bg-green-500 hover:text-white hover:cursor-pointer text-lg transition"
                                    >
                                        <IoMdCopy />

                                        {copiedIndex === i && (
                                            <span className="absolute -top-11 right-1/2 translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-md shadow">
                                                Đã copy
                                            </span>
                                        )}
                                    </button>

                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex gap-2">
                            <CiCircleAlert className="text-lg text-yellow-700 mt-[2px]" />
                            <p className="text-sm text-yellow-700">
                                Vui lòng chuyển đúng <b>nội dung chuyển khoản</b> để hệ
                                thống tự động xác nhận đơn hàng.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT - QR */}
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Quét mã QR để thanh toán
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Mở ứng dụng ngân hàng và quét mã bên dưới
                        </p>

                        <div className="bg-white p-4 rounded-2xl shadow-md w-100 h-100">
                            <img
                                src={qrUrl}
                                alt="QR Code"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <p className="mt-4 text-lg font-semibold text-red-600">
                            {totalPrice.toLocaleString()} ₫
                        </p>

                        <div className="flex gap-4 mt-4 opacity-70">
                            <img
                                src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDAzODMzMCwicHVyIjoiYmxvYl9pZCJ9fQ==--d01b1b407f49d33d4ea19b9218e10da4dc7f231d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlszMDAsMzAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--e1d036817a0840c585f202e70291f5cdd058753d/logo%20d%E1%BB%8Dc.png"
                                className="h-6"
                                alt="vnpay"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/MoMo_Logo_App.svg/1200px-MoMo_Logo_App.svg.png"
                                className="h-6"
                                alt="momo"
                            />
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-gray-300 flex flex-col sm:flex-row gap-4 justify-center bg-gray-50">
                    <button
                        onClick={handleConfirmTransfer}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
                    >
                        Tôi đã chuyển khoản
                    </button>


                    <button
                        onClick={() => navigate(`/checkout`)}
                        className="border border-gray-300 px-8 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        Huỷ thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
}
