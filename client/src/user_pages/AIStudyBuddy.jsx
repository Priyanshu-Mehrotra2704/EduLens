import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../user_components/Navbar'
import Sidebar from '../user_components/Sidebar.jsx'
import { API_ENDPOINTS } from '../config'
import { handleError, handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import { MessageCircle, Send, Bot, User, Sparkles } from 'lucide-react'

const AIStudyBuddy = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Study Buddy. I can help you understand concepts, solve problems, and study effectively. What would you like to learn today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.ML.AI_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: context || undefined
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      handleError(error.message || 'Failed to get response')
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <Navbar />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] p-3 rounded-full">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0B2C59]">AI Study Buddy</h1>
              <p className="text-gray-600">Get instant help with your studies</p>
            </div>
          </div>

          {/* Context Input */}
          <div className="bg-white p-4 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] mb-4 border">
            <label className="block text-sm font-medium mb-2">Subject/Topic Context (Optional)</label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Mathematics, Physics, History..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
            />
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] p-2 rounded-full">
                      <Bot className="text-white" size={20} />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-[#207dff] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="bg-gray-300 p-2 rounded-full">
                      <User className="text-gray-700" size={20} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] p-2 rounded-full">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your studies..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={20} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AIStudyBuddy

