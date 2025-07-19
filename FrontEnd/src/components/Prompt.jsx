import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { Paperclip, ArrowUp, Globe, Bot } from "lucide-react";
import logo from "../../public/logo.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
const API = import.meta.env.VITE_BACKEND_URL;

const Prompt = forwardRef((props, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const promptEndRef = useRef();

  const resetChat = () => {
    setPromptHistory([]);
    setInputValue("");
  };

  useImperativeHandle(ref, () => ({
    resetChat,
  }));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const storedPrompt = localStorage.getItem(`promptHistory_${user._id}`);
      if (storedPrompt) {
        setPromptHistory(JSON.parse(storedPrompt));
      }
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(
        `promptHistory_${user._id}`,
        JSON.stringify(promptHistory)
      );
    }
  }, [promptHistory]);

  useEffect(() => {
    promptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promptHistory, loading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setInputValue("");
    setPromptHistory((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API}/api/deepseekai/prompt`,
        { content: trimmed },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setPromptHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.assistantPrompt.content },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setPromptHistory((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Something went wrong with the AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col items-start justify-between flex-1 w-full h-full px-4 pb-4 md:pb-8 md:mx-0">
      {/* Centered Greeting */}
      {promptHistory.length === 0 && (
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <img src={logo} alt="DeepSeek Logo" className="h-6 md:h-8" />
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                Hi, I'm CodeMate AI.
              </h1>
            </div>
            <p className="text-gray-400 text-base md:text-sm">
              💬 How can I help you today?
            </p>
          </div>
        </div>
      )}

      {/* Header when chat is active */}
      {promptHistory.length > 0 && (
        <div className="w-fit bg-[#232323] text-white px-6 py-3 rounded-xl mb-3 shadow-md sticky top-2 z-10 mx-auto">
          📝 New Conversation
        </div>
      )}

      {/* Chat Box */}
      <div className="w-full flex-1 overflow-y-auto mt-4 mb-4 px-4 md:px-0 custom-scrollbar">
        <div className="max-w-3xl w-full mx-auto space-y-4">
          {promptHistory.map((msg, index) => (
            <div
              key={index}
              className={`w-full flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="w-[90%] bg-[#1a1a1a] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={codeTheme}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg mt-2"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className="bg-gray-800 px-1 py-0.5 rounded"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="w-[45%] bg-[#333] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap self-start">
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start w-full">
              <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-xl text-sm animate-pulse">
                🤖 Loading...
              </div>
            </div>
          )}

          <div ref={promptEndRef} />
        </div>
      </div>

      {/* Typing Box */}
      <div className="w-full relative mt-auto">
        <div className="bg-[#1a1a1a] rounded-[2rem] px-4 md:px-6 py-6 md:py-8 shadow-md max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="💬 Message CodeMate AI"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent w-full text-white placeholder-gray-400 text-base md:text-lg outline-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Bot className="w-4 h-4" />
                DeepThink (R1)
              </button>
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Globe className="w-4 h-4" />
                Search
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button className="text-gray-400 hover:text-white transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                className="bg-gray-500 hover:bg-blue-600 p-2 rounded-full text-white transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Prompt;
