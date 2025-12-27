import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import { FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);
    // confirmDelete = contact object | null


    // ================= FETCH DATA =================
    const fetchContacts = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/admin/contacts", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();
            setContacts(data);
        } catch (err) {
            console.error("Lỗi load contacts", err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // ================= ACTIONS =================
    const markAsReplied = async (id) => {
        await fetch(`http://localhost:8080/api/admin/contacts/${id}/reply`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        fetchContacts();
    };

    const handleDeleteContact = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await fetch(`http://localhost:8080/api/admin/contacts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Xóa khỏi UI
            setContacts(prev => prev.filter(c => c.id !== id));
            setFilteredContacts(prev => prev.filter(c => c.id !== id));
            setSelectedContact(null);

        } finally {
            setConfirmDelete(null);
        }
    };


    // ================= FILTER =================
    const filteredContacts = contacts.filter(
        (c) =>
            c.name.toLowerCase().includes(keyword.toLowerCase()) ||
            c.email.toLowerCase().includes(keyword.toLowerCase())
    );

    useEffect(() => {
        document.body.style.overflow = confirmDelete ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [confirmDelete]);


    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />

            <div className="flex-1">
                <AdminHeader title="Quản Lý Liên Hệ" />

                <div className="p-6 flex gap-6">
                    {/* ================= LEFT ================= */}
                    <div className="flex-1 bg-white rounded-xl shadow">
                        {/* Search */}
                        <div className="p-4 border-b border-gray-300 flex items-center gap-3">
                            <FaSearch className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc email..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>

                        {/* Table */}
                        <table className="w-full text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4">Tên</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Ngày gửi</th>
                                    <th className="p-4">Trạng thái</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredContacts.map((c) => (
                                    <tr
                                        key={c.id}
                                        onClick={() => setSelectedContact(c)}
                                        className={`cursor-pointer border-t border-gray-300
                      ${selectedContact?.id === c.id
                                                ? "bg-green-600 text-white"
                                                : "hover:bg-gray-50"
                                            }
                    `}
                                    >
                                        <td className="p-4 font-medium">{c.name}</td>
                                        <td className="p-4">{c.email}</td>
                                        <td className="p-4">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {c.replied ? (
                                                <span className="text-green-800 font-semibold ">
                                                    Đã xử lý
                                                </span>
                                            ) : (
                                                <span className="text-red-800 font-semibold">
                                                    Chưa xử lý
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {filteredContacts.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-6 text-center text-gray-500">
                                            Không có liên hệ nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= RIGHT ================= */}
                    {selectedContact && (
                        <aside className="w-96 bg-white rounded-xl shadow p-6 sticky top-24 h-fit">
                            <h2 className="text-xl font-bold mb-1">
                                {selectedContact.name}
                            </h2>

                            <p className="text-gray-500 mb-2">
                                {selectedContact.email}
                            </p>

                            <p className="text-gray-500 mb-4">
                                {selectedContact.phone || "Không có số điện thoại"}
                            </p>

                            <div className="border-t border-gray-300 pt-4">
                                <p className="text-sm text-gray-500 mb-2">
                                    Nội dung thắc mắc
                                </p>

                                <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-line">
                                    {selectedContact.message}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                {!selectedContact.replied && (
                                    <button
                                        onClick={() => markAsReplied(selectedContact.id)}
                                        className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
                                    >
                                        Đã xử lý
                                    </button>
                                )}

                                <button
                                    onClick={() => setConfirmDelete(selectedContact)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <FaTrash />
                                </button>

                            </div>
                        </aside>
                    )}
                </div>
            </div>
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[380px] p-6 shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-3 text-red-600">
                            Xóa thắc mắc
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa thắc mắc của
                            <b> {confirmDelete.fullName}</b>?
                            <br />
                            Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={() => handleDeleteContact(confirmDelete.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
