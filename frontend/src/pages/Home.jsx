import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import EmojiPicker from 'emoji-picker-react'
import axiosInstance from '../axiosInstance' // configured axios with baseURL & token

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const getStoredUser = () => {
  try {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  } catch {
    return null
  }
}

const transformMsg = (m) => ({
  id: m._id,
  senderId: (m.senderId && (m.senderId._id || m.senderId)) || m.senderId,
  recipientId: (m.recipientId && (m.recipientId._id || m.recipientId)) || m.recipientId,
  text: m.text,
  timestamp: m.timestamp
})

function Home() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  const navigate = useNavigate()

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, selectedUser])

  // Fetch users and initialize socket
  useEffect(() => {
    const currentUser = getStoredUser()
    if (!currentUser) {
      navigate('/')
      return
    }

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users')
        if (response.data.success) {
          setUsers(response.data.users)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    socketRef.current = io(BACKEND_URL, {
      auth: { token: localStorage.getItem('token') }
    })

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id)
    })

    socketRef.current.on('newMessage', (msg) => {
      const t = transformMsg(msg)
      setMessages((prev) => {
        if (selectedUser && ((t.senderId === selectedUser._id) || (t.recipientId === selectedUser._id))) {
          return [...prev, t]
        }
        return prev
      })
    })

    socketRef.current.on('messageSent', (msg) => {
      const t = transformMsg(msg)
      setMessages((prev) => [...prev, t])
    })

    fetchUsers()

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [selectedUser])

  // Fetch messages with selected user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return
      const currentUser = getStoredUser()
      if (!currentUser) return
      try {
        const response = await axiosInstance.get(`/api/messages?userId=${currentUser._id}&otherId=${selectedUser._id}`)
        if (response.data.success) {
          setMessages(response.data.messages.map(transformMsg))
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    fetchMessages()
  }, [selectedUser])

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setSidebarOpen(false) // close sidebar on mobile
  }

  const handleSend = async () => {
    if (!selectedUser || !input.trim()) return
    const currentUser = getStoredUser()
    try {
      const res = await axiosInstance.post('/api/messages', {
        senderId: currentUser._id,
        recipientId: selectedUser._id,
        text: input.trim()
      })
      if (res.data.success) {
        setInput('')
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const onLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  const otherUsers = users.filter(user => user._id !== getStoredUser()?._id)
  const currentUser = getStoredUser()
  const filteredMessages = messages.filter((m) =>
    (m.senderId === currentUser?._id && m.recipientId === selectedUser?._id) ||
    (m.senderId === selectedUser?._id && m.recipientId === currentUser?._id)
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed z-50 inset-0 bg-opacity-30 transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} />
      <Sidebar
        users={otherUsers}
        onSelectUser={handleSelectUser}
        onLogout={onLogout}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform lg:relative lg:translate-x-0 z-[60] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-gray-50 ml-0 lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">☰</button>
          <h2 className="text-lg font-bold">Chat App</h2>
          <div />
        </div>

        <div className="flex-1 p-4 flex flex-col">
          {selectedUser ? (
            <div className="flex-1 flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white shadow">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-gray-100 text-lg font-semibold">
                Chat with {selectedUser.name}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-auto" data-testid="message-list">
                {filteredMessages.length === 0 && (
                  <div className="text-center text-sm text-gray-400 my-6">No messages yet — send the first one!</div>
                )}
                {filteredMessages.map((msg) => {
                  const isSender = msg.senderId === currentUser?._id
                  const len = msg.text?.length || 0
                  let bubbleBg = isSender ? (len <= 20 ? 'bg-blue-100 text-black' : 'bg-blue-200 text-black')
                    : (len <= 20 ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-gray-800')
                  return (
                    <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
                      <div className={`relative px-4 py-2 rounded-xl shadow-sm font-medium ${bubbleBg} max-w-[70%] break-words`} style={{ width: 'fit-content' }}>
                        <div className="text-lg">{msg.text}</div>
                        <div className="text-[10px] mt-1 text-gray-400 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-2 py-2 lg:px-4 lg:py-3 border-t border-slate-100 bg-white flex gap-1 lg:gap-2 items-end relative">
                <button
                  type="button"
                  className="text-xl lg:text-2xl leading-none px-2 py-1 lg:px-3 lg:py-1 rounded hover:bg-gray-100"
                  onClick={() => setShowEmojiPicker((s) => !s)}
                  aria-label="Toggle emoji picker"
                >
                  😊
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-[56px] right-2 z-50">
                    <EmojiPicker
                      size={32}
                      onEmojiClick={(emojiData) => {
                        const emoji = emojiData?.emoji || emojiData?.unified || ''
                        if (!emoji) return
                        if (inputRef.current) {
                          const el = inputRef.current
                          const start = el.selectionStart
                          const end = el.selectionEnd
                          const newText = input.slice(0, start) + emoji + input.slice(end)
                          setInput(newText)
                          setTimeout(() => {
                            el.focus()
                            const caretPos = start + emoji.length
                            try { el.setSelectionRange(caretPos, caretPos) } catch (e) { }
                          }, 0)
                        } else {
                          setInput((prev) => prev + emoji)
                        }
                      }}
                    />
                  </div>
                )}

                <textarea
                  ref={inputRef}
                  className="flex-1 rounded-full border px-3 py-2 lg:px-4 lg:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none max-h-12 lg:max-h-none"
                  placeholder={`Message ${selectedUser.name}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={() => {
                    if (!inputRef.current) return
                    const el = inputRef.current
                    el.style.height = 'auto'
                    el.style.height = Math.min(Math.max(el.scrollHeight, 32), 96) + 'px' // Limit height on mobile
                  }}
                  rows={1}
                />

                <button
                  onClick={handleSend}
                  className="bg-blue-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full hover:bg-blue-700 transition text-sm lg:text-base"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-center">
              <div>Select a user from the sidebar to start a chat.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
