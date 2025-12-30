import { FaMapMarkerAlt, FaCalendar, FaPhone, FaEnvelope } from "react-icons/fa";
import { useState } from "react";


export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});


  const handleSubmit = async () => {
    setErrors({});
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json(); //  QUAN TRỌNG
        setErrors(errorData.errors || {});

        return;
      }

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setErrors({ global: "Không thể gửi liên hệ" });
    }
  };


  return (
    <div className="bg-[#fff8f2]">
      {/* Banner */}
      <section
        id="banner"
        className="flex flex-col justify-center items-center text-center bg-cover bg-[position:50%_69%] w-full h-[40vh] mt-[80px]"
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/6d/35/95/6d3595a2839f66ba371637d5f7e9fa30.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute top-0 left-0 right-0 h-[51%] bg-black/50"></div>

        <div className="relative z-10">
          <h2 className="text-white text-3xl py-2">#liên hệ</h2>
          <h4 className="text-white text-base py-2">
            Nếu bạn có thắc mắc <span className="text-red-500">liên hệ</span>{" "}
            chúng tôi
          </h4>
        </div>
      </section>

      {/* Contact */}
      <section className="flex flex-wrap justify-around p-10 mt-5">
        {/* Left */}
        <div className="w-full md:w-[45%]">
          <h3 className="text-2xl text-[#d4a373] mt-5 mb-5">Liên Hệ Backpack Zone</h3>
          <h1 className="text-4xl font-bold mb-2">
            Chúng tôi sẽ phản hồi bạn sớm nhất có thể
          </h1>
          <p className="text-base text-gray-600 my-5 leading-relaxed">
            Khám phá bộ sưu tập balo thời trang đa dạng tại Backpack Zone – nơi phong
            cách gặp gỡ sự tiện dụng cho mọi hành trình của bạn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Địa chỉ */}
            <div className="flex gap-3 items-start">
              <div className="w-13 h-8 flex items-center justify-center border border-[#d4a373] rounded-full">
                <FaMapMarkerAlt className="text-[#d4a373]" />
              </div>
              <div>
                <strong>Địa chỉ</strong>
                <p className="text-gray-600">
                  984, Ấp Tân Hòa, Xã Xuân Thành, Huyện Xuân Lộc, Tỉnh Đồng Nai
                </p>
              </div>
            </div>

            {/* Thời gian */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 flex items-center justify-center border border-[#d4a373] rounded-full">
                <FaCalendar className="text-[#d4a373]" />
              </div>
              <div>
                <strong>Thời gian làm việc</strong>
                <p className="text-gray-600">
                  Thứ 2 đến Thứ 6: từ 8h00 đến 17h00; <br />
                  Thứ 7 và Chủ nhật: từ 8h00 đến 17h00
                </p>
              </div>
            </div>

            {/* Điện thoại */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 flex items-center justify-center border border-[#d4a373] rounded-full">
                <FaPhone className="text-[#d4a373]" />
              </div>
              <div>
                <strong>Điện thoại</strong>
                <p className="text-gray-600">0358800010</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 flex items-center justify-center border border-[#d4a373] rounded-full">
                <FaEnvelope className="text-[#d4a373]" />
              </div>
              <div>
                <strong>Email</strong>
                <p className="text-gray-600">buithihuong@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-[45%] bg-[#2d5f2c] p-8 rounded-2xl text-white mt-8 md:mt-0">
          <h3 className="text-2xl mb-6">Gửi thắc mắc cho chúng tôi</h3>

          {/* Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 mt-2 rounded-lg text-black bg-white"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name}</p>
            )}


          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email của bạn"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                className={`w-full p-3 rounded-lg text-black bg-white border 
          ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                placeholder="Số điện thoại của bạn"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  setErrors({ ...errors, phone: "" });
                }}
                className={`w-full p-3 rounded-lg text-black bg-white border 
          ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.phone && (
                <p className="text-red-300 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <textarea
              rows="5"
              placeholder="Nội dung"
              value={form.message}
              onChange={(e) => {
                setForm({ ...form, message: e.target.value });
                setErrors({ ...errors, message: "" });
              }}
              className={`w-full p-3 rounded-lg text-black bg-white border 
        ${errors.message ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.message && (
              <p className="text-red-300 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#d4a373] hover:bg-green-700 text-white p-3 rounded-lg font-semibold disabled:opacity-60 transition"
          >
            {loading ? "Đang gửi..." : "Gửi cho chúng tôi"}
          </button>

          {success && (
            <p className="mt-3 text-green-300 text-sm text-center">
              Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.
            </p>
          )}
        </div>

      </section>

      {/* Map */}
      <section className="mt-12 w-full h-[50vh]">
        <iframe
          src="https://www.google.com/maps?q=984+ĐT766,+Xuân+Thành,+Xuân+Lộc,+Đồng+Nai&output=embed"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}
