import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../user_components/Navbar'
import Sidebar from '../user_components/Sidebar.jsx'
import { API_ENDPOINTS } from '../config'
import { handleError } from '../utils'
import { ToastContainer } from 'react-toastify'
import { BookOpen, Clock, User, Play, Search, Filter } from 'lucide-react'

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [filteredQuizzes, setFilteredQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(() => {
    filterQuizzes()
  }, [searchTerm, filterSubject, filterDifficulty, quizzes])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENT.QUIZZES, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setQuizzes(data.quizzes || [])
        setFilteredQuizzes(data.quizzes || [])
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      handleError('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  const filterQuizzes = () => {
    let filtered = [...quizzes]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Subject filter
    if (filterSubject !== 'all') {
      filtered = filtered.filter(quiz => quiz.subject === filterSubject)
    }

    // Difficulty filter
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === filterDifficulty)
    }

    setFilteredQuizzes(filtered)
  }

  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`)
  }

  const subjects = [...new Set(quizzes.map(q => q.subject).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="w-screen">
          <Navbar />
          <div className="flex justify-center items-center h-screen">
            <div className="w-8 h-8 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#0B2C59] mb-6">Available Quizzes</h1>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] mb-6 border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                />
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff] appearance-none bg-white"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quizzes Grid */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border text-center">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No quizzes found</p>
              <p className="text-sm text-gray-400 mt-2">
                {quizzes.length === 0
                  ? "No quizzes available at the moment. Teachers will create quizzes for you to take."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => handleTakeQuiz(quiz._id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-[#0B2C59] flex-1">{quiz.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${
                      quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quiz.difficulty || 'medium'}
                    </span>
                  </div>

                  {quiz.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {quiz.subject && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen size={16} />
                        <span>{quiz.subject}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>{quiz.timeLimit || 30} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <BookOpen size={16} />
                      <span>{quiz.questions?.length || 0} questions</span>
                    </div>
                    {quiz.createdBy && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={16} />
                        <span>By {quiz.createdBy.name}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTakeQuiz(quiz._id)
                    }}
                    className="w-full bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    Take Quiz
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
            <p className="text-sm text-gray-600">
              Showing {filteredQuizzes.length} of {quizzes.length} quizzes
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Quizzes

