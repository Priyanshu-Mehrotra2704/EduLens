import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Lightbulb, BookOpen, FileText } from 'lucide-react'
import { API_ENDPOINTS } from '../../config'

const AI_suggestions = () => {
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENT.RECOMMENDATIONS, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='border rounded-lg w-80 h-60 flex flex-col items-center justify-center bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)]'>
        <div className="w-8 h-8 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className='border rounded-lg w-80 h-60 flex flex-col bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)] overflow-y-auto'>
      <div className='p-4 border-b'>
        <h1 className='text-xl font-semibold text-[#207dff] flex items-center gap-2'>
          <Lightbulb size={20} />
          AI Suggestions
        </h1>
      </div>
      <div className='p-4 flex-1 overflow-y-auto'>
        {recommendations ? (
          <div className='space-y-3'>
            <p className='text-sm text-gray-700 mb-3'>{recommendations.message}</p>
            
            {recommendations.weakAreas && recommendations.weakAreas.length > 0 && (
              <div className='mb-3'>
                <p className='text-sm font-semibold text-red-600 mb-2'>Weak Areas:</p>
                {recommendations.weakAreas.slice(0, 2).map((area, idx) => (
                  <p key={idx} className='text-xs text-gray-600'>
                    • {area.subject} (Avg: {area.averageScore.toFixed(1)}%)
                  </p>
                ))}
              </div>
            )}

            {recommendations.recommendedQuizzes && recommendations.recommendedQuizzes.length > 0 && (
              <div className='mb-3'>
                <p className='text-sm font-semibold text-[#207dff] mb-2 flex items-center gap-1'>
                  <BookOpen size={14} />
                  Recommended Quizzes:
                </p>
                {recommendations.recommendedQuizzes.slice(0, 2).map((quiz, idx) => (
                  <Link
                    key={idx}
                    to={`/quiz/${quiz._id}`}
                    className='text-xs text-gray-600 truncate block hover:text-[#207dff] hover:underline cursor-pointer'
                  >
                    • {quiz.title}
                  </Link>
                ))}
              </div>
            )}

            {recommendations.recommendedNotes && recommendations.recommendedNotes.length > 0 && (
              <div>
                <p className='text-sm font-semibold text-[#0fc6b4] mb-2 flex items-center gap-1'>
                  <FileText size={14} />
                  Recommended Notes:
                </p>
                {recommendations.recommendedNotes.slice(0, 2).map((note, idx) => (
                  <p key={idx} className='text-xs text-gray-600 truncate'>
                    • {note.title}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className='text-sm text-gray-500'>Complete some quizzes to get personalized recommendations!</p>
        )}
      </div>
    </div>
  )
}

export default AI_suggestions