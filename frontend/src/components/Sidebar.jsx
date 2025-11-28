import React from 'react'

// Sidebar shows total users, clickable user names, and a logout button
export default function Sidebar({ users = [], onSelectUser, onLogout }) {
  return (
    <nav className="bg-white shadow-md border-r border-gray-200 h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4 overflow-auto flex flex-col">
      <div className="mb-4">
        <h6 className="text-blue-600 text-sm font-semibold px-4">Users</h6>
        <div className="mt-2 px-4">
          <div className="text-slate-600 text-sm">Total Users: <span className="font-medium">{users.length}</span></div>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user._id}>
                <button
                  type="button"
                  onClick={() => onSelectUser && onSelectUser(user)}
                  className="w-full text-left text-slate-700 font-medium text-[15px] block hover:text-slate-900 hover:bg-gray-100 rounded px-3 py-2 transition-all"
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
          onClick={() => onLogout && onLogout()}
          className="w-full text-left text-red-600 font-semibold text-[15px] block hover:text-white hover:bg-red-600 rounded px-3 py-2 transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
