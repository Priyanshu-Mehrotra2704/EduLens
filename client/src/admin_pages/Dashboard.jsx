import React, { useState, useEffect } from 'react'
import Navbar from '../admin_components/Navbar'
import Sidebar from '../admin_components/Sidebar.jsx'
import { handleSuccess, handleError } from '../utils.jsx'
import { API_ENDPOINTS } from '../config'
import { Users, BookOpen, FileText, TrendingUp, Trash2, Edit } from 'lucide-react'
import { ToastContainer } from 'react-toastify'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [content, setContent] = useState({ quizzes: [], notes: [] })
  const [activity, setActivity] = useState({ recentAttempts: [], recentQuizzes: [], recentNotes: [] })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchUserStats(),
          fetchAllUsers(),
          fetchAllContent(),
          fetchSystemActivity()
        ])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.USER_STATS, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.USERS, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchAllContent = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.CONTENT, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const fetchSystemActivity = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.ACTIVITY, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setActivity(data.activity)
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.DELETE_USER(userId), {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        handleSuccess('User deleted successfully')
        fetchAllUsers()
        fetchUserStats()
      } else {
        handleError(data.message || 'Failed to delete user')
      }
    } catch (error) {
      handleError('Error deleting user')
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.USER_ROLE(userId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      })
      const data = await response.json()
      if (data.success) {
        handleSuccess('User role updated successfully')
        fetchAllUsers()
      } else {
        handleError(data.message || 'Failed to update role')
      }
    } catch (error) {
      handleError('Error updating role')
    }
  }

  const handleDeleteContent = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return
    
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.DELETE_CONTENT(type, id), {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        handleSuccess(`${type} deleted successfully`)
        fetchAllContent()
      } else {
        handleError(data.message || 'Failed to delete content')
      }
    } catch (error) {
      handleError('Error deleting content')
    }
  }

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-screen">
          <Navbar />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-[#0B2C59] mb-6">Admin Dashboard</h1>
            
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 px-4 font-semibold ${activeTab === 'overview' ? 'border-b-2 border-[#207dff] text-[#207dff]' : 'text-gray-600'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-2 px-4 font-semibold ${activeTab === 'users' ? 'border-b-2 border-[#207dff] text-[#207dff]' : 'text-gray-600'}`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-2 px-4 font-semibold ${activeTab === 'content' ? 'border-b-2 border-[#207dff] text-[#207dff]' : 'text-gray-600'}`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`pb-2 px-4 font-semibold ${activeTab === 'activity' ? 'border-b-2 border-[#207dff] text-[#207dff]' : 'text-gray-600'}`}
              >
                Activity
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-[#207dff]">{stats.totalUsers || 0}</p>
                      </div>
                      <Users className="text-[#207dff]" size={32} />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Teachers</p>
                        <p className="text-2xl font-bold text-[#0fc6b4]">{stats.totalTeachers || 0}</p>
                      </div>
                      <Users className="text-[#0fc6b4]" size={32} />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Students</p>
                        <p className="text-2xl font-bold text-[#ad31af]">{stats.totalStudents || 0}</p>
                      </div>
                      <Users className="text-[#ad31af]" size={32} />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Verified</p>
                        <p className="text-2xl font-bold text-green-600">{stats.verifiedUsers || 0}</p>
                      </div>
                      <TrendingUp className="text-green-600" size={32} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <h3 className="text-xl font-semibold mb-4 text-[#0B2C59]">Content Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Quizzes:</span>
                        <span className="font-bold text-[#207dff]">{content.totalQuizzes || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Notes:</span>
                        <span className="font-bold text-[#0fc6b4]">{content.totalNotes || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <h3 className="text-xl font-semibold mb-4 text-[#0B2C59]">Recent Activity</h3>
                    <div className="space-y-2 text-sm">
                      <p>Recent Quiz Attempts: {activity.recentAttempts?.length || 0}</p>
                      <p>Recent Quizzes Created: {activity.recentQuizzes?.length || 0}</p>
                      <p>Recent Notes Uploaded: {activity.recentNotes?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">All Users</h2>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Role</th>
                          <th className="text-left p-2">Verified</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                              className="border rounded px-2 py-1"
                            >
                              <option value="user">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <span className={user.verified ? 'text-green-600' : 'text-red-600'}>
                              {user.verified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="p-2">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                  <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">All Quizzes</h2>
                  <div className="space-y-4">
                    {content.quizzes?.length === 0 ? (
                      <p className="text-gray-500">No quizzes found</p>
                    ) : (
                      content.quizzes?.map((quiz) => (
                        <div key={quiz._id} className="border p-4 rounded-lg flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-[#207dff]">{quiz.title}</h3>
                            <p className="text-gray-600 text-sm">{quiz.description}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Created by: {quiz.createdBy?.name || 'Unknown'} | {new Date(quiz.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteContent('quiz', quiz._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                  <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">All Notes</h2>
                  <div className="space-y-4">
                    {content.notes?.length === 0 ? (
                      <p className="text-gray-500">No notes found</p>
                    ) : (
                      content.notes?.map((note) => (
                        <div key={note._id} className="border p-4 rounded-lg flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-[#0fc6b4]">{note.title}</h3>
                            <p className="text-gray-600 text-sm">{note.summary || note.content.substring(0, 100)}...</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Uploaded by: {note.uploadedBy?.name || 'Unknown'} | {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteContent('note', note._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                  <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Recent Quiz Attempts</h2>
                  {activity.recentAttempts?.length === 0 ? (
                    <p className="text-gray-500">No recent quiz attempts</p>
                  ) : (
                    <div className="space-y-2">
                      {activity.recentAttempts?.slice(0, 10).map((attempt) => (
                      <div key={attempt._id} className="border p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-semibold">{attempt.studentId?.name || 'Unknown'}</span> completed 
                          <span className="font-semibold"> {attempt.quizId?.title || 'Quiz'}</span> with 
                          <span className="text-[#207dff] font-bold"> {attempt.percentage}%</span>
                        </p>
                        <p className="text-xs text-gray-500">{new Date(attempt.completedAt).toLocaleString()}</p>
                      </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                  <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Recent Content</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Recent Quizzes</h3>
                      {activity.recentQuizzes?.length === 0 ? (
                        <p className="text-gray-500 text-sm">No recent quizzes</p>
                      ) : (
                        <div className="space-y-2">
                          {activity.recentQuizzes?.slice(0, 5).map((quiz) => (
                          <div key={quiz._id} className="border p-2 rounded text-sm">
                            <p className="font-semibold">{quiz.title}</p>
                            <p className="text-xs text-gray-500">by {quiz.createdBy?.name}</p>
                          </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Recent Notes</h3>
                      {activity.recentNotes?.length === 0 ? (
                        <p className="text-gray-500 text-sm">No recent notes</p>
                      ) : (
                        <div className="space-y-2">
                          {activity.recentNotes?.slice(0, 5).map((note) => (
                          <div key={note._id} className="border p-2 rounded text-sm">
                            <p className="font-semibold">{note.title}</p>
                            <p className="text-xs text-gray-500">by {note.uploadedBy?.name}</p>
                          </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Dashboard