import { useState, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaFilter } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import Pagination from "../components/Pagination";


export default function ProductPage({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";

  const [searchText, setSearchText] = useState(keyword);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const { cartCount, setCartCount } = useCart();
  const [showToast, setShowToast] = useState(false);

  // Đồng bộ search box với keyword trên URL
  useEffect(() => {
    setSearchText(keyword);
  }, [keyword]);

  // Fetch sản phẩm mỗi khi keyword, page, sort thay đổi
  useEffect(() => {
    fetch(
      `http://localhost:8080/api/products?keyword=${keyword}&page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [keyword, sortBy, order, page, size]);

  // Xử lý search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim() !== "") {
      navigate(`/products?keyword=${encodeURIComponent(searchText)}`);
      setPage(0);
    } else {
      navigate("/products");
    }
  };

  // Thêm giỏ hàng 
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Lỗi khi thêm vào giỏ hàng");
      }

      setCartCount(prev => prev + 1);

      //  Hiện thông báo
      setShowToast(true);

      //  Tự ẩn sau 2 giây
      setTimeout(() => setShowToast(false), 2000);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Banner */}
      <section
        id="banner"
        className="relative flex flex-col justify-center items-center text-center bg-cover bg-[position:50%_75%] w-full h-[40vh] mt-[80px]"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/1d/0f/3a/1d0f3a3a86c5ca22d99fef49e641d0ef.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
          <h2 className="text-white text-3xl py-2">#sản phẩm</h2>
          <h4 className="text-white text-base py-2">
            Khám phá <span className="text-red-500">sản phẩm</span> mới nhất
          </h4>
        </div>
      </section>

      <main className="max-w-7xl mx-auto p-10">
        <h1 className="text-3xl uppercase font-bold text-center mb-10 bg-gradient-to-r from-[#2c5f46] to-[#2c5f2d] bg-clip-text text-transparent">
          {keyword ? `Kết quả cho "${keyword}"` : "Tất Cả Sản Phẩm"}
        </h1>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 pr-12 bg-gray-200 rounded-lg focus:outline-none"
            />
            <FaSearch className="absolute right-4 top-3 text-gray-500" />
          </form>

          {/* Sort */}
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split("-");
              setSortBy(s);
              setOrder(o);
              setPage(0);
            }}
            className=" px-4 py-2 bg-gray-200 rounded-lg focus:outline-none"
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>

        {/* Grid Products */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.productId}
              className="relative border border-[rgb(204,231,208)] rounded-xl shadow-sm p-4 hover:shadow-lg transition group"
            >
              <a href={`/product/${p.productId}`}>
                <div className="flex justify-center items-center min-h-[250px]">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-[230px] rounded-xl transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="text-left py-3">
                  <h5 className="text-sm text-[#01213A]">{p.name}</h5>
                  <h4 className="text-[#088178] font-bold">
                    {p.price.toLocaleString()} ₫
                  </h4>
                </div>
              </a>

              {/* Add to cart */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(p.productId);
                }}
                className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#e0a46e] text-white hover:bg-green-700 transition opacity-0 group-hover:opacity-100"
              >
                <FaShoppingCart />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
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
                Đã thêm vào giỏ hàng
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Sản phẩm đã được thêm thành công
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}