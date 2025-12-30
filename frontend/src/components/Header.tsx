import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle, FaShoppingCart, FaAddressBook, FaListAlt, FaSignOutAlt, FaChartBar } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";

export default function Header({ user }) {
  const [keyword, setKeyword] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount, setCartCount } = useCart();

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate("/products");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/login"); // hoặc "/"
    window.location.reload(); // đảm bảo App re-render lại user = null
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/cart/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const count = await res.json();
        setCartCount(count);
      } catch (err) {
        console.error("Lỗi load cart count:", err);
      }
    };

    fetchCartCount();
  }, [user]);



  return (
    <header className="flex justify-between items-center px-[10%] h-[100px] bg-[#2c5f2d] fixed w-full top-0 z-[100000] text-white font-montserrat">

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="/longLogo.png" alt="Logo" className="h-30 object-contain"/>
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex gap-8 list-none">
          <li>
            <Link to="/" className="hover:text-[#d4a373]">Trang chủ</Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-[#d4a373]">Sản phẩm</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-[#d4a373]">Liên hệ</Link>
          </li>
        </ul>
      </nav>

      {/* Icons & Search */}
      <div className="flex items-center">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm"
            className="rounded-full border-none h-[30px] px-4 text-black bg-white"
          />
          <button type="submit" className="ml-2 bg-[#2c5f2d] border-none">
            <FaSearch className="text-white hover:text-[#d4a373]" />
          </button>
        </form>

        {/* User dropdown */}
        {user ? (
          <div className="relative ml-4 flex items-center gap-2 user-dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 flex items-center"
            >
              <FaUserCircle className="text-2xl hover:text-[#d4a373]" />
            </button>

            <span className="text-sm font-medium">{user.username}</span>

            {dropdownOpen && (
              <div className="absolute top-[120%] left-0 bg-white text-gray-700 rounded-md shadow-lg w-44">

                {/* ===== ADMIN ===== */}
                {user.role === "ADMIN" ? (
                  <>
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaChartBar className="text-[#d4a373] mr-2" />
                      Quản lý
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <FaSignOutAlt className="text-[#d4a373] mr-2" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    {/* ===== USER THƯỜNG ===== */}
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <FaAddressBook className="text-[#d4a373] mr-2" />
                      Hồ sơ
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <FaListAlt className="text-[#d4a373] mr-2" />
                      Đơn mua
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <FaSignOutAlt className="text-[#d4a373] mr-2" />
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="ml-4">
            <FaUserCircle className="text-2xl hover:text-[#d4a373]" />
          </Link>
        )}


        {/* Cart icon */}
        <Link to="/cart" className="relative ml-4 hover:text-[#d4a373]">
          <FaShoppingCart className="text-2xl" />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-white text-[#2c5f2d] border border-[#2c5f2d] text-xs px-[7px] py-[2px] rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

      </div>
    </header>
  );
}
