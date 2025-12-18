import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaShoppingBag, FaStar } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { CheckCircle2 } from "lucide-react";
import ReviewPagination from "../components/Pagination";


export default function ProductInfoPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [specs, setSpecs] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("details");
    const { cartCount, setCartCount } = useCart();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // review
    const [reviews, setReviews] = useState([]);
    const [reviewPage, setReviewPage] = useState(0);
    const [reviewSize] = useState(5);
    const [reviewTotalPages, setReviewTotalPages] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState("");



    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // 1️⃣ Product detail
                const res = await fetch(`http://localhost:8080/api/products/details/${id}`);
                if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
                const data = await res.json();

                setProduct({
                    productId: data.productId,
                    name: data.name,
                    description: data.description,
                    detail: data.detail,
                    price: data.price,
                    stock: data.stock,
                    category: data.category,
                });

                setSpecs(data.specifications || []);

                // 2️⃣ Product images (API RIÊNG)
                const imgRes = await fetch(
                    `http://localhost:8080/api/products/${id}/images`
                );

                if (imgRes.ok) {
                    const imgData = await imgRes.json();
                    setImages(imgData);

                    setActiveImage(
                        imgData.length > 0
                            ? imgData[0].imageUrl
                            : "/images/default.jpg"
                    );


                }

                // 3️⃣ Recommend
                const recRes = await fetch(
                    `http://localhost:8080/api/products/${id}/recommend`
                );
                if (recRes.ok) {
                    setRecommendedProducts(await recRes.json());
                }

            } catch (err) {
                console.error("Lỗi load sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Mua ngay
    const handleBuyNow = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const items = [
            {
                productId: product.productId,
                name: product.name,
                price: product.price,
                quantity,
                image_url: activeImage || "/images/default.jpg",
            },
        ];

        const totalPrice = product.price * quantity;

        navigate("/checkout", {
            state: {
                items,
                totalPrice,
            },
        });
    };




    // ================== REVIEW ==================

    const fetchReviews = async () => {
        try {
            // 1️⃣ Lấy review theo trang
            const resPage = await fetch(
                `http://localhost:8080/api/products/${id}/reviews?page=${reviewPage}&size=${reviewSize}`
            );
            if (!resPage.ok) throw new Error("Không lấy được đánh giá theo trang");
            const dataPage = await resPage.json();
            setReviews(dataPage.content);
            setReviewTotalPages(dataPage.totalPages);

            // 2️⃣ Lấy tổng review + trung bình rating
            const resStats = await fetch(`http://localhost:8080/api/products/${id}/reviews/stats`);
            if (!resStats.ok) throw new Error("Không lấy được thống kê đánh giá");
            const stats = await resStats.json();

            setAverageRating(stats.averageRating.toFixed(1));
            setTotalReviews(stats.totalReviews);

        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => {
        fetchReviews();
    }, [id, reviewPage]);

    const addReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/products/${id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.user_id,
                    rating: newRating,
                    comment: newComment,
                }),
            });

            if (!res.ok) throw new Error("Không thể thêm đánh giá");
            setNewComment("");
            setNewRating(5);
            fetchReviews(); // reload review
            alert("Đã thêm đánh giá!");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    // ================== CART ==================

    const addToCart = async (productId, qty = quantity) => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return false;
        }

        try {
            // Lấy giỏ hàng hiện tại
            const cartRes = await fetch("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const cart = await cartRes.json();

            const existing = cart.find((c) => c.productId === productId);
            const currentQuantity = existing ? existing.quantity : 0;

            if (currentQuantity + qty > product.stock) {
                setToastMessage(`Số lượng vượt quá tồn kho (${product.stock})`);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
                return false;
            }

            // Thêm vào giỏ
            const res = await fetch("http://localhost:8080/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    quantity: qty,
                }),
            });

            if (!res.ok) throw new Error("Lỗi khi thêm vào giỏ hàng");

            setCartCount((prev) => prev + qty);

            // 👉 Toast thành công
            setToastMessage("Đã thêm vào giỏ hàng");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);

            return true;
        } catch (err) {
            console.error(err);
            setToastMessage("Có lỗi xảy ra, vui lòng thử lại");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return false;
        }
    };


    // ================== RENDER ==================

    if (loading) return <p className="text-center py-10">Đang tải sản phẩm...</p>;
    if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm</p>;

    return (
        <div className="mt-[88px] p-10">
            {/* Chi tiết sản phẩm */}
            <div className="flex flex-col md:flex-row">
                {/* Ảnh sản phẩm */}
                <div className="flex-1 flex justify-center ml-36 mr-20">
                    <div className="flex flex-col items-center">
                        <img
                            src={activeImage || "/images/default.jpg"}
                            alt={product.name}
                            className="max-w-full max-h-[600px] rounded-lg shadow-lg object-contain mb-4"
                        />

                        {images.length > 1 && (
                            <div className="flex gap-3">
                                {images.map((img) => (
                                    <img
                                        key={img.imageId}
                                        src={img.imageUrl}
                                        onClick={() => setActiveImage(img.imageUrl)}
                                        className={`w-20 h-20 object-cover rounded cursor-pointer border
                        ${activeImage === img.imageUrl
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>



                </div>

                {/* Thông tin chi tiết */}
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl text-red-600 font-bold mb-6">
                        {product.price.toLocaleString()} ₫
                    </p>

                    <div className="flex items-center mb-6">
                        <label className="mr-3">Số lượng:</label>
                        <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => {
                                let val = +e.target.value;
                                if (val < 1) val = 1;
                                if (val > product.stock) val = product.stock;
                                setQuantity(val);
                            }}
                            className="text-center px-1 py-1 bg-gray-200 rounded-lg text-gray-800 focus:outline-none"
                        />
                        <span className="ml-3 text-gray-500 text-sm">
                            {product.stock} sản phẩm có sẵn
                        </span>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => addToCart(product.productId)}
                            className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-900 transition"
                        >
                            Thêm vào giỏ hàng
                            <FaShoppingCart />
                        </button>


                        <button
                            onClick={handleBuyNow}
                            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
                        >
                            Mua ngay
                            <FaShoppingBag />
                        </button>

                    </div>

                    {specs.length > 0 && (
                        <ul className="text-gray-700 space-y-2">
                            {specs.map((s, idx) => (
                                <li key={idx}>
                                    <strong>{s.specName}:</strong> {s.specValue}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-12 ml-36 mr-36">
                <div className="flex border-b">
                    {["details", "reviews", "policy"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold ${activeTab === tab
                                ? "border-b-2 border-red-600 text-red-600"
                                : "text-gray-600"
                                }`}
                        >
                            {tab === "details" ? "Chi tiết sản phẩm" :
                                tab === "reviews" ? "Đánh giá" :
                                    "Chính sách"}
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-white shadow-md">
                    {/* Chi tiết */}
                    {activeTab === "details" && (
                        <p style={{ whiteSpace: "pre-line" }}>{product.detail}</p>
                    )}

                    {/* Reviews */}
                    {activeTab === "reviews" && (
                        <div>
                            {/* Trung bình rating & tổng review */}
                            <div className="flex items-center mb-4">
                                <div className="flex items-center mr-3">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`mr-1 ${i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-700 font-bold">
                                    {averageRating} / 5
                                </span>
                                <span className="ml-2 text-gray-500">({totalReviews} đánh giá)</span>
                            </div>

                            {/* Danh sách review */}
                            {reviews.length === 0 ? (
                                <p>Chưa có đánh giá nào.</p>
                            ) : (
                                <ul className="space-y-4 mb-4">
                                    {reviews.map((r) => (
                                        <li
                                            key={r.reviewId}
                                            className="p-3 rounded flex items-start gap-3"
                                        >
                                            {/* Avatar */}
                                            <img
                                                src={r.avatarUrl ? `http://localhost:8080${r.avatarUrl}` : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />


                                            {/* Nội dung review */}
                                            <div>
                                                <div className="flex ">
                                                    {/* Tên người dùng */}
                                                    <p className="font-semibold text-gray-800 mr-2">
                                                        {r.username || "Người dùng ẩn danh"}
                                                    </p>

                                                    {/* Thời gian */}
                                                    <small className="text-gray-500 block mt-1">
                                                        {new Date(r.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>

                                                {/* Ngôi sao */}
                                                <div className="flex items-center mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={`mr-1 ${i < r.rating ? "text-yellow-400" : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Comment */}
                                                <p>{r.comment}</p>


                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}



                            {/* Pagination */}
                            <div className="flex items-center gap-2 mt-6">
                                <ReviewPagination
                                    currentPage={reviewPage}
                                    totalPages={reviewTotalPages}
                                    onPageChange={setReviewPage}
                                />
                            </div>

                            {/* Form thêm review */}
                            {user && (
                                <form onSubmit={addReview} className="mt-4 flex flex-col gap-2">
                                    <label>
                                        Rating:
                                        <select
                                            value={newRating}
                                            onChange={(e) => setNewRating(+e.target.value)}
                                            className="ml-2 border px-2 rounded"
                                        >
                                            {[5, 4, 3, 2, 1].map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Comment:
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows={3}
                                            className="w-full border rounded px-2 py-1"
                                        />
                                    </label>
                                    <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-black transition">
                                        Gửi đánh giá
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Chính sách */}
                    {activeTab === "policy" && (
                        <div>
                            <p><strong>Bảo hành:</strong> 6 tháng</p>
                            <p><strong>Đổi trả:</strong> trong vòng 7 ngày nếu có lỗi NSX</p>
                            <p><strong>Cam kết:</strong> sản phẩm chính hãng 100%</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Đề xuất sản phẩm */}
            <div className="mt-16 max-w-6xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">Có thể bạn cũng thích</h3>
                <div className="max-w-6xl mx-auto grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                    {recommendedProducts.map((rec) => (
                        <div
                            key={rec.productId}
                            className="relative border border-[rgb(204,231,208)] rounded-xl shadow-sm p-4 hover:shadow-lg transition group "
                        >
                            <a href={`/product/${rec.productId}`}>
                                <div className="flex justify-center items-center min-h-[250px]">
                                    <img
                                        src={rec.imageUrl || "/images/default.jpg"}
                                        alt={rec.name}
                                        className="h-[230px] rounded-xl transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <div className="text-left py-3">
                                    <h5 className="text-sm text-[#01213A]">{rec.name}</h5>
                                    <h4 className="text-[#088178] font-bold">
                                        {rec.price.toLocaleString()} ₫
                                    </h4>
                                </div>
                            </a>

                            {/* Add to cart */}
                            <form
                                action={user ? "/cart" : "/login"}
                                method="POST"
                                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition"
                            >
                                {user && (
                                    <>
                                        <input type="hidden" name="user_id" value={user.user_id} />
                                        <input type="hidden" name="product_id" value={rec.productId} />
                                        <input type="hidden" name="quantity" value="1" />
                                    </>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart(rec.productId, 1);
                                    }}
                                    className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#e0a46e] text-white hover:bg-green-700 transition opacity-0 group-hover:opacity-100"
                                >
                                    <FaShoppingCart />
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
            {showToast && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Overlay mờ */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Box thông báo */}
                    <div className="relative bg-white px-8 py-6 rounded-2xl shadow-xl text-center animate-scaleIn">
                        <div className="flex justify-center mb-6">
                            <CheckCircle2 className="w-20 h-20 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {toastMessage}
                        </h3>
                    </div>
                </div>
            )}

        </div>
    );
}
