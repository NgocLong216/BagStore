import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaTags,
  FaWarehouse
} from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
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

  // add
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);


  const handleCreateProduct = async () => {
    const errors = {};

    if (!newProduct.name) errors.name = "Tên sản phẩm không được để trống";
    if (!newProduct.price || newProduct.price <= 0) errors.price = "Giá không hợp lệ";
    if (!newProduct.stock || newProduct.stock < 0) errors.stock = "Tồn kho không hợp lệ";
    if (!newProduct.category) errors.category = "Danh mục không được để trống";
    if (!imageFile) errors.image = "Vui lòng chọn ảnh";

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setCreating(true);
    setFieldErrors({});
    setCreateError(null);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category", newProduct.category);
      formData.append("image", imageFile); // 👈 QUAN TRỌNG

      const res = await fetch("http://localhost:8080/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Tạo sản phẩm thất bại");

      const created = await res.json();

      setProducts(prev => [created, ...prev]);
      setFilteredProducts(prev => [created, ...prev]);
      setSelectedProduct(created);

      setShowCreateModal(false);
      setNewProduct({ name: "", price: "", stock: "", category: "" });
      setImageFile(null);

    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };




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
    const image = p.imageUrl || p.thumbnail;

    if (!image) {
      return "https://placehold.co/300x300?text=No+Image";
    }

    return image.startsWith("http")
      ? image
      : `http://localhost:8080${image}`;
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

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-green-700 text-white font-bold p-3 rounded-lg shadow hover:bg-green-900"
            >
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
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[420px] p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Tạo sản phẩm</h2>

              {createError && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex gap-3 items-center">
                  <MdErrorOutline /> {createError}
                </div>
              )}

              <div className="space-y-3">

                {/* TÊN */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      placeholder="Tên sản phẩm"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                ${fieldErrors.name ? "border border-red-500" : ""}
              `}
                      value={newProduct.name}
                      onChange={e =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                    <FaBoxOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                {/* GIÁ */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Giá"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                ${fieldErrors.price ? "border border-red-500" : ""}
              `}
                      value={newProduct.price}
                      onChange={e =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                    <FaTags className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.price && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.price}</p>
                  )}
                </div>

                {/* TỒN KHO */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Tồn kho"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                ${fieldErrors.stock ? "border border-red-500" : ""}
              `}
                      value={newProduct.stock}
                      onChange={e =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                    />
                    <FaWarehouse className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.stock && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.stock}</p>
                  )}
                </div>

                {/* DANH MỤC */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      placeholder="Danh mục"
                      className={`w-full px-5 py-3 bg-gray-200 rounded-lg
                ${fieldErrors.category ? "border border-red-500" : ""}
              `}
                      value={newProduct.category}
                      onChange={e =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                      }
                    />
                    <FaBoxOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  </div>

                  {fieldErrors.category && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.category}</p>
                  )}
                </div>

                {/* ẢNH */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Ảnh sản phẩm</label>

                  <div className="flex items-center gap-4">
                    {/* NÚT CHỌN ẢNH */}
                    <label className="cursor-pointer px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-900 transition">
                      Chọn ảnh
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={e => setImageFile(e.target.files[0])}
                      />
                    </label>

                    {/* TÊN FILE */}
                    {imageFile && (
                      <span className="text-sm text-gray-600 truncate max-w-[180px]">
                        {imageFile.name}
                      </span>
                    )}
                  </div>

                  {/* PREVIEW */}
                  {imageFile && (
                    <div className="mt-4">
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="w-28 h-28 rounded-lg object-cove"
                      />
                    </div>
                  )}
                </div>


              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>

                <button
                  disabled={creating}
                  onClick={handleCreateProduct}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900 disabled:opacity-60"
                >
                  {creating ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
