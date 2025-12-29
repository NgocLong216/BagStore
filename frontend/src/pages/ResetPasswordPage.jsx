import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      if (!res.ok) throw new Error();

      setMsg("Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setMsg("Link không hợp lệ hoặc đã hết hạn");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f2]">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-2xl shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Đặt lại mật khẩu
        </h1>

        {msg && <p className="text-center mb-3">{msg}</p>}

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-200"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-700 text-white rounded-lg hover:bg-black"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
}
