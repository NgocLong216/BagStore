import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { items = [], totalPrice = 0 } = location.state || {};

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [subAddress, setSubAddress] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [errors, setErrors] = useState({});
    const [shake, setShake] = useState({});

    // Fetch default address
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("http://localhost:8080/api/contacts", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                const defaultAddress = data.find(a => a.isDefault);
                if (defaultAddress) {
                    setFullName(defaultAddress.fullName);
                    setPhone(defaultAddress.phone);
                    setSubAddress(defaultAddress.subAddress);
                    setAddress(defaultAddress.address);
                }
            })
            .catch(err => console.error("Lỗi load địa chỉ:", err));
    }, []);

    const handlePlaceOrder = async () => {
        setErrors({});
        setShake({});
    
        const token = localStorage.getItem("token");
        if (!token) return;
    
        // ===== BANK: chỉ chuyển trang, KHÔNG tạo order =====
        if (paymentMethod === "BANK") {
            const paymentRef = `DH${Date.now()}`;

            navigate("/bank-transfer", {
                state: {
                    paymentRef,
                    fullName,
                    phone,
                    subAddress,
                    address,
                    note,
                    items,
                    totalPrice
                }
            });
            return;
        }
    
        try {
            setLoading(true);
            const paymentRef = `DH${Date.now()}`;
    
            // ===== 1. TẠO ORDER (COD + MOMO) =====
            const orderRes = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    paymentRef,
                    fullName,
                    phone,
                    subAddress,
                    address,
                    note,
                    paymentMethod,
                    items: items.map(i => ({
                        cartId: i.cart_id,
                        productId: i.productId,
                        quantity: i.quantity,
                    })),
                }),
            });
    
            const orderData = await orderRes.json();
    
            if (!orderRes.ok) {
                if (orderData.errors) {
                    setErrors(orderData.errors);
    
                    const shakeFields = {};
                    Object.keys(orderData.errors).forEach(f => (shakeFields[f] = true));
                    setShake(shakeFields);
                    setTimeout(() => setShake({}), 400);
                    return;
                }
                throw new Error(orderData.message || "Đặt hàng thất bại");
            }
    
            // ===== 2. MOMO =====
            if (paymentMethod === "MOMO") {
                try {
                    const momoRes = await fetch("http://localhost:8080/api/pay/momo", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            orderId: orderData.orderId.toString(),
                            amount: orderData.totalPrice.toString(),
                        }),
                    });
    
                    if (!momoRes.ok) {
                        const text = await momoRes.text();
                        throw new Error(`Momo API error ${momoRes.status}: ${text}`);
                    }
    
                    const momoData = await momoRes.json();
    
                    if (momoData.payUrl) {
                        window.location.href = momoData.payUrl;
                    } else {
                        throw new Error("Thanh toán Momo thất bại");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Thanh toán Momo thất bại: " + err.message);
                }
                return;
            }
    
            // ===== 3. COD =====
            navigate("/order-success", {
                state: {
                    paymentRef: paymentRef,
                    orderId: orderData.orderId,
                    totalPrice: orderData.totalPrice,
                },
            });
    
        } catch (err) {
            console.error(err);
            alert("Đặt hàng thất bại: " + err.message);
        } finally {
            setLoading(false);
        }
    };
    

    // Empty cart
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">Không có sản phẩm để thanh toán</h2>
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
            <h1 className="text-3xl font-bold text-center mb-10 text-green-800">Thanh Toán</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* LEFT FORM */}
                <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={e => {
                                    setFullName(e.target.value);
                                    setErrors(prev => ({ ...prev, fullName: "" }));
                                }}
                                className={`w-full px-5 py-3 rounded-lg text-base font-medium focus:outline-none ${errors.fullName ? "border-2 border-red-500 bg-red-50 animate-shake" : "bg-gray-200"}`}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={e => {
                                    setPhone(e.target.value);
                                    setErrors(prev => ({ ...prev, phone: null }));
                                }}
                                className={`w-full px-5 py-3 rounded-lg text-base font-medium focus:outline-none ${errors.phone ? "border-2 border-red-500 bg-red-50 animate-shake" : "bg-gray-200"}`}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Địa chỉ cụ thể (số nhà, đường...)"
                                value={subAddress}
                                onChange={e => {
                                    setSubAddress(e.target.value);
                                    setErrors(prev => ({ ...prev, subAddress: "" }));
                                }}
                                className={`w-full px-5 py-3 rounded-lg text-base font-medium focus:outline-none ${errors.subAddress ? "border-2 border-red-500 bg-red-50 animate-shake" : "bg-gray-200"}`}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Phường / Quận / Tỉnh"
                                value={address}
                                onChange={e => {
                                    setAddress(e.target.value);
                                    setErrors(prev => ({ ...prev, address: "" }));
                                }}
                                className={`w-full px-5 py-3 rounded-lg text-base font-medium focus:outline-none ${errors.address ? "border-2 border-red-500 bg-red-50 animate-shake" : "bg-gray-200"}`}
                            />
                        </div>

                        <textarea
                            placeholder="Ghi chú (tuỳ chọn)"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none col-span-2"
                            rows={3}
                        />
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="mt-8">
                        <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>
                        <div className="space-y-3">
                            {["COD", "BANK", "MOMO"].map(method => (
                                <label key={method} className="flex items-center gap-3 w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                    />
                                    {method === "COD" && "Thanh toán khi nhận hàng (COD)"}
                                    {method === "BANK" && "Chuyển khoản ngân hàng"}
                                    {method === "MOMO" && "Ví điện tử (Momo / ZaloPay)"}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SUMMARY */}
                <div className="bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6">Đơn hàng của bạn</h2>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto">
                        {items.map(item => (
                            <div key={item.productId} className="flex items-center gap-4 border-b border-[#d6d6d6] pb-3">
                                <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover" />
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                                </div>
                                <p className="font-semibold text-red-600">{(item.price * item.quantity).toLocaleString()} ₫</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#d6d6d6] mt-6 pt-4 space-y-3">
                        <div className="flex justify-between"><span>Tạm tính</span><span>{totalPrice.toLocaleString()} ₫</span></div>
                        <div className="flex justify-between text-lg font-bold text-green-700"><span>Tổng cộng</span><span>{totalPrice.toLocaleString()} ₫</span></div>
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
