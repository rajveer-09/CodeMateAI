import React, { useState, useEffect } from "react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_BACKEND_URL;

function Sidebar({ onClose, onNewChat }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogout = async () => {
    setMessage({ type: "", text: "" });
    try {
      const { data } = await axios.get(`${API}/api/users/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setMessage({ type: "success", text: data.message || "Logout Successful!" });

      setAuthUser(null);
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      const msg = error?.response?.data?.errors || "Logout Failed!";
      setMessage({ type: "error", text: msg });
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-[#161616]">
      <div>
        <div className="flex border-b border-gray-600 p-2 justify-between items-center mb-4">
          <div className="text-2xl font-bold text-gray-200">Deepseek</div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 md:hidden" />
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-2 p-2 rounded-md text-center text-sm transition ${
              message.type === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          <button
            onClick={onNewChat}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4"
          >
            + New Chat
          </button>
          <div className="text-gray-500 text-sm mt-20 text-center">
            No chat history yet
          </div>
        </div>
      </div>

      <div className="p-1 border-t border-gray-600">
        <div className="flex items-center gap-2 cursor-pointer my-3">
          <img
            src="https://i.pravatar.cc/32"
            alt="profile"
            className="rounded-full w-8 h-8"
          />
          <span className="text-gray-300 font-bold">
            {user ? user.firstName : "My Profile"}
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <LogOut />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
