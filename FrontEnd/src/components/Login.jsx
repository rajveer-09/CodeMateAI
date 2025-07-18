import { Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await axios.post(
        "https://deepseek-g0tn.onrender.com/api/users/login",
        formData,
        { withCredentials: true }
      );
      setMessage({ type: "success", text: data.message || "Login Successful!" });
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setAuthUser(data.token);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const msg = error?.response?.data?.errors || "Login Failed!";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        <h1 className="text-center text-xl font-semibold mb-4">Login</h1>

        {message.text && (
          <div
            className={`mb-4 p-2 rounded-md text-center text-sm transition ${
              message.type === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mb-4">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4 relative">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <Eye size={18} />
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-2 mb-4">
          By logging in, you agree to DeepSeek's{" "}
          <a className="underline" href="">
            Terms of Use
          </a>{" "}
          and{" "}
          <a className="underline" href="">
            Privacy Policy
          </a>
          .
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <span className="text-gray-400">Haven't account?</span>
          <Link className="text-[#7a6ff6] hover:underline" to="/signup">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
