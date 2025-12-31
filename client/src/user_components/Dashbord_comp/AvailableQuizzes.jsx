import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../../config'
import { BookOpen, Clock, User, Play } from 'lucide-react'

const AvailableQuizzes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENT.QUIZZES, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setQuizzes(data.quizzes || [])
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className='border rounded-lg w-full h-full flex flex-col items-center justify-center bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)] min-h-[400px]'>
        <div className="w-8 h-8 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className='border rounded-lg w-full bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)]'>
      <div className='p-4 border-b'>
        <h1 className='text-2xl font-semibold text-[#207dff] flex items-center gap-2'>
          <BookOpen size={24} />
          Available Quizzes
        </h1>
      </div>
      <div className='p-4 max-h-[500px] overflow-y-auto'>
        {quizzes.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No quizzes available at the moment.</p>
            <p className='text-sm text-gray-400 mt-2'>Teachers will create quizzes for you to take.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {quizzes.slice(0, 3).map((quiz) => (
              <div
                key={quiz._id}
                className='border p-4 rounded-lg hover:shadow-md transition-all bg-gradient-to-r from-blue-50 to-purple-50'
              >
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-[#0B2C59] mb-2'>{quiz.title}</h3>
                    {quiz.description && (
                      <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{quiz.description}</p>
                    )}
                    <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                      {quiz.subject && (
                        <span className='flex items-center gap-1'>
                          <BookOpen size={14} />
                          {quiz.subject}
                        </span>
                      )}
                      <span className='flex items-center gap-1'>
                        <Clock size={14} />
                        {quiz.timeLimit || 30} min
                      </span>
                      <span className='flex items-center gap-1'>
                        <BookOpen size={14} />
                        {quiz.questions?.length || 0} questions
                      </span>
                      {quiz.createdBy && (
                        <span className='flex items-center gap-1'>
                          <User size={14} />
                          {quiz.createdBy.name}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {quiz.difficulty || 'medium'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className='ml-4 bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2'
                  >
                    <Play size={18} />
                    Take Quiz
                  </Link>
                </div>
              </div>
            ))}
            {quizzes.length > 3 && (
              <div className='text-center mt-4'>
                <Link
                  to='/quizzes'
                  className='text-[#207dff] hover:underline font-semibold'
                >
                  View All Quizzes ({quizzes.length})
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AvailableQuizzes

