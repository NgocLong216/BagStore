import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";


export default function HomePage({ user }) {
  const [products, setProducts] = useState([]);
  const { cartCount, setCartCount } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const getProductImage = (p) => {
    if (!p.imageUrl) {
      return "https://placehold.co/300x300?text=No+Image";
    }

    // URL đầy đủ (cloud, http...)
    if (p.imageUrl.startsWith("http")) {
      return p.imageUrl;
    }

    // Ảnh upload từ backend
    return `http://localhost:8080${p.imageUrl}`;
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/products/top4")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/products/top-selling")
      .then(res => res.json())
      .then(data => setFeaturedProducts(data))
      .catch(err => console.error(err));
  }, []);


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
    <main className="mt-[80px]">
      {/* Banner */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover overflow-hidden"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/ddtm7dvwo/image/upload/v1755656967/vecteezy_one-person-hiking-with-backpack-and-equipment-in-mountain_25491176_jtvede.jpg)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative max-w-2xl text-center text-white px-6">
          <h3 className="text-3xl uppercase font-bold">
            Bộ sưu tập balo độc quyền
          </h3>
          <p className="text-base leading-relaxed py-4">
            Balo cho một chuyến hành trình tuyệt vời
          </p>
          <a href="/products">
            <button className="bg-[#2c5f2d] text-white w-[130px] h-[45px] rounded-full hover:bg-[#d4a373]">
              Xem Thêm
            </button>
          </a>
        </div>
      </section>



      {/* Service */}
      <section className="grid grid-cols-4 border-b border-gray-200 px-20 py-5">
        {[
          {
            img: "https://res.cloudinary.com/ddtm7dvwo/image/upload/v1755592470/delivery-truck_wexczj.png",
            title: "Chuyển Phát Nhanh",
            desc: "Cho Đơn Từ 0đ",
          },
          {
            img: "https://res.cloudinary.com/ddtm7dvwo/image/upload/v1755592470/credit-card_yeonbk.png",
            title: "Giao Dịch An Toàn",
            desc: "100% Bảo Mật",
          },
          {
            img: "https://res.cloudinary.com/ddtm7dvwo/image/upload/v1755592470/surprise_y5vmcu.png",
            title: "Giảm Giá Thường Xuyên",
            desc: "Khuyến Mãi Lớn",
          },
          {
            img: "https://res.cloudinary.com/ddtm7dvwo/image/upload/v1755592470/chat_fpcgvc.png",
            title: "Hỗ Trợ Chất Lượng",
            desc: "Dịch Vụ 24/7",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start p-5 bg-[#f8f9fa] m-2 rounded-xl"
          >
            <img src={item.img} alt={item.title} className="w-[50px] mr-3" />
            <div>
              <span className="block font-semibold text-[#01213A]">
                {item.title}
              </span>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Category */}
      <section className="grid grid-cols-4 gap-5 p-10">
        <div
          className="relative rounded-xl text-white p-5 bg-cover bg-center col-span-2 row-span-2"
          style={{ backgroundImage: "url(https://media.istockphoto.com/id/1339055637/photo/back-to-school-background-stationery-supplies-in-the-school-bag-banner-design-education-on.jpg?s=612x612&w=0&k=20&c=64U8pLGMWIV7ldiv23XaU5tGUuXqTrEemo_HEueIs40=)" }}
        >
          <p>Ưu đãi đến 15%</p>
          <h2 className="text-2xl font-bold">Balo đi học</h2>
          <Link to="/products?category=school">
            <button className="mt-3 px-5 py-2 border border-white rounded-full font-bold hover:bg-white hover:text-black transition">
              Mua ngay
            </button>
          </Link>
        </div>

        <div
          className="relative rounded-xl text-white p-5 bg-cover bg-center row-span-2"
          style={{ backgroundImage: "url(https://res.cloudinary.com/ddtm7dvwo/image/upload/v1766734179/cc5ddb1c-add1-4713-a881-a1c9e0617cf4.png)" }}
        >
          <p>Nhiều mẫu lựa chọn</p>
          <h2 className="text-2xl font-bold">Balo laptop – công sở</h2>
          <Link to="/products?category=laptop">
            <button className="mt-3 px-5 py-2 border border-white rounded-full font-bold hover:bg-white hover:text-black transition">
              Mua ngay
            </button>
          </Link>
        </div>

        <div
          className="relative rounded-xl text-white p-5 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.wallpaperscraft.com/image/single/backpack_mountain_lake_197548_1280x720.jpg)" }}
        >
          <p>Đồng hành mọi chuyến đi</p>
          <h2 className="text-2xl font-bold">Balo du lịch – phượt</h2>
          <Link to="/products?category=travel">
            <button className="mt-3 px-5 py-2 border border-white rounded-full font-bold hover:bg-white hover:text-black transition">
              Mua ngay
            </button>
          </Link>
        </div>

        <div
          className="relative rounded-xl text-white p-5 bg-cover bg-center"
          style={{ backgroundImage: "url(https://plus.unsplash.com/premium_photo-1687128298225-fab96b21c771?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)" }}
        >
          <p>Nhẹ nhàng & dễ thương</p>
          <h2 className="text-2xl font-bold">Balo trẻ em</h2>
          <Link to="/products?category=kids">
            <button className="mt-3 px-5 py-2 border border-white rounded-full font-bold hover:bg-white hover:text-black transition">
              Mua ngay
            </button>
          </Link>
        </div>
      </section>

      {/* Product */}
      <section id="discount-products" className="mx-auto p-10 border-b border-gray-200 text-center bg-gradient-to-r from-[#2c5f46] to-[#2c5f2d] pt-20">
        <h1 className="my-8 text-3xl uppercase font-bold bg-white bg-clip-text text-transparent">
        Sản Phẩm Mới
        </h1>
        <p className="text-white max-w-2xl mx-auto">
        Khám phá những mẫu balo mới nhất vừa cập bến, thiết kế hiện đại và chất lượng vượt trội!
        </p>

        <div className="max-w-6xl mx-auto grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {products.map((p) => (
            <div
              key={p.productId} // chú ý backend trả về camelCase hoặc snake_case
              className="relative border border-[rgb(204,231,208)] rounded-xl shadow-sm p-4 hover:shadow-lg transition group bg-white"
            >
              {/* Badge HẾT */}
              {p.stock === 0 && (
                <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-black text-white
                  flex items-center justify-center text-sm font-semibold z-10">
                  HẾT
                </div>
              )}
              <a href={`/product/${p.productId}`}>
                <div className="flex justify-center items-center min-h-[250px]">
                  <img
                    src={getProductImage(p)}
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
              <form
                action={user ? "/cart" : "/login"}
                method="POST"
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition"
              >
                {user && (
                  <>
                    <input type="hidden" name="user_id" value={user.user_id} />
                    <input type="hidden" name="product_id" value={p.productId} />
                    <input type="hidden" name="quantity" value="1" />
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (p.stock === 0) return;
                    addToCart(p.productId);
                  }}
                  disabled={p.stock === 0}
                  className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center
                                rounded-full transition
                                ${p.stock === 0
                      ? "bg-gray-400 cursor-not-allowed opacity-60"
                      : "bg-[#e0a46e] text-white hover:bg-green-700 opacity-0 group-hover:opacity-100"
                    }`}
                >
                  <FaShoppingCart />
                </button>

              </form>
            </div>
          ))}
        </div>
      </section>

      <section id="featured-products" className="p-10 text-center pt-20">
        <h1 className="my-8 text-3xl uppercase font-bold bg-gradient-to-r from-[#2c5f46] to-[#2c5f2d] bg-clip-text text-transparent">
          Sản Phẩm Nổi Bật
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Khám phá những chiếc ba lô được đánh giá hàng đầu của chúng tôi, được
          lựa chọn cẩn thận cho mọi phong cách sống
        </p>

        <div className="max-w-6xl mx-auto grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {featuredProducts.map((p) => (
            <div
              key={p.productId} // chú ý backend trả về camelCase hoặc snake_case
              className="relative border border-[rgb(204,231,208)] rounded-xl shadow-sm p-4 hover:shadow-lg transition group "
            >
              {/* Badge HẾT */}
              {p.stock === 0 && (
                <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-black text-white
                  flex items-center justify-center text-sm font-semibold z-10">
                  HẾT
                </div>
              )}
              <a href={`/product/${p.productId}`}>
                <div className="flex justify-center items-center min-h-[250px]">
                  <img
                    src={getProductImage(p)}
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
              <form
                action={user ? "/cart" : "/login"}
                method="POST"
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition"
              >
                {user && (
                  <>
                    <input type="hidden" name="user_id" value={user.user_id} />
                    <input type="hidden" name="product_id" value={p.productId} />
                    <input type="hidden" name="quantity" value="1" />
                  </>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (p.stock === 0) return;
                    addToCart(p.productId);
                  }}
                  disabled={p.stock === 0}
                  className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center
                              rounded-full transition
                              ${p.stock === 0
                      ? "bg-gray-400 cursor-not-allowed opacity-60"
                      : "bg-[#e0a46e] text-white hover:bg-green-700 opacity-0 group-hover:opacity-100"
                    }`}
                >
                  <FaShoppingCart />
                </button>

              </form>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      {/* <section className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="my-8 text-3xl uppercase font-bold bg-gradient-to-r from-[#2c5f46] to-[#2c5f2d] bg-clip-text text-transparent">
          Bài Viết Mới
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Khám phá những chia sẻ, mẹo chọn balo và xu hướng mới nhất dành cho bạn
        </p>

        <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600",
              title: "Top 5 mẫu balo được yêu thích nhất 2025",
              desc: "Khám phá những mẫu balo hot trend đang được giới trẻ lựa chọn nhiều nhất.",
            },
            {
              img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
              title: "Cách chọn balo laptop phù hợp với công việc",
              desc: "Một chiếc balo phù hợp sẽ giúp bạn bảo vệ laptop và thuận tiện hơn khi di chuyển.",
            },
            {
              img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
              title: "Bí quyết đóng gói balo cho chuyến đi dài ngày",
              desc: "Tận dụng tối đa không gian và mang theo đầy đủ vật dụng cần thiết.",
            },
          ].map((blog, i) => (
            <div
              key={i}
              className="border border-[rgb(204,231,208)] rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              <a href={`/blog/${i}`}>
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-left">
                  <h3 className="font-bold text-lg text-[#01213A]">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">{blog.desc}</p>
                  <span className="text-[#2c5f2d] font-semibold text-sm mt-3 block hover:underline">
                    Đọc thêm →
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section> */}
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

  );
}
