import { FaMapMarkerAlt, FaCalendar, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
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
          <h3 className="text-2xl text-[#d4a373] mt-5 mb-5">Liên Hệ My Store</h3>
          <h1 className="text-4xl font-bold mb-2">
            Chúng tôi sẽ phản hồi bạn sớm nhất có thể
          </h1>
          <p className="text-base text-gray-600 my-5 leading-relaxed">
            Khám phá bộ sưu tập balo thời trang đa dạng tại My Store – nơi phong
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
          <h3 className="text-2xl mb-5">Gửi thắc mắc cho chúng tôi</h3>
          <input
            type="text"
            placeholder="Tên của bạn"
            className="w-full p-3 mt-2 rounded-lg text-black bg-white"
          />
          <div className="flex gap-3 mt-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 p-3 rounded-lg text-black bg-white"
            />
            <input
              type="tel"
              placeholder="Số điện thoại của bạn"
              className="flex-1 p-3 rounded-lg text-black bg-white"
            />
          </div>
          <textarea
            rows="5"
            placeholder="Nội dung"
            className="w-full p-3 mt-2 rounded-lg text-black bg-white"
          ></textarea>
          <button className="mt-5 w-full bg-[#d4a373] hover:bg-green-700 text-white p-3 rounded-lg">
            Gửi cho chúng tôi
          </button>
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
