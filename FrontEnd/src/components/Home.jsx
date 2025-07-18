import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Prompt from "./Prompt";
import { Menu } from "lucide-react";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const promptRef = useRef();

  const handleNewChat = () => {
    if (promptRef.current) {
      promptRef.current.resetChat();
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar (fixed) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#161616] transition-transform z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:fixed md:top-0 md:left-0 md:h-full md:z-58`}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main content (fills remaining space beside sidebar) */}
      <div className="flex-1 flex flex-col w-full h-screen md:ml-64 md:pl-6">
        {/* Header for mobile */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="text-xl font-bold">deepseek</div>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Message area full height */}
        <div className="flex-1 flex flex-col px-2 sm:px-6 overflow-hidden">
          <Prompt ref={promptRef} />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
