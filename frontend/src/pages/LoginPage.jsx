import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";


export default function LoginPage({ setUser }) {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


  const API_URL = "http://localhost:8080/api/auth";

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: tokenResponse.access_token,
          }),
        });

        if (!res.ok) throw new Error("Đăng nhập Google thất bại");

        const data = await res.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    },
    onError: () => {
      setError("Đăng nhập Google thất bại");
    },
  });


  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) throw new Error("Sai tên đăng nhập hoặc mật khẩu");
      const data = await res.json();

      // Lưu token
      // LoginPage.jsx - sau khi fetch login thành công
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // backend trả về user info
      setUser(data.user);
      setSuccess("Đăng nhập thành công!");
      console.log("Login success:", data);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Đăng ký thất bại");
      }
      const data = await res.json();
      setSuccess("Đăng ký thành công! Hãy đăng nhập.");
      console.log("Register success:", data);
      setIsActive(false); // chuyển về form login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-[#fff8f2] mt-12">
      <section
        className={`relative w-[850px] h-[550px] bg-gray-100 rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ${isActive ? "active" : ""
          }`}
      >
        {/* Login Form */}
        <div
          className={`absolute right-0 w-1/2 h-full bg-gray-100 flex items-center text-gray-800 text-center p-10 z-0 transition-all duration-700 ${isActive ? "translate-x-[-100%]" : ""
            }`}
        >
          <form className="w-full" onSubmit={handleLogin}>
            <h1 className="text-3xl font-bold mb-6">Đăng Nhập</h1>

            {error && <p className="text-red-500 mb-3">{error}</p>}
            {success && <p className="text-green-600 mb-3">{success}</p>}

            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
                className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none"
              />
              <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none"
              />
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            </div>
            <div className="text-left mb-4">
              <a href="#" className="text-sm text-gray-700 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-green-700 rounded-lg shadow text-white font-semibold hover:bg-green-800"
            >
              Đăng Nhập
            </button>
            <p className="mt-4 text-sm">hoặc đăng nhập bằng</p>
            <div className="flex justify-center mt-3 space-x-3">
              <a href="#" className="p-3 border-2 border-gray-400 rounded-lg text-xl text-gray-700" > <FaFacebook /> </a>
              <a href="#"
                className="p-3 border-2 border-gray-400 rounded-lg text-xl text-gray-700"
                onClick={(e) => {
                  e.preventDefault();
                  loginWithGoogle();
                }}
              > <FaGoogle />
              </a>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div
          className={`absolute right-0 w-1/2 h-full bg-gray-100 flex items-center text-gray-800 text-center p-10 z-0 transition-all duration-700 ${isActive ? "translate-x-[-100%] visible" : "invisible"
            }`}
        >
          <form className="w-full" onSubmit={handleRegister}>
            <h1 className="text-3xl font-bold mb-6">Đăng Ký</h1>

            {error && <p className="text-red-500 mb-3">{error}</p>}
            {success && <p className="text-green-600 mb-3">{success}</p>}

            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
                className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none"
              />
              <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            </div>
            <div className="relative mb-6">
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
                className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none"
              />
              <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            </div>
            <div className="relative mb-6">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                className="w-full px-5 py-3 bg-gray-200 rounded-lg text-gray-800 text-base font-medium focus:outline-none"
              />
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-green-700 rounded-lg shadow text-white font-semibold hover:bg-green-800"
            >
              Đăng Ký
            </button>
            <p className="mt-4 text-sm">hoặc đăng ký bằng</p> <div className="flex justify-center mt-3 space-x-3"> <a href="#" className="p-3 border-2 border-gray-400 rounded-lg text-xl text-gray-700" > <FaFacebook /> </a> <a href="#" className="p-3 border-2 border-gray-400 rounded-lg text-xl text-gray-700" > <FaGoogle /> </a> </div>
          </form>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-green-700 text-white flex flex-col items-center justify-center rounded-r-[150px] transition-all duration-1000 ease-in-out ${isActive ? "translate-x-full rounded-l-[150px] rounded-r-none" : ""
            }`}
        >
          {isActive ? (
            <>
              <h2 className="text-3xl font-bold mb-2">Mừng trở lại!</h2>
              <p className="mb-4">Bạn đã có tài khoản?</p>
              <button
                className="border px-6 py-2 rounded-lg hover:bg-white hover:text-green-700 transition"
                onClick={() => setIsActive(false)}
              >
                Đăng Nhập
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-2">Chào mừng!</h2>
              <p className="mb-4">Bạn chưa có tài khoản?</p>
              <button
                className="border px-6 py-2 rounded-lg hover:bg-white hover:text-green-700 transition "
                onClick={() => setIsActive(true)}
              >
                Đăng Ký
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
