import { useEffect, useState } from "react";
import { BAG_CATEGORIES } from "../constants/bagCategories";
import { MdErrorOutline, MdDescription } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { SlPicture } from "react-icons/sl";
import { FaBoxOpen, FaTags, FaWarehouse, FaMoneyBill } from "react-icons/fa";


export default function ProductModal({
    open,
    mode, // "create" | "edit"
    initialData,
    onClose,
    onSubmit,
    loading
}) {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        detail: "",
        category: ""
    });

    const [errors, setErrors] = useState({});
    const [imageFiles, setImageFiles] = useState([]);

    const [existingImages, setExistingImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);

    const API_BASE_URL = "http://localhost:8080";

    const resolveImageUrl = (img) => {
        if (!img) return "";

        // đã là link đầy đủ
        if (img.startsWith("http")) return img;

        // là /upload hoặc đường dẫn tương đối
        return `${API_BASE_URL}${img}`;
    };

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setProduct({
                name: initialData.name || "",
                price: initialData.price || "",
                stock: initialData.stock || "",
                description: initialData.description || "",
                detail: initialData.detail || "",
                category: initialData.category || ""
            });
        }

        if (mode === "create") {
            setProduct({
                name: "",
                price: "",
                stock: "",
                description: "",
                detail: "",
                category: ""
            });
        }
    }, [mode, initialData, open]);

    useEffect(() => {
        if (mode === "edit" && initialData?.images) {
            setExistingImages(initialData.images);
        } else {
            setExistingImages([]);
        }
        setDeletedImageIds([]);
    }, [mode, initialData, open]);


    useEffect(() => {
        setImageFiles([]);
    }, [open, mode]);

    useEffect(() => {
        console.log("existingImages", existingImages);
    }, [existingImages]);


    if (!open) return null;

    const validate = () => {
        const e = {};
        if (!product.name) e.name = "Tên không được để trống";
        if (!product.price || product.price <= 0) e.price = "Giá không hợp lệ";
        if (!product.stock || product.stock < 0) e.stock = "Tồn kho không hợp lệ";
        if (!product.category) e.category = "Vui lòng chọn danh mục";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSubmit(
            {
                ...product,
                deletedImageIds
            },
            imageFiles
        );
    };


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[480px] max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-xl font-bold mb-4">
                    {mode === "create" ? "Tạo sản phẩm" : "Chỉnh sửa sản phẩm"}
                </h2>

                <div className="space-y-4">

                    <div>
                        <div className="relative">
                            <FaBoxOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                placeholder="Tên sản phẩm"
                                value={product.name}
                                onChange={e => setProduct({ ...product, name: e.target.value })}
                                className={`w-full pl-10 pr-4 py-3 rounded outline-none
                                ${errors.name ? "bg-red-50 border border-red-500" : "bg-gray-200"}
                            `}
                            />
                        </div>

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <MdErrorOutline />
                                {errors.name}
                            </p>
                        )}
                    </div>



                    <div>
                        <div className="relative">
                            <FaMoneyBill className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="number"
                                placeholder="Giá (VNĐ)"
                                value={product.price}
                                onChange={e => setProduct({ ...product, price: e.target.value })}
                                className={`w-full pl-10 pr-4 py-3 rounded outline-none
                                ${errors.price ? "bg-red-50 border border-red-500" : "bg-gray-200"}
                            `}
                            />
                        </div>

                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <MdErrorOutline />
                                {errors.price}
                            </p>
                        )}
                    </div>



                    <div>
                        <div className="relative">
                            <FaWarehouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="number"
                                placeholder="Tồn kho"
                                value={product.stock}
                                onChange={e => setProduct({ ...product, stock: e.target.value })}
                                className={`w-full pl-10 pr-4 py-3 rounded outline-none
                                ${errors.stock ? "bg-red-50 border border-red-500" : "bg-gray-200"}
                            `}
                            />
                        </div>

                        {errors.stock && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <MdErrorOutline />
                                {errors.stock}
                            </p>
                        )}
                    </div>



                    <div className="relative">
                        <MdDescription className="absolute left-3 top-3 text-gray-500" />
                        <textarea
                            rows={2}
                            placeholder="Mô tả ngắn"
                            value={product.description}
                            onChange={e => setProduct({ ...product, description: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-200 rounded resize-none outline-none"
                        />
                    </div>


                    <div className="relative">
                        <MdDescription className="absolute left-3 top-3 text-gray-500" />
                        <textarea
                            rows={5}
                            placeholder="Mô tả chi tiết"
                            value={product.detail}
                            onChange={e => setProduct({ ...product, detail: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-200 rounded resize-none outline-none"
                        />
                    </div>

                    <div>
                        <div className="relative">
                            <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <select
                                value={product.category}
                                onChange={e => setProduct({ ...product, category: e.target.value })}
                                className={`w-full pl-10 pr-4 py-3 rounded outline-none
                                ${errors.category ? "bg-red-50 border border-red-500" : "bg-gray-200"}
                            `}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {BAG_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <MdErrorOutline />
                                {errors.category}
                            </p>
                        )}
                    </div>



                    {/* CHỌN ẢNH MỚI */}
                    <label className="
                        cursor-pointer
                        px-4 py-2
                        bg-white text-green-900
                        rounded
                        border border-green-900
                        inline-flex items-center gap-2
                        hover:bg-green-50
                        ">
                        <span>Chọn ảnh</span>
                        <SlPicture size={18} />
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={e => setImageFiles(Array.from(e.target.files))}
                        />
                    </label>


                    {/* ẢNH CŨ (CHỈ HIỆN KHI EDIT) */}
                    {mode === "edit" && existingImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {existingImages.map(img => (
                                <div key={img.imageId} className="relative group">
                                    <img
                                        src={resolveImageUrl(img.imageUrl)}
                                        className="w-20 h-20 object-cover rounded"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setExistingImages(prev =>
                                                prev.filter(i => i.imageId !== img.imageId)
                                            );
                                            setDeletedImageIds(prev => [...prev, img.imageId]);
                                        }}
                                        className="absolute -top-3 -right-0 bg-black/70 text-white
                                        w-6 h-6 rounded-full flex items-center justify-center
                                        opacity-0 group-hover:opacity-100 transition
                                        hover:bg-red-600"
                                    >
                                        <IoClose size={16} />
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* PREVIEW ẢNH MỚI */}
                    {imageFiles.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {imageFiles.map((file, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="w-20 h-20 object-cover rounded"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFiles(prev => prev.filter((_, i) => i !== idx));
                                        }}
                                        className="absolute -top-2 -right-2 bg-black/70 text-white
                                        w-6 h-6 rounded-full flex items-center justify-center
                                        opacity-0 group-hover:opacity-100 transition
                                        hover:bg-red-600"
                                    >
                                        <IoClose size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}




                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                        Hủy
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
                    >
                        {loading
                            ? "Đang xử lý..."
                            : mode === "create"
                                ? "Tạo"
                                : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}
