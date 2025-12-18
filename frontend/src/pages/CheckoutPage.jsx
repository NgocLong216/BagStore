import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState({});
    const [shake, setShake] = useState({});

    const { items = [], totalPrice = 0 } = location.state || {};


    // ===== STATE FORM =====
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [subAddress, setSubAddress] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    // ===== SUBMIT ORDER =====
    const handlePlaceOrder = async () => {
        setErrors({});
        setShake({});

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName,
                    phone,
                    subAddress,
                    address,
                    note,
                    items: items.map(i => ({
                        cartId: i.cart_id,
                        productId: i.productId,
                        quantity: i.quantity,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    setErrors(data.errors);

                    // shake các field bị lỗi
                    const shakeFields = {};
                    Object.keys(data.errors).forEach(f => shakeFields[f] = true);
                    setShake(shakeFields);

                    // tắt shake sau 400ms
                    setTimeout(() => setShake({}), 400);
                    return;
                }

                throw new Error(data.message || "Đặt hàng thất bại");
            }

            navigate("/order-success", {
                state: {
                    orderId: data.orderId,
                    totalPrice: data.totalPrice,
                },
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchDefaultAddress = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:8080/api/contacts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) return;

                const data = await res.json();

                const defaultAddress = data.find(a => a.isDefault);

                if (defaultAddress) {
                    setFullName(defaultAddress.fullName);
                    setPhone(defaultAddress.phone);
                    setSubAddress(defaultAddress.subAddress)
                    setAddress(defaultAddress.address);
                }
            } catch (err) {
                console.error("Lỗi load địa chỉ mặc định:", err);
            }
        };

        fetchDefaultAddress();
    }, []);

    // ===== EMPTY CART =====
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">
                    Không có sản phẩm để thanh toán
                </h2>
                <button
                    onClick={() => navigate("/cart")}
                    className="bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                    Quay lại giỏ hàng
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 mt-[80px]">
            <h1 className="text-3xl font-bold text-center mb-10 text-green-800">
                Thanh Toán
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* LEFT */}
                <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6 ">
                    <h2 className="text-xl font-semibold mb-6">
                        Thông tin giao hàng
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    setErrors(prev => ({ ...prev, fullName: "" }));
                                }}
                                className={`
                                    w-full px-5 py-3 rounded-lg text-base font-medium
                                    focus:outline-none
                                    ${errors.fullName
                                        ? "border-2 border-red-500 bg-red-50 animate-shake"
                                        : "bg-gray-200"}
                                `}
                            />

                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setErrors(prev => ({ ...prev, phone: null }));
                                }}
                                className={`
                                    w-full px-5 py-3 rounded-lg text-base font-medium focus:outline-none
                                    ${errors.phone ? "border-2 border-red-500 bg-red-50" : "bg-gray-200"}
                                    ${shake.phone ? "animate-shake" : ""}
                                `}
                            />

                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </p>
                            )}

                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Địa chỉ cụ thể (số nhà, đường...)"
                                value={subAddress}
                                onChange={(e) => {
                                    setSubAddress(e.target.value);
                                    setErrors(prev => ({ ...prev, subAddress: "" }));
                                }}
                                className={`
                                    w-full px-5 py-3 rounded-lg text-base font-medium
                                    focus:outline-none
                                    ${errors.subAddress
                                        ? "border-2 border-red-500 bg-red-50 animate-shake"
                                        : "bg-gray-200"}
                                `}
                            />

                            {errors.subAddress && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.subAddress}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Phường / Quận / Tỉnh"
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    setErrors(prev => ({ ...prev, address: "" }));
                                }}
                                className={`
                                    w-full px-5 py-3 rounded-lg text-base font-medium
                                    focus:outline-none
                                    ${errors.address
                                        ? "border-2 border-red-500 bg-red-50 animate-shake"
                                        : "bg-gray-200"}
                                `}
                            />

                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <textarea
                            placeholder="Ghi chú (tuỳ chọn)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none col-span-2"
                            rows={3}
                        />
                    </div>

                    {/* Payment */}
                    <div className="mt-8">
                        <h3 className="font-semibold mb-3">
                            Phương thức thanh toán
                        </h3>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none">
                                <input type="radio" name="payment" defaultChecked />
                                Thanh toán khi nhận hàng (COD)
                            </label>

                            <label className="flex items-center gap-3 w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none">
                                <input type="radio" name="payment" />
                                Chuyển khoản ngân hàng
                            </label>

                            <label className="flex items-center gap-3 w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none">
                                <input type="radio" name="payment" />
                                Ví điện tử (Momo / ZaloPay)
                            </label>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6">
                        Đơn hàng của bạn
                    </h2>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto">
                        {items.map(item => (
                            <div
                                key={item.productId}
                                className="flex items-center gap-4 border-b  border-[#d6d6d6] pb-3"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-16 h-16 rounded object-cover"
                                />

                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        x{item.quantity}
                                    </p>
                                </div>

                                <p className="font-semibold text-red-600">
                                    {(item.price * item.quantity).toLocaleString()} ₫
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* SUMMARY */}
                    <div className="border-t  border-[#d6d6d6] mt-6 pt-4 space-y-3">
                        <div className="flex justify-between">
                            <span>Tạm tính</span>
                            <span>{totalPrice.toLocaleString()} ₫</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold text-green-700">
                            <span>Tổng cộng</span>
                            <span>{totalPrice.toLocaleString()} ₫</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full mt-6 bg-green-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition disabled:opacity-60"
                    >
                        {loading ? "Đang xử lý..." : "Xác Nhận Thanh Toán"}
                    </button>

                    <button
                        onClick={() => navigate("/cart")}
                        className="w-full mt-3 border border-green-700 text-green-700 py-2 rounded-lg hover:bg-green-50"
                    >
                        Quay lại giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
