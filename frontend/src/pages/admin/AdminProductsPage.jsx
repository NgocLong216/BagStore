import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaTags,
  FaWarehouse
} from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm");

        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        setSelectedProduct(data[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const f = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(f);
  }, [search, products]);

  const getProductImage = (p) => {
    if (!p.thumbnail) {
      return "https://placehold.co/300x300?text=No+Image";
    }
  
    return p.thumbnail.startsWith("http")
      ? p.thumbnail
      : `http://localhost:8080${p.thumbnail}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1">
        <AdminHeader title="Quản Lý Sản Phẩm" />

        <div className="p-8">
          {/* TOP BAR */}
          <div className="flex gap-4 mb-6 w-[70%]">
            <div className="flex items-center gap-3 bg-white px-4 rounded-lg shadow w-[500px]">
              <FaSearch className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc danh mục..."
                className="w-full outline-none"
              />
            </div>

            <div className="flex-1" />

            <button className="flex items-center gap-2 bg-green-700 text-white font-bold p-3 rounded-lg shadow hover:bg-green-900">
              <IoIosAddCircleOutline size={22} />
              Thêm sản phẩm
            </button>
          </div>

          <div className="flex justify-between">
            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden w-[70%]">
              {loading && <p className="p-4">Đang tải...</p>}
              {error && <p className="p-4 text-red-600">{error}</p>}

              {!loading && !error && (
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4">Sản phẩm</th>
                      <th className="p-4">ID</th>
                      <th className="p-4">Danh mục</th>
                      <th className="p-4">Tồn kho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr
                        key={p.productId}
                        onClick={() => setSelectedProduct(p)}
                        className={`border-t cursor-pointer
                        ${selectedProduct?.productId === p.productId
                          ? "bg-green-600 text-white"
                          : "hover:bg-gray-50"}
                        `}
                      >
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={getProductImage(p)}
                            className="w-10 h-10 rounded object-cover"
                          />
                          {p.name}
                        </td>
                        <td className="p-4">{p.productId}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4">
                          {p.stock > 0 ? p.stock : "Hết hàng"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* RIGHT DETAIL */}
            {selectedProduct && (
              <aside className="w-80 p-6 sticky top-24 h-fit">
                <div className="rounded-xl p-6 text-center">
                  <img
                    src={getProductImage(selectedProduct)}
                    className="w-40 h-40 mx-auto rounded object-cover mb-4"
                  />

                  <h2 className="text-xl font-bold">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-gray-500 mb-4">
                    {selectedProduct.category}
                  </p>

                  <p className="text-lg font-semibold text-green-700 mb-2">
                    {selectedProduct.price?.toLocaleString()} đ
                  </p>

                  <p className={`text-sm font-semibold mb-4
                    ${selectedProduct.stock > 0
                      ? "text-green-600"
                      : "text-red-600"}
                  `}>
                    {selectedProduct.stock > 0
                      ? "Còn hàng"
                      : "Hết hàng"}
                  </p>

                  <div className="flex justify-center gap-4">
                    <button className="p-3 bg-white text-green-700 rounded-lg hover:bg-gray-200">
                      <FaEdit />
                    </button>

                    <button className="p-3 bg-white text-red-700 rounded-lg hover:bg-red-200">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
