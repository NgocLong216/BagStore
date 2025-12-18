import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { MdPayment } from "react-icons/md";


export default function CartPage() {
    const [cartList, setCartList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { cartCount, setCartCount } = useCart();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteType, setDeleteType] = useState("single"); // "single" | "multiple"
    const [showWarningModal, setShowWarningModal] = useState(false);



    // Gọi API lấy giỏ hàng
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/cart", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Không thể load giỏ hàng");

                const data = await res.json();

                // mapping dữ liệu từ backend -> frontend
                const mappedData = data.map((c) => ({
                    cart_id: c.cartId,
                    product_id: c.product?.productId,
                    name: c.product?.name || "Sản phẩm",
                    price: c.product?.price || 0,
                    image_url: c.product?.imageUrl || "/images/default.jpg",
                    quantity: c.quantity,
                    stock: c.product?.stock || 1, // thêm số lượng tồn kho
                }));


                setCartList(mappedData);
                recalcCartCount(mappedData);
            } catch (err) {
                console.error("Lỗi load giỏ hàng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        if (showDeleteModal || showWarningModal) {
            // Khoá scroll
            document.body.style.overflow = "hidden";
        } else {
            // Mở lại scroll
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showDeleteModal, showWarningModal]);


    const recalcCartCount = (list) => {
        const total = list.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
    };


    const handleCheckout = () => {
        if (selectedIds.length === 0 || totalPrice <= 0) {
            setShowWarningModal(true);
            return;
        }

        const selectedItems = cartList
            .filter(c => selectedIds.includes(c.cart_id))
            .map(c => ({
                cart_id: c.cart_id,
                productId: c.product_id,
                name: c.name,
                price: c.price,
                quantity: c.quantity,
                image_url: c.image_url,
            }));

        navigate("/checkout", {
            state: {
                items: selectedItems,
                totalPrice,
            },
        });
    };



    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(cartList.map((c) => c.cart_id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const totalQuantity = selectedIds.length;
    const totalPrice = cartList
        .filter((c) => selectedIds.includes(c.cart_id))
        .reduce((sum, c) => sum + c.price * c.quantity, 0);

    // Xoá 1 sản phẩm
    const handleDelete = (id) => {
        setDeleteTargetId(id);
        setDeleteType("single");
        setShowDeleteModal(true);
    };


    // Xoá nhiều sản phẩm đã chọn
    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;

        setDeleteType("multiple");
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteType === "single") {
                await fetch(`http://localhost:8080/api/cart/${deleteTargetId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                setCartList(prev => {
                    const updated = prev.filter(c => c.cart_id !== deleteTargetId);
                    recalcCartCount(updated);
                    return updated;
                });

                setSelectedIds(prev => prev.filter(id => id !== deleteTargetId));
            }

            if (deleteType === "multiple") {
                for (const id of selectedIds) {
                    await fetch(`http://localhost:8080/api/cart/${id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                }

                setCartList(prev => {
                    const updated = prev.filter(c => !selectedIds.includes(c.cart_id));
                    recalcCartCount(updated);
                    return updated;
                });

                setSelectedIds([]);
            }
        } catch (err) {
            console.error("Xóa thất bại:", err);
        } finally {
            setShowDeleteModal(false);
            setDeleteTargetId(null);
        }
    };


    const handleQuantityChange = async (cartId, newQuantity, stock) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Ràng buộc số lượng
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > stock) newQuantity = stock;

        try {
            await fetch(`http://localhost:8080/api/cart/${cartId}/quantity`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            // cập nhật state local
            setCartList((prev) => {
                const updated = prev.map((item) =>
                    item.cart_id === cartId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                recalcCartCount(updated);
                return updated;
            });

        } catch (err) {
            console.error("Update số lượng thất bại:", err);
        }
    };


    if (loading) return <p className="text-center py-10">Đang tải giỏ hàng...</p>;

    return (
        <div className="w-full">
            {/* Banner */}
            <section
                id="banner"
                className="relative flex flex-col justify-center items-center text-center bg-[url('https://i.pinimg.com/1200x/f0/3b/84/f03b842864fd7c785c0e986068366a50.jpg')] bg-cover bg-center w-full h-[40vh] mt-[88px]"
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10">
                    <h2 className="text-white text-3xl py-2">#giỏ hàng</h2>
                    <h4 className="text-white text-base py-2">
                        Lưu <span className="text-red-500">voucher</span> để giảm giá
                    </h4>
                </div>
            </section>

            {/* Cart Table */}
            <section className="p-10">
                <table className="w-full border-collapse bg-white shadow-md">
                    <thead>
                        <tr className="bg-orange-50 text-orange-700">
                            <th className="p-3 border-b border-[#d6d6d6]">
                                <input
                                    type="checkbox"
                                    checked={
                                        cartList.length > 0 &&
                                        selectedIds.length === cartList.length
                                    }
                                    onChange={toggleSelectAll}
                                    className="scale-150"
                                />
                            </th>
                            <th className="p-3 border-b border-[#d6d6d6]">Sản phẩm</th>
                            <th className="p-3 border-b border-[#d6d6d6]">Tên sản phẩm</th>
                            <th className="p-3 border-b border-[#d6d6d6]">Đơn giá</th>
                            <th className="p-3 border-b border-[#d6d6d6]">Số lượng</th>
                            <th className="p-3 border-b border-[#d6d6d6]">Số tiền</th>
                            <th className="p-3 border-b border-[#d6d6d6]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartList.map((c) => (
                            <tr key={c.cart_id} className="text-center">
                                <td className="p-3 border-b border-[#d6d6d6]">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(c.cart_id)}
                                        onChange={() => toggleSelectItem(c.cart_id)}
                                        className="scale-150"
                                    />
                                </td>
                                <td className="p-3 border-b border-[#d6d6d6] flex justify-center">
                                    <img
                                        src={c.image_url}
                                        alt={c.name}
                                        className="w-16 h-auto rounded text-base"
                                    />
                                </td>
                                <td className="p-3 border-b border-[#d6d6d6]">{c.name}</td>
                                <td className="p-3 border-b border-[#d6d6d6]">
                                    {c.price.toLocaleString()} ₫
                                </td>
                                <td className="p-3 border-b border-[#d6d6d6]">
                                    <input
                                        type="number"
                                        value={c.quantity}
                                        min="1"
                                        max={c.stock}
                                        className="text-center px-1 py-1 bg-gray-200 rounded-lg text-gray-800 focus:outline-none"
                                        onChange={(e) =>
                                            handleQuantityChange(c.cart_id, +e.target.value, c.stock)
                                        }
                                    />

                                </td>
                                <td className="p-3 border-b border-[#d6d6d6] text-red-600 font-semibold">
                                    {(c.price * c.quantity).toLocaleString()} ₫
                                </td>
                                <td className="p-3 border-b border-[#d6d6d6]">
                                    <button
                                        onClick={() => handleDelete(c.cart_id)}
                                        className="text-red-700 font-semibold px-4 py-2 hover:bg-gray-100"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Buy Section */}
            <section className="flex justify-center mb-12">
                <div className="flex justify-between items-center bg-white shadow-md p-5 w-[95%]">
                    <p className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedIds.length === cartList.length}
                            onChange={toggleSelectAll}
                            className="scale-150 mr-3"
                        />
                        Chọn tất cả
                        <button
                            onClick={handleDeleteSelected}
                            className="mx-10 text-red-700 font-semibold px-4 py-2 hover:bg-gray-100"
                        >
                            Xóa ({totalQuantity} sản phẩm)
                        </button>
                    </p>

                    <p className="flex items-center">
                        Tổng cộng ({totalQuantity} sản phẩm):{" "}
                        <span className="text-red-600 font-bold text-xl mr-5">
                            {totalPrice.toLocaleString()} ₫
                        </span>
                        <div className="relative">
                            <button
                                onClick={handleCheckout}
                                className="flex items-center gap-2 bg-green-800 text-white px-8 py-2 rounded-md font-bold hover:bg-green-900 transition"
                            >
                                Thanh Toán
                                <MdPayment />
                            </button>
                        </div>

                    </p>
                </div>
            </section>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]"
                        onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 text-gray-800">
                            Xác nhận xoá
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xoá{" "}
                            {deleteType === "multiple"
                                ? `${selectedIds.length} sản phẩm`
                                : "sản phẩm này"}
                            ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showWarningModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">
                            Chưa chọn sản phẩm
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Vui lòng chọn ít nhất một sản phẩm để thanh toán.
                        </p>
                        <button
                            onClick={() => setShowWarningModal(false)}
                            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}
