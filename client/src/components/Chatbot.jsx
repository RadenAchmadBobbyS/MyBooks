import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeminiResponse } from "../store/chatSlice";
import { motion } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";

const ChatBubble = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat || {});
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      dispatch(fetchGeminiResponse(prompt));
      setPrompt("");
    }
  };

  return (
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-600 transition">
                {isOpen ? <X size={1} /> : <MessageCircle size={24} />}
                </button>

              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9, y: isOpen ? 0 : 10 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white border border-gray-300 shadow-xl w-80 h-[400px] flex flex-col rounded-lg overflow-hidden ${
                  isOpen ? "block" : "hidden"}`}>

            <div className="bg-gray-700 text-white p-3 font-semibold flex justify-between">
                  <span>Gemini Chatbot</span>
                  <button onClick={() => setIsOpen(false)} className="text-white"><X size={18} /></button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-2 custom-scrollbar">
                  {messages.map((msg, index) => (
                  <div key={index} className="flex flex-col space-y-1">
              
                  <div className="self-end bg-gray-300 text-black p-3 rounded-lg max-w-[75%] shadow">
                  {msg.user}
                  </div>
              
                  <div className="self-start bg-gray-300 text-black p-3 rounded-lg max-w-[75%] shadow">
                  {typeof msg.bot === "string"
                  ? msg.bot.split("\n").map((line, idx) => <p key={idx}>{line}</p>)
                  : JSON.stringify(msg.bot, null, 2)}
                  </div>
                  </div>
                  ))}
                  {loading && <p className="text-center text-gray-500">sedang mengetik...</p>}
            </div>

            <form onSubmit={handleSubmit} className="flex p-2 border-t bg-white">
                  <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="flex-1 p-2 border rounded-lg text-black outline-none" placeholder="Tulis pesan..."/>
                  <button type="submit" className="ml-2 bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600">
                  <Send size={18} />
                  </button>
            </form>
                </motion.div>
            </div>
  );
};

export default ChatBubble;
