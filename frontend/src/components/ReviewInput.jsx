import { useState } from "react";
import { FaStar, FaRegStar, FaSmile } from "react-icons/fa";

export default function ReviewInput({ user, onSubmit }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        if (!comment.trim()) return;

        onSubmit({
            rating,
            comment
        });

        setComment("");
        setRating(5);
    };

    return (
        <div className="mt-6">
            {/* ⭐ Chọn số sao */}
            <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                    >
                        {(hoverRating || rating) >= star ? (
                            <FaStar className="text-yellow-400 text-xl" />
                        ) : (
                            <FaRegStar className="text-gray-300 text-xl" />
                        )}
                    </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                    {rating} / 5
                </span>
            </div>

            {/* 💬 Khung nhập bình luận */}
            <div className="flex gap-3">
                {/* Avatar */}
                <img
                    src={
                        user?.avatarUrl
                            ? `http://localhost:8080${user.avatarUrl}`
                            : "https://hanoidep.vn/wp-content/uploads/2025/11/avatar-trang-4.webp"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                />

                {/* Input */}
                <div className="flex-1">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        rows={1}
                        className="w-full border-b border-gray-400 focus:outline-none resize-none text-sm"
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                    />

                    {/* Action */}
                    <div className="flex items-center justify-between mt-2">
                        <FaSmile className="text-gray-500 cursor-pointer" />

                        <div className="flex gap-2">
                            <button
                                onClick={() => setComment("")}
                                className="px-4 py-1 rounded-full text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={!comment.trim()}
                                className={`px-4 py-1 rounded-full text-sm font-semibold text-white
                                    ${comment.trim()
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                Bình luận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
