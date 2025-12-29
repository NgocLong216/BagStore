import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#2c5f2d] text-[#f8f9fa] px-6 py-10">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between gap-8">
        
        {/* Column 1 */}
        <div className="flex-1 min-w-[220px] mr-45">
          <h2 className="font-bold text-xl mb-6 ">My Store</h2>
          <p className="mb-2 flex items-start">
            <FaMapMarkerAlt className="mr-2 mt-1" /> 984, Ấp Tân Hòa, Xã Xuân Thành, Huyện Xuân Lộc, Tỉnh Đồng Nai
          </p>
          <p className="mb-2 flex items-center">
            <FaPhone className="mr-2" /> 0358800010
          </p>
          <p className="mb-2 flex items-center">
            <FaEnvelope className="mr-2" /> buithihuong@gmail.com
          </p>
          <p className="mb-4 flex items-center">
            <FaClock className="mr-2" /> Phản hồi 24/7 qua điện thoại và email.
          </p>
          <div className="flex gap-3">
            <a href="#" className="bg-[#3c763d] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#d4a373]">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-[#3c763d] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#d4a373]">
              <FaYoutube />
            </a>
            <a href="#" className="bg-[#3c763d] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#d4a373]">
              <FaInstagram />
            </a>
            <a href="#" className="bg-[#3c763d] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#d4a373]">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="font-bold text-lg mb-6">Hỗ trợ</h3>
          <ul className="space-y-2">
            <li><a href="/#featured-products" className="hover:text-[#d4a373]">Sản phẩm nổi bật</a></li>
            <li><a href="/#discount-products" className="hover:text-[#d4a373]">Sản phẩm mới</a></li>
            <li><a href="/products" className="hover:text-[#d4a373]">Tất cả sản phẩm</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="font-bold text-lg mb-6">Liên kết</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-[#d4a373]">Trang chủ</a></li>
            <li><a href="/products" className="hover:text-[#d4a373]">Sản phẩm</a></li>
            <li><a href="/contact" className="hover:text-[#d4a373]">Liên hệ</a></li>
          </ul>
        </div>

        {/* Column 4 - Newsletter */}
        {/* <div className="flex-1 min-w-[220px]">
          <h3 className="font-bold text-lg mb-6">Đăng ký nhận tin</h3>
          <p className="mb-4 text-sm">Để nhận thông tin và cập nhật cũng như khuyến mãi mới nhất từ My Store</p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              required
              className="w-full px-4 py-2 rounded-lg text-black outline-none bg-white"
            />
            <button
              type="submit"
              className="w-full bg-[#e0a46e] text-[#f8f9fa] py-2 rounded-lg font-bold hover:bg-[#3c763d] transition"
            >
              Đăng ký
            </button>
          </form>
        </div> */}
      </div>

      {/* Bottom */}
      <div className="text-center mt-8 pt-4 border-t border-white/20 text-sm">
        <p>Copyright © 2025 My Store</p>
      </div>
    </footer>
  );
}
