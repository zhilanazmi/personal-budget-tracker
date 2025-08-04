import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Bot } from 'lucide-react';
import { getChatResponse } from '../lib/gemini';
import { ChatMessage } from '../types';

interface ChatBotProps {
  position?: 'floating' | 'sidebar';
  onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ position = 'floating', onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Coba ambil riwayat chat dari localStorage
    try {
      const savedHistory = localStorage.getItem('finflow_chat_history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Konversi string timestamp ke Date object
        return parsedHistory.map((msg: { id?: string; timestamp: string; text: string; sender: 'user' | 'bot' }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          id: msg.id || Date.now().toString() + Math.random().toString(36).substring(2, 9)
        }));
      }
    } catch (error) {
      console.log('Tidak dapat mengakses localStorage:', error);
    }
    
    // Default message jika tidak ada riwayat
    return [{
      id: '1',
      text: 'Halo! Saya adalah FinFlow Assistant, asisten keuangan pribadi Anda. Ada yang bisa saya bantu terkait aplikasi FinFlow atau pengelolaan keuangan Anda?',
      sender: 'bot',
      timestamp: new Date(),
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen || position === 'sidebar') {
      scrollToBottom();
    }
  }, [messages, isOpen, position]);

  // Efek untuk menangani perubahan riwayat chat di localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'finflow_chat_history' && e.newValue) {
        try {
          const newHistory = JSON.parse(e.newValue);
          setMessages(newHistory.map((msg: { id?: string; timestamp: string; text: string; sender: 'user' | 'bot' }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } catch (error) {
          console.error('Error parsing chat history:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update local state
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Update local state
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // Simpan ke localStorage (akan memicu event storage untuk komponen lain)
      try {
        const savedHistory = localStorage.getItem('finflow_chat_history');
        const chatHistory = savedHistory ? JSON.parse(savedHistory) : [];
        const updatedHistory = [...chatHistory.slice(-18), userMessage, botMessage];
        localStorage.setItem('finflow_chat_history', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (onClose && !isOpen) {
      onClose();
    }
  };

  const resetChat = () => {
    const defaultMessage = {
      id: Date.now().toString(),
      text: 'Halo! Saya adalah FinFlow Assistant, asisten keuangan pribadi Anda. Ada yang bisa saya bantu terkait aplikasi FinFlow atau pengelolaan keuangan Anda?',
      sender: 'bot' as const,
      timestamp: new Date(),
    };
    
    setMessages([defaultMessage]);
    localStorage.setItem('finflow_chat_history', JSON.stringify([defaultMessage]));
  };

  // Suggestion chips untuk pertanyaan umum
  const suggestionChips = [
    { text: "Cara tambah transaksi?", query: "Bagaimana cara menambahkan transaksi baru?" },
    { text: "Melihat laporan keuangan", query: "Bagaimana cara melihat laporan keuangan?" },
    { text: "Fitur Analitik Cerdas", query: "Apa itu fitur Analitik Cerdas?" }
  ];

  // Suggestion chips untuk pertanyaan tentang data keuangan
  const financeChips = [
    { text: "Berapa saldo saya?", query: "Berapa total saldo saya saat ini?" },
    { text: "Rangkum pengeluaran bulan ini", query: "Rangkum pengeluaran saya bulan ini" },
    { text: "Kategori pengeluaran terbesar", query: "Apa kategori pengeluaran terbesar saya?" },
    { text: "Insight keuangan saya", query: "Berikan insight keuangan saya" },
    { text: "Prediksi pengeluaran", query: "Prediksi pengeluaran bulan depan" }
  ];

  const handleSuggestionClick = (query: string) => {
    setInputMessage(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Render chat window berdasarkan position
  const renderChatWindow = () => {
    return (
      <div className={`${position === 'floating' ? 'fixed bottom-20 sm:absolute sm:bottom-16 right-0 sm:right-0 animate-slide-up' : ''} 
        w-[calc(100vw-32px)] sm:w-80 md:w-96 max-w-md
        h-[60vh] sm:h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col border border-gray-200 dark:border-slate-700 overflow-hidden`}>
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="relative">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base">FinFlow Assistant</h3>
              <p className="text-[10px] sm:text-xs text-blue-100">Asisten keuangan cerdas Anda</p>
            </div>
          </div>
          {position === 'floating' && (
            <button onClick={toggleChat} className="text-white hover:bg-white/20 p-1 rounded-full">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-50 dark:bg-slate-900">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="hidden sm:flex flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center mr-2 mt-1">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  <p className="text-[10px] sm:text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="hidden sm:flex flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 items-center justify-center ml-2 mt-1">
                    <span className="text-white text-[10px] sm:text-xs font-bold">U</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada pesan. Mulai chat sekarang!</p>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="hidden sm:flex flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center mr-2 mt-1">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 p-2 sm:p-3 rounded-2xl rounded-tl-none max-w-[85%] sm:max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Sedang mengetik...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-3 sm:px-4 py-2 border-t border-gray-200 dark:border-slate-700">
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">Pertanyaan yang sering ditanyakan:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
              {suggestionChips.map((chip, index) => (
                <button 
                  key={index}
                  onClick={() => handleSuggestionClick(chip.query)}
                  className="text-[10px] sm:text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
                >
                  {chip.text}
                </button>
              ))}
            </div>
            
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1 sm:mb-2 mt-2 sm:mt-3">Pertanyaan tentang data keuangan:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {financeChips.map((chip, index) => (
                <button 
                  key={index}
                  onClick={() => handleSuggestionClick(chip.query)}
                  className="text-[10px] sm:text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors"
                >
                  {chip.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="p-2 sm:p-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center space-x-2">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 p-1.5 sm:p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-1.5 sm:p-2 rounded-full ${
                !inputMessage.trim() || isLoading
                  ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-slate-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="mt-1 sm:mt-2 flex justify-between items-center">
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Powered by Gemini AI</p>
            <button 
              onClick={resetChat}
              className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
            >
              Reset Chat
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render berdasarkan position
  if (position === 'sidebar') {
    return renderChatWindow();
  }

  return (
    <div className="fixed bottom-6 right-24 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
        }`}
        aria-label="Chat dengan Asisten AI"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && renderChatWindow()}
    </div>
  );
};

export default ChatBot; 