import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import EmojiPicker from 'emoji-picker-react'

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
  const inputRef = useRef(null)
  const [users, setUsers] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, selectedUser])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/users')
        if (response.data.success) {
          setUsers(response.data.users)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const currentUser = getStoredUser()
    if (!currentUser) {
      navigate('/')
      return
    }

    // init socket
    socketRef.current = io('http://localhost:8001')
    socketRef.current.on('connect', () => {
      socketRef.current.emit('register', currentUser._id)
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
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const currentUser = getStoredUser()
          if (!currentUser) return
          const response = await axios.get(`http://localhost:8001/api/messages?userId=${currentUser._id}&otherId=${selectedUser._id}`)
          if (response.data.success) {
            setMessages(response.data.messages.map(transformMsg))
          }
        } catch (error) {
          console.error('Error fetching messages:', error)
        }
      }
    }
    fetchMessages()
  }, [selectedUser])

  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }

  const filteredMessages = messages.filter((m) => {
    const currentUser = getStoredUser()
    return (
      (m.senderId === currentUser?._id && m.recipientId === selectedUser?._id) ||
      (m.senderId === selectedUser?._id && m.recipientId === currentUser?._id)
    )
  })

  const handleSend = async () => {
    if (!selectedUser || !input.trim()) return
    const currentUser = getStoredUser()
    try {
      const res = await axios.post('http://localhost:8001/api/messages', {
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
    navigate('/')
  }

  const otherUsers = users.filter(user => user._id !== getStoredUser()?._id)
  const currentUser = getStoredUser()

  return (
    <>
      <Sidebar users={otherUsers} onSelectUser={handleSelectUser} onLogout={onLogout} />

      <main className="ml-[250px] p-6 h-screen flex flex-col bg-gray-50">
        <header className="mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Chat</h2>
          <p className="text-sm text-gray-500">Click a username in the sidebar to start a conversation.</p>
        </header>

        <div className="flex-1 grid grid-cols-1">
          <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col h-[70vh] bg-white shadow">
            {selectedUser ? (
              <>
                <div className="px-4 py-3 border-b border-slate-100 bg-gray-100">
                  <strong className="text-lg text-gray-700">Chat with {selectedUser.name}</strong>
                </div>

                <div className="p-4 flex-1 overflow-auto" data-testid="message-list">
                  {filteredMessages.length === 0 && (
                    <div className="text-center text-sm text-gray-400 my-6">No messages yet — send the first one!</div>
                  )}

                  {filteredMessages.map((msg) => {
                    const isSender = msg.senderId === currentUser?._id
                    const len = msg.text?.length || 0

                    // Bubble colors
                    let bubbleBg = ''
                    if (isSender) {
                      if (len <= 20) bubbleBg = 'bg-blue-100 text-black'
                      else if (len <= 80) bubbleBg = 'bg-blue-200 text-black'
                      else bubbleBg = 'bg-blue-200 text-black'
                    } else {
                      if (len <= 20) bubbleBg = 'bg-gray-100 text-gray-800'
                      else if (len <= 80) bubbleBg = 'bg-amber-100 text-gray-800'
                      else bubbleBg = 'bg-amber-200 text-gray-800'
                    }

                    return (
                      <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div
                          className={`relative px-4 py-2 rounded-xl shadow-sm font-medium ${bubbleBg} max-w-[70%] break-words`}
                          style={{ width: "fit-content" }}
                        >
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

                <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2 items-center relative">
                  <button
                    type="button"
                    className="text-2xl leading-none px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => setShowEmojiPicker((s) => !s)}
                    aria-label="Toggle emoji picker"
                  >
                    😊
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-[56px] right-20 z-50">
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
                              try { el.setSelectionRange(caretPos, caretPos) } catch (e) {}
                            }, 0)
                          } else {
                            setInput((prev) => prev + emoji)
                          }
                          // Do not auto-close the emoji picker here; will close when textarea is focused
                        }}
                      />
                    </div>
                  )}

                  <textarea
                    ref={inputRef}
                    className="w-full rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder={`Message ${selectedUser.name}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={() => {
                      if (!inputRef.current) return
                      const el = inputRef.current
                      el.style.height = 'auto'
                      el.style.height = Math.max(el.scrollHeight, 48) + 'px'
                    }}
                    rows={1}
                  />

                  <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 flex-1 flex items-center justify-center text-gray-500 text-center">
                <div>Select a user from the sidebar to start a chat.</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
