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


  const handleOpenPopup = (contact = null) => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        contactId: null,
        fullName: "",
        phone: "",
        subAddress: "",
        address: "",
        isDefault: false,
      });
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  // Thêm / Cập nhật
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = formData.contactId ? `${API_URL}/${formData.contactId}` : API_URL;
    const method = formData.contactId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(() => {
        return fetch(API_URL, {
          headers: { "Authorization": `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => setUserContacts(data));
      })
      .finally(() => setShowPopup(false));
  };


  // Xóa địa chỉ
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Xóa thất bại");
          }
          // Xóa khỏi state để UI update ngay
          setUserContacts((prev) => prev.filter((c) => c.contactId !== id));
        })
        .catch((err) => console.error(err));
    }
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
                    className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
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
                <div>
                  <input
                    type="text"
                    placeholder="Phường / Quận / Tỉnh"
                    className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
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
                    className="px-6 py-2 rounded-lg bg-green-800 text-white hover:bg-black hover:text-[#d4a373]"
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
    </div>
  );
}
