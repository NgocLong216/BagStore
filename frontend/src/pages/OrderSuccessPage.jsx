import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
    const navigate = useNavigate();
    const { state } = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-10">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
                {/* ICON */}
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-20 h-20 text-green-600" />
                </div>

                {/* TITLE */}
                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    Đặt hàng thành công!
                </h1>

                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã mua sắm tại <span className="font-semibold">BagStore</span>.
                    Đơn hàng của bạn đang được xử lý và sẽ sớm giao đến bạn.
                </p>


                <p className="text-gray-600 mb-4">
                    Mã đơn hàng:
                    <span className="font-semibold text-green-700">
                        {" "}#{state?.orderId}
                    </span>
                </p>

                <p className="text-lg font-bold text-red-600 mb-6">
                    Tổng tiền: {state?.totalPrice?.toLocaleString()} ₫
                </p>

                {/* INFO BOX */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 mb-6">
                    Thời gian giao hàng dự kiến: <br />
                    <span className="font-semibold">2 – 4 ngày làm việc</span>


                </div>

                {/* BUTTONS */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition"
                    >
                        Xem đơn hàng
                    </button>

                    <button
                        onClick={() => navigate("/products")}
                        className="w-full border border-green-700 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        </div>
    );
}
