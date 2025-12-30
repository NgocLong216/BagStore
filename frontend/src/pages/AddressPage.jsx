import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash, FaThumbtack, FaPlus } from "react-icons/fa";


export default function AddressPage() {
  const API_URL = "http://localhost:8080/api/contacts";

  const [userContacts, setUserContacts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    contactId: null,
    fullName: "",
    phone: "",
    subAddress: "",
    address: "",
    isDefault: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "delete" | "success"
  const [modalMessage, setModalMessage] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (showPopup || showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup, showModal]);
  


  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);


  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);



  // Lấy dữ liệu từ backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // chưa login

    fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUserContacts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    setProvinceCode(code);
    setDistrictCode("");
    setWardCode("");
    setWards([]);

    const res = await fetch(
      `https://provinces.open-api.vn/api/p/${code}?depth=2`
    );
    const data = await res.json();
    setDistricts(data.districts || []);
  };

  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    setDistrictCode(code);
    setWardCode("");

    const res = await fetch(
      `https://provinces.open-api.vn/api/d/${code}?depth=2`
    );
    const data = await res.json();
    setWards(data.wards || []);
  };



  const handleOpenPopup = async (contact = null) => {
    if (contact) {
      setFormData({
        contactId: contact.contactId,
        fullName: contact.fullName,
        phone: contact.phone,
        subAddress: contact.subAddress,
        address: contact.address,
        isDefault: contact.isDefault,
      });


      //  TÁCH ADDRESS
      const [wardName, districtName, provinceName] =
        contact.address.split(",").map(s => s.trim());

      //  TÌM PROVINCE CODE
      const province = provinces.find(p => p.name === provinceName);
      if (!province) return;

      setProvinceCode(province.code);

      //  LOAD DISTRICTS
      const resDistrict = await fetch(
        `https://provinces.open-api.vn/api/p/${province.code}?depth=2`
      );
      const provinceData = await resDistrict.json();
      setDistricts(provinceData.districts);

      const district = provinceData.districts.find(d => d.name === districtName);
      if (!district) return;

      setDistrictCode(district.code);

      //  LOAD WARDS
      const resWard = await fetch(
        `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
      );
      const districtData = await resWard.json();
      setWards(districtData.wards);

      const ward = districtData.wards.find(w => w.name === wardName);
      if (!ward) return;

      setWardCode(ward.code);
    } else {
      // CREATE
      setFormData({
        contactId: null,
        fullName: "",
        phone: "",
        subAddress: "",
        address: "",
        isDefault: false,
      });

      setProvinceCode("");
      setDistrictCode("");
      setWardCode("");
      setDistricts([]);
      setWards([]);
    }

    setShowPopup(true);
  };


  const handleClosePopup = () => setShowPopup(false);

  // Thêm / Cập nhật
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    }

    if (!formData.subAddress.trim()) {
      errors.subAddress = "Vui lòng nhập địa chỉ cụ thể";
    }

    if (!provinceCode) {
      errors.province = "Vui lòng chọn Tỉnh / Thành phố";
    }

    if (!districtCode) {
      errors.district = "Vui lòng chọn Quận / Huyện";
    }

    if (!wardCode) {
      errors.ward = "Vui lòng chọn Phường / Xã";
    }

    // Nếu có lỗi → dừng submit
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear lỗi khi hợp lệ
    setFormErrors({});

    const token = localStorage.getItem("token");

    const provinceName = provinces.find(p => p.code == provinceCode)?.name || "";
    const districtName = districts.find(d => d.code == districtCode)?.name || "";
    const wardName = wards.find(w => w.code == wardCode)?.name || "";

    const fullAddress = `${wardName}, ${districtName}, ${provinceName}`;

    const payload = {
      contactId: formData.contactId,
      fullName: formData.fullName,
      phone: formData.phone,
      subAddress: formData.subAddress,
      address: fullAddress,
      isDefault: formData.isDefault,
    };


    fetch(
      formData.contactId
        ? `${API_URL}/${formData.contactId}`
        : API_URL,
      {
        method: formData.contactId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    )

      .then((res) => {
        if (!res.ok) throw new Error("Lỗi lưu địa chỉ");
        return res.json();
      })
      .then(() => {
        //  Reload danh sách
        return fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        setUserContacts(data);

        //  ĐÓNG POPUP
        setShowPopup(false);

        //  RESET FORM
        setFormData({
          contactId: null,
          fullName: "",
          phone: "",
          subAddress: "",
          address: "",
          isDefault: false,
        });

        setProvinceCode("");
        setDistrictCode("");
        setWardCode("");
        setDistricts([]);
        setWards([]);
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi lưu địa chỉ!");
      });
  };




  // Xóa địa chỉ
  const handleDelete = (id) => {
    setSelectedId(id);
    setModalType("delete");
    setModalMessage("Bạn có chắc chắn muốn xóa địa chỉ này?");
    setShowModal(true);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/${selectedId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Xóa thất bại");
        setUserContacts((prev) =>
          prev.filter((c) => c.contactId !== selectedId)
        );
        setModalType("success");
        setModalMessage("Xóa địa chỉ thành công!");
      })
      .catch(() => {
        setModalType("success");
        setModalMessage("Có lỗi xảy ra khi xóa!");
      });
  };



  // Cập nhật mặc định
  const handleSetDefault = (id) => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/default/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(() =>
        fetch(API_URL, {
          headers: { "Authorization": `Bearer ${token}` },
        })
      )
      .then((res) => res.json())
      .then((data) => setUserContacts(data));
  };


  return (
    <div className="min-h-screen bg-[#fff8f2] pt-6 pb-1">
      <div className="flex max-w-6xl mx-auto my-36 bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <Sidebar username="demoUser" avatar="/images/user.png" />

        {/* Main Content */}
        <main className="flex-1 p-10">
          {/* Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold  mb-1">Địa Chỉ</h1>
              <p className="text-gray-500 mb-6">
                Quản lý thông tin địa chỉ giao hàng của bạn
              </p>
            </div>
            <button
              onClick={() => handleOpenPopup()}
              className="flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded-lg shadow hover:bg-black hover:text-[#d4a373] transition"
            >
              <FaPlus /> Thêm địa chỉ
            </button>
          </div>

          {/* Address list */}
          <div className="space-y-6">
            {userContacts.map((contact) => (
              <div
                key={contact.contactId}
                className="flex bg-white rounded-xl shadow overflow-hidden"
              >
                {/* Edit button */}
                <div className="w-16 flex items-center justify-center bg-green-800 text-white">
                  <button
                    onClick={() => handleOpenPopup(contact)}
                    className="hover:text-[#d4a373]"
                  >
                    <FaEdit />
                  </button>
                </div>

                {/* Info + Actions */}
                <div className="flex-1 flex items-center justify-between p-6">
                  <div>
                    <div className="flex items-center gap-3 border-b pb-1">
                      <h4 className="font-semibold">{contact.fullName}</h4>
                      <span className="text-gray-500">{contact.phone}</span>
                    </div>
                    <div className="mt-2 text-gray-600">
                      <p>{contact.subAddress}</p>
                      <p>{contact.address}</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="text-right space-y-2">
                    <button
                      onClick={() => handleSetDefault(contact.contactId)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow text-sm font-semibold w-full justify-center ${contact.isDefault
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-500 text-white hover:bg-blue-700"
                        }`}
                    >
                      <FaThumbtack />
                      {contact.isDefault ? "Mặc định" : "Cài làm mặc định"}
                    </button>

                    {contact.isDefault ? (
                      <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-gray-400 text-white w-full justify-center cursor-not-allowed"
                      >
                        <FaTrash /> Xóa địa chỉ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(contact.contactId)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-red-600 text-white hover:bg-black hover:text-red-500 w-full justify-center"
                      >
                        <FaTrash /> Xóa địa chỉ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Popup */}
      {showPopup && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] p-6 relative">
              <h2 className="text-2xl font-bold mb-4">
                {formData.contactId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <input
                    type="text"
                    placeholder="Họ và Tên"
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none
    ${formErrors.fullName ? "border-2 border-red-500 bg-red-50" : "bg-gray-200"}
  `}
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      setFormErrors(prev => ({ ...prev, fullName: "" }));
                    }}
                  />
                  {formErrors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>
                  )}

                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Địa chỉ cụ thể"
                    className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                    value={formData.subAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, subAddress: e.target.value })
                    }
                    required
                  />
                </div>
                {/* Province */}
                <div className="relative">
                  <select
                    value={provinceCode}
                    onChange={(e) => {
                      handleProvinceChange(e);
                      setFormErrors(prev => ({ ...prev, province: "" }));
                    }}
                    className={`w-full px-4 py-2 rounded-lg appearance-none focus:outline-none
                    ${formErrors.province ? "border-2 border-red-500 bg-red-50" : "bg-gray-200"}
                  `}
                  >
                    {formErrors.province && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.province}</p>
                    )}

                    <option value="">Chọn Tỉnh / Thành phố</option>
                    {provinces.map(p => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                </div>

                {/* District */}
                <div className="relative">
                  <select
                    value={districtCode}
                    onChange={(e) => {
                      handleDistrictChange(e);
                      setFormErrors(prev => ({ ...prev, district: "" }));
                    }}
                    disabled={!provinceCode}
                    className={`w-full px-4 py-2 rounded-lg appearance-none focus:outline-none
                    ${formErrors.district ? "border-2 border-red-500 bg-red-50" : "bg-gray-200"}
                  `}
                  >
                    {formErrors.district && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.district}</p>
                    )}

                    <option value="">Chọn Quận / Huyện</option>
                    {districts.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                </div>

                {/* Ward */}
                <div className="relative">
                  <select
                    value={wardCode}
                    onChange={(e) => {
                      setWardCode(e.target.value);
                      setFormErrors(prev => ({ ...prev, ward: "" }));
                    }}
                    disabled={!districtCode}
                    className={`w-full px-4 py-2 rounded-lg appearance-none focus:outline-none
                  ${formErrors.ward ? "border-2 border-red-500 bg-red-50" : "bg-gray-200"}
                `}
                  >
                    {formErrors.ward && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.ward}</p>
                    )}

                    <option value="">Chọn Phường / Xã</option>
                    {wards.map(w => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
                </div>



                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    disabled={formData.contactId && userContacts.find(c => c.contactId === formData.contactId)?.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                  />
                  Cài làm mặc định
                </label>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="px-6 py-2 rounded-lg border bg-gray-100 hover:bg-black hover:text-white"
                  >
                    Trở Lại
                  </button>
                  <button
                    type="submit"
                    disabled={!provinceCode || !districtCode || !wardCode}
                    className="px-6 py-2 rounded-lg bg-green-800 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-black hover:text-[#d4a373]"
                  >
                    Hoàn Thành
                  </button>

                </div>
              </form>
            </div>
          </div>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClosePopup}
          ></div>
        </>
      )}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 text-center animate-fadeIn">
            <h2
              className={`text-xl font-bold mb-3 ${modalType === "delete" ? "text-red-600" : "text-green-700"
                }`}
            >
              {modalType === "delete" ? "Xác nhận" : "Thành công"}
            </h2>

            <p className="text-gray-600 mb-6">{modalMessage}</p>

            <div className="flex justify-center gap-4">
              {modalType === "delete" ? (
                <>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded-lg border hover:bg-black hover:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-black"
                  >
                    Xóa
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg bg-green-800 text-white hover:bg-black"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
