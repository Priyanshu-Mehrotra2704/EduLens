import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../user_components/Navbar'
import Sidebar from '../user_components/Sidebar.jsx'
import { API_ENDPOINTS } from '../config'
import { handleError, handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import { CheckCircle, XCircle, ArrowRight, Trophy, Clock } from 'lucide-react'

const TakeQuiz = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [startTime] = useState(Date.now())
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENT.QUIZ_BY_ID(quizId), {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success && data.quiz) {
        setQuiz(data.quiz)
      } else if (data.attempted) {
        // Quiz already attempted - show previous result
        handleError(data.message || 'You have already taken this quiz')
        if (data.attempt) {
          setResult({
            score: data.attempt.score,
            totalQuestions: data.attempt.totalQuestions,
            percentage: data.attempt.percentage
          })
        }
        setTimeout(() => {
          navigate('/quizzes')
        }, 3000)
      } else {
        handleError(data.message || 'Quiz not found')
        navigate('/quizzes')
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
      handleError('Failed to load quiz')
      navigate('/quizzes')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (option) => {
    if (submitted) return
    setSelectedOption(option)
    const questionId = quiz.questions[currentQIndex]._id
    setAnswers({ ...answers, [questionId]: option })
  }

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < quiz.questions.length) {
      setCurrentQIndex(prev => prev + 1)
      setSelectedOption(answers[quiz.questions[currentQIndex + 1]._id] || null)
      setIsCorrect(null)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1)
      setSelectedOption(answers[quiz.questions[currentQIndex - 1]._id] || null)
      setIsCorrect(null)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!window.confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
      return
    }

    try {
      setSubmitted(true)
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      
      const answerArray = Object.keys(answers).map(questionId => ({
        questionId,
        selectedAnswer: answers[questionId]
      }))

      const response = await fetch(API_ENDPOINTS.STUDENT.QUIZ_ATTEMPT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          quizId,
          answers: answerArray,
          timeTaken
        })
      })

      const data = await response.json()
      if (data.success) {
        setResult(data.attempt)
        handleSuccess('Quiz submitted successfully!')
      } else {
        handleError(data.message || 'Failed to submit quiz')
        setSubmitted(false)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      handleError('Error submitting quiz')
      setSubmitted(false)
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

  if (!quiz) {
    return null
  }

  if (result) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="w-screen">
          <Navbar />
          <div className="p-6">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg mx-auto border-t-8 border-[#ad31af]">
              <Trophy size={80} className="text-yellow-500 mx-auto mb-6" />
              <h2 className="text-4xl font-extrabold text-[#0B2C59] mb-2">Quiz Completed!</h2>
              <div className="flex justify-center items-center gap-8 mb-10 mt-8">
                <div className="text-center">
                  <div className="text-sm text-gray-400 uppercase font-bold">Score</div>
                  <div className="text-5xl font-black text-[#1b5cb8]">{result.score}/{result.totalQuestions}</div>
                </div>
                <div className="w-px h-16 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 uppercase font-bold">Percentage</div>
                  <div className="text-5xl font-black text-[#0fc6b4]">{result.percentage}%</div>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQIndex]
  const progress = ((currentQIndex + 1) / quiz.questions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <Navbar />
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#0B2C59]">{quiz.title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Question {currentQIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">
                Answered: {answeredCount}/{quiz.questions.length}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
            <div
              className="bg-gradient-to-r from-[#1b5cb8] to-[#0fc6b4] h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border">
            <h2 className="text-2xl font-bold text-[#0B2C59] mb-6">{currentQuestion.question}</h2>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option
                let className = "p-5 rounded-xl border-2 text-left text-lg font-medium transition-all cursor-pointer flex justify-between items-center"
                
                if (isSelected) {
                  className += " bg-blue-100 border-blue-500"
                } else {
                  className += " bg-white border-gray-200 hover:border-[#1b5cb8] hover:bg-blue-50"
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    disabled={submitted}
                    className={className}
                  >
                    <span>{option}</span>
                    {isSelected && <CheckCircle className="text-blue-600" size={24} />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQIndex === 0}
              className="px-6 py-2 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentQIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitted || answeredCount < quiz.questions.length}
                className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitted ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white hover:shadow-lg flex items-center gap-2"
              >
                Next <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default TakeQuiz

