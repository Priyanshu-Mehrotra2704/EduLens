import React, { useState } from 'react'
import Navbar from '../admin_components/Navbar'
import Sidebar from '../teacher_components/Sidebar.jsx'
import { API_ENDPOINTS } from '../config'
import { handleError, handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Brain,
  Loader,
  Wand2
} from 'lucide-react'

const AITools = () => {
  const [activeTool, setActiveTool] = useState('quiz')
  const [loading, setLoading] = useState(false)
  
  // AI Quiz Generation from Text
  const [quizText, setQuizText] = useState('')
  const [generatedQuiz, setGeneratedQuiz] = useState('')
  
  // AI Content Enhancement
  const [contentText, setContentText] = useState('')
  const [enhancedContent, setEnhancedContent] = useState('')
  
  // AI Question Suggestions
  const [topicText, setTopicText] = useState('')
  const [suggestedQuestions, setSuggestedQuestions] = useState([])

  const handleGenerateQuiz = async () => {
    if (!quizText.trim()) {
      handleError('Please enter text to generate quiz')
      return
    }

    setLoading(true)
    try {
      // Create a text blob to simulate PDF content
      const textBlob = new Blob([quizText], { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', textBlob, 'content.txt')

      const response = await fetch(API_ENDPOINTS.ML.QUIZ_FROM_PDF, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.quiz) {
        setGeneratedQuiz(data.quiz)
        handleSuccess('Quiz generated successfully!')
      } else {
        throw new Error(data.error || 'Failed to generate quiz')
      }
    } catch (error) {
      handleError(error.message || 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleEnhanceContent = async () => {
    if (!contentText.trim()) {
      handleError('Please enter content to enhance')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.ML.EXPLAIN_CONCEPT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: contentText,
          level: 'intermediate'
        })
      })

      const data = await response.json()
      if (data.explanation) {
        setEnhancedContent(data.explanation)
        handleSuccess('Content enhanced successfully!')
      } else {
        throw new Error(data.error || 'Failed to enhance content')
      }
    } catch (error) {
      handleError(error.message || 'Failed to enhance content')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestQuestions = async () => {
    if (!topicText.trim()) {
      handleError('Please enter a topic')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.ML.AI_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate 5-10 good exam questions for the topic: ${topicText}. Format each question as: Q1. [question text]?`,
          context: 'Education'
        })
      })

      const data = await response.json()
      if (data.reply) {
        // Parse questions from the response
        const questions = data.reply.split(/\d+\./).filter(q => q.trim()).map(q => q.trim())
        setSuggestedQuestions(questions)
        handleSuccess('Questions suggested successfully!')
      } else {
        throw new Error(data.error || 'Failed to suggest questions')
      }
    } catch (error) {
      handleError(error.message || 'Failed to suggest questions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <Navbar />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] p-3 rounded-full">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0B2C59]">AI Teaching Tools</h1>
              <p className="text-gray-600">Powerful AI tools to enhance your teaching</p>
            </div>
          </div>

          {/* Tool Tabs */}
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTool('quiz')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTool === 'quiz'
                  ? 'border-b-2 border-[#207dff] text-[#207dff]'
                  : 'text-gray-600'
              }`}
            >
              <BookOpen className="inline mr-2" size={18} />
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTool('enhance')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTool === 'enhance'
                  ? 'border-b-2 border-[#207dff] text-[#207dff]'
                  : 'text-gray-600'
              }`}
            >
              <Wand2 className="inline mr-2" size={18} />
              Enhance Content
            </button>
            <button
              onClick={() => setActiveTool('questions')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTool === 'questions'
                  ? 'border-b-2 border-[#207dff] text-[#207dff]'
                  : 'text-gray-600'
              }`}
            >
              <Lightbulb className="inline mr-2" size={18} />
              Question Suggestions
            </button>
          </div>

          {/* Generate Quiz Tool */}
          {activeTool === 'quiz' && (
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Generate Quiz from Text</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Enter content/text</label>
                <textarea
                  value={quizText}
                  onChange={(e) => setQuizText(e.target.value)}
                  placeholder="Paste your teaching material here to generate quiz questions..."
                  className="w-full p-3 border rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                />
                <p className="text-xs text-gray-500 mt-1">{quizText.length} characters</p>
              </div>
              <button
                onClick={handleGenerateQuiz}
                disabled={loading || !quizText.trim()}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 mb-4"
              >
                {loading ? <Loader className="inline animate-spin mr-2" size={18} /> : <Sparkles className="inline mr-2" size={18} />}
                Generate Quiz
              </button>

              {generatedQuiz && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-[#0B2C59] mb-2">Generated Quiz:</h3>
                  <div className="text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">{generatedQuiz}</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedQuiz)
                      handleSuccess('Quiz copied to clipboard!')
                    }}
                    className="mt-2 bg-[#207dff] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                  >
                    Copy Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Enhance Content Tool */}
          {activeTool === 'enhance' && (
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Enhance Teaching Content</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Enter content to enhance</label>
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Enter your teaching content here..."
                  className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                />
              </div>
              <button
                onClick={handleEnhanceContent}
                disabled={loading || !contentText.trim()}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 mb-4"
              >
                {loading ? <Loader className="inline animate-spin mr-2" size={18} /> : <Wand2 className="inline mr-2" size={18} />}
                Enhance Content
              </button>

              {enhancedContent && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-[#0B2C59] mb-2">Enhanced Content:</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{enhancedContent}</div>
                </div>
              )}
            </div>
          )}

          {/* Question Suggestions Tool */}
          {activeTool === 'questions' && (
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">AI Question Suggestions</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Enter topic/subject</label>
                <input
                  type="text"
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  placeholder="e.g., Photosynthesis, Newton's Laws..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                />
              </div>
              <button
                onClick={handleSuggestQuestions}
                disabled={loading || !topicText.trim()}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 mb-4"
              >
                {loading ? <Loader className="inline animate-spin mr-2" size={18} /> : <Lightbulb className="inline mr-2" size={18} />}
                Suggest Questions
              </button>

              {suggestedQuestions.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-[#0B2C59] mb-2">Suggested Questions:</h3>
                  <div className="space-y-3">
                    {suggestedQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-white rounded border">
                        <p className="text-gray-700">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AITools

