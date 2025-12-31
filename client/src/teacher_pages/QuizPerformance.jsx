import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../admin_components/Navbar'
import Sidebar from '../teacher_components/Sidebar.jsx'
import { handleError } from '../utils.jsx'
import { API_ENDPOINTS } from '../config'
import { ArrowLeft, Users, TrendingUp, Award } from 'lucide-react'
import { ToastContainer } from 'react-toastify'

const QuizPerformance = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizPerformance()
  }, [quizId])

  const fetchQuizPerformance = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TEACHER.QUIZ_PERFORMANCE(quizId), {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setPerformance(data.stats)
      } else {
        handleError(data.message || 'Failed to load performance data')
      }
    } catch (error) {
      console.error('Error fetching performance:', error)
      handleError('Error loading performance data')
    } finally {
      setLoading(false)
    }
  }

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
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-screen">
          <Navbar />
          <div className="p-6">
            <button
              onClick={() => navigate('/teacher_dashboard')}
              className="flex items-center gap-2 text-[#207dff] hover:text-[#154a96] mb-4"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-[#0B2C59] mb-6">Quiz Performance</h1>

            {performance && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Attempts</p>
                        <p className="text-2xl font-bold text-[#207dff]">{performance.totalAttempts || 0}</p>
                      </div>
                      <Users className="text-[#207dff]" size={32} />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Average Score</p>
                        <p className="text-2xl font-bold text-[#0fc6b4]">
                          {performance.averageScore ? performance.averageScore.toFixed(1) : 0}%
                        </p>
                      </div>
                      <TrendingUp className="text-[#0fc6b4]" size={32} />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Students</p>
                        <p className="text-2xl font-bold text-[#ad31af]">
                          {performance.attempts ? new Set(performance.attempts.map(a => a.studentId?._id)).size : 0}
                        </p>
                      </div>
                      <Award className="text-[#ad31af]" size={32} />
                    </div>
                  </div>
                </div>

                {/* Student Attempts Table */}
                <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                  <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Student Attempts</h2>
                  {performance.attempts && performance.attempts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Student Name</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Score</th>
                            <th className="text-left p-2">Percentage</th>
                            <th className="text-left p-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performance.attempts.map((attempt) => (
                            <tr key={attempt._id} className="border-b">
                              <td className="p-2">{attempt.studentId?.name || 'Unknown'}</td>
                              <td className="p-2">{attempt.studentId?.email || 'N/A'}</td>
                              <td className="p-2">
                                <span className="font-semibold">{attempt.score}/{attempt.totalQuestions}</span>
                              </td>
                              <td className="p-2">
                                <span className={`font-bold ${
                                  attempt.percentage >= 80 ? 'text-green-600' :
                                  attempt.percentage >= 50 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {attempt.percentage}%
                                </span>
                              </td>
                              <td className="p-2 text-sm text-gray-500">
                                {new Date(attempt.completedAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No attempts yet</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default QuizPerformance

