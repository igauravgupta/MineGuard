import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const ChatbotPage = () => {
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Load chat history or create new chat on mount
  useEffect(() => {
    if (chatHistory.length === 0) {
      createNewChat();
    } else {
      // Load the most recent chat by default
      loadChat(chatHistory[0].id);
    }
  }, []);

  // Save messages and scroll to bottom
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      localStorage.setItem(`chatMessages_${currentChatId}`, JSON.stringify(messages));
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentChatId]);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setShowHistory(false);
    saveChatHistory([newChat, ...chatHistory]);
  };

  const loadChat = (chatId) => {
    const savedMessages = localStorage.getItem(`chatMessages_${chatId}`);
    setCurrentChatId(chatId);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    setShowHistory(false);
  };

  const deleteChat = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      // Remove from chat history
      const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
      
      // Remove chat messages
      localStorage.removeItem(`chatMessages_${chatId}`);
      
      // If deleting current chat, load the most recent one or create new
      if (chatId === currentChatId) {
        if (updatedHistory.length > 0) {
          loadChat(updatedHistory[0].id);
        } else {
          createNewChat();
        }
      }
    }
    setChatToDelete(null);
  };

  const saveChatHistory = (history) => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {

      const response = await axios.post(
        'https://ptzzhq85-8000.inc1.devtunnels.ms/search',
        {
          query: input
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);
      let aiResponse = "I didn't understand that";
      if (Array.isArray(response.data?.results) && response.data.results.length > 0) {
        // Find the result with the highest score
        const best = response.data.results.reduce((max, curr) => curr.score > max.score ? curr : max, response.data.results[0]);
        aiResponse = best.section || aiResponse;
      } else if (response.data?.result || response.data?.answer) {
        aiResponse = response.data.result || response.data.answer;
      }

      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);

      // Update chat title with first message if it's the first exchange
      if (messages.length === 0) {
        const newTitle = input.length > 30 ? `${input.substring(0, 30)}...` : input;
        const updatedHistory = chatHistory.map(chat => 
          chat.id === currentChatId ? { ...chat, title: newTitle } : chat
        );
        setChatHistory(updatedHistory);
        saveChatHistory(updatedHistory);
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Chat History Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${showHistory ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white shadow-lg z-10 transition-transform duration-300 md:relative md:translate-x-0`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button 
            onClick={createNewChat}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            New Chat
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {chatHistory.map(chat => (
            <div 
              key={chat.id}
              className={`group relative p-4 border-b hover:bg-gray-100 ${currentChatId === chat.id ? 'bg-blue-50' : ''}`}
            >
              <div 
                onClick={() => loadChat(chat.id)}
                className="cursor-pointer"
              >
                <div className="font-medium truncate">{chat.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(chat.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setChatToDelete(chat.id)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              {chatToDelete === chat.id && (
                <div className="absolute right-0 top-0 bg-white shadow-lg rounded-md p-2 z-20">
                  <p className="text-sm mb-2">Delete this chat?</p>
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setChatToDelete(null)}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => deleteChat(chat.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Menu Button */}
        <div className="bg-blue-600 p-4 flex items-center">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-white mr-4 p-2 rounded-full hover:bg-blue-700 transition-colors md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">AI Chat Assistant</h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>How can I help you today?</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser 
                      ? "bg-blue-500 text-white rounded-br-none" 
                      : "bg-gray-200 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;