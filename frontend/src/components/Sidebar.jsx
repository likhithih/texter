import React from 'react'

// Sidebar shows total users, clickable user names, and a logout button
export default function Sidebar({ users = [], onSelectUser, onLogout, selectedUser }) {

  const handleLogout = () => {
    // Clear stored user and token on logout
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    if (onLogout) onLogout()
  }

  return (
    <nav className="bg-white shadow-md border-r border-gray-200 h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4 overflow-auto flex flex-col">
      <div className="mb-4">
        <h6 className="text-blue-600 text-sm font-semibold px-4">Users</h6>
        <div className="mt-2 px-4 overflow-y-auto max-h-[70vh]">
          <div className="text-slate-600 text-sm mb-2">
            Total Users: <span className="font-medium">{users.length}</span>
          </div>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user._id}>
                <button
                  type="button"
                  onClick={() => onSelectUser && onSelectUser(user)}
                  className={`w-full text-left text-[15px] block px-3 py-2 rounded font-medium transition-all ${
                    selectedUser?._id === user._id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-gray-100'
                  }`}
                >
                  {user.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto px-4">
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-600 font-semibold text-[15px] block hover:text-white hover:bg-red-600 rounded px-3 py-2 transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
