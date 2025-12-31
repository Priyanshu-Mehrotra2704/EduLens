import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../admin_components/Navbar'
import Sidebar from '../teacher_components/Sidebar.jsx'
import { handleSuccess, handleError } from '../utils.jsx'
import { API_ENDPOINTS } from '../config'
import { Plus, BookOpen, Users, TrendingUp } from 'lucide-react'
import { ToastContainer } from 'react-toastify'

const Dashboard = () => {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [notes, setNotes] = useState([])
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalNotes: 0,
    totalAttempts: 0
  })
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [uploadingNote, setUploadingNote] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium',
    timeLimit: 30,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '', questionType: 'MCQ' }]
  })
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    subject: '',
    summary: ''
  })
  const [noteFile, setNoteFile] = useState(null)
  const [extractingText, setExtractingText] = useState(false)

  useEffect(() => {
    fetchMyQuizzes()
    fetchMyNotes()
  }, [])

  const fetchTotalAttempts = async (quizList) => {
    try {
      let totalAttempts = 0
      // Calculate total attempts from all quizzes
      for (const quiz of quizList) {
        try {
          const response = await fetch(API_ENDPOINTS.TEACHER.QUIZ_PERFORMANCE(quiz._id), {
            credentials: 'include'
          })
          const data = await response.json()
          if (data.success && data.stats) {
            totalAttempts += data.stats.totalAttempts || 0
          }
        } catch (err) {
          console.error(`Error fetching attempts for quiz ${quiz._id}:`, err)
        }
      }
      setStats(prev => ({ ...prev, totalAttempts }))
    } catch (error) {
      console.error('Error fetching attempts:', error)
    }
  }

  const fetchMyQuizzes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TEACHER.QUIZZES, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setQuizzes(data.quizzes)
        setStats(prev => ({ ...prev, totalQuizzes: data.quizzes.length }))
        // Fetch attempts after quizzes are loaded
        if (data.quizzes.length > 0) {
          fetchTotalAttempts(data.quizzes)
        }
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  const fetchMyNotes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TEACHER.NOTES, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setNotes(data.notes)
        setStats(prev => ({ ...prev, totalNotes: data.notes.length }))
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleCreateQuiz = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(API_ENDPOINTS.TEACHER.QUIZZES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(quizForm)
      })
      const data = await response.json()
      if (data.success) {
        handleSuccess('Quiz created successfully!')
        setShowQuizForm(false)
        setQuizForm({
          title: '',
          description: '',
          subject: '',
          difficulty: 'medium',
          timeLimit: 30,
          questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '', questionType: 'MCQ' }]
        })
        fetchMyQuizzes()
      } else {
        handleError(data.message || 'Failed to create quiz')
      }
    } catch (error) {
      handleError('Error creating quiz')
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    const validExtensions = ['.pdf', '.ppt', '.pptx']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      handleError('Please upload a PDF or PowerPoint file (.pdf, .ppt, .pptx)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      handleError('File size must be less than 10MB')
      return
    }

    setNoteFile(file)
    setExtractingText(true)

    try {
      // Extract text from file
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(API_ENDPOINTS.ML.EXTRACT_TEXT, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.text) {
        setNoteForm({ ...noteForm, content: data.text })
        handleSuccess('Text extracted from file successfully!')
        
        // Auto-generate title from filename if not set
        if (!noteForm.title) {
          const fileName = file.name.replace(/\.[^/.]+$/, '')
          setNoteForm(prev => ({ ...prev, title: fileName }))
        }
      } else {
        throw new Error(data.error || 'Failed to extract text from file')
      }
    } catch (error) {
      console.error('Error extracting text:', error)
      handleError(error.message || 'Failed to extract text from file')
      setNoteFile(null)
    } finally {
      setExtractingText(false)
    }
  }

  const handleGenerateSummary = async () => {
    if (!noteForm.content || !noteForm.content.trim()) {
      handleError('Please upload a file or enter content first to generate summary')
      return
    }

    setGeneratingSummary(true)
    try {
      // Use summarize endpoint with text blob
      const textBlob = new Blob([noteForm.content], { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', textBlob, 'note.txt')
      
      const response = await fetch(API_ENDPOINTS.ML.SUMMARIZE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteForm.content })
      })

      const data = await response.json()
      if (data.summary) {
        // Limit summary to reasonable length (first 500 characters or first paragraph)
        const summary = data.summary.split('\n\n')[0] || data.summary.substring(0, 500)
        setNoteForm({ ...noteForm, summary: summary })
        handleSuccess('Summary generated successfully!')
      } else {
        handleError(data.error || 'Failed to generate summary')
      }
    } catch (error) {
      console.error('Error generating summary:', error)
      handleError('Error generating summary. Please try again.')
    } finally {
      setGeneratingSummary(false)
    }
  }

  const handleUploadNote = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!noteForm.title || !noteForm.title.trim()) {
      handleError('Please enter a title for the note')
      return
    }
    
    if (!noteForm.content || !noteForm.content.trim()) {
      handleError('Please enter content for the note or upload a file')
      return
    }

    setUploadingNote(true)
    let uploadedFileUrl = ''
    let uploadedOriginalFileName = ''

    try {
      // First, upload the file if one was selected
      if (noteFile) {
        const formData = new FormData()
        formData.append('file', noteFile)

        const fileUploadResponse = await fetch(API_ENDPOINTS.TEACHER.UPLOAD_NOTE_FILE, {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (!fileUploadResponse.ok) {
          const errorData = await fileUploadResponse.json()
          throw new Error(errorData.message || 'Failed to upload file')
        }

        const fileData = await fileUploadResponse.json()
        uploadedFileUrl = fileData.fileUrl
        uploadedOriginalFileName = fileData.originalName
        handleSuccess('File uploaded successfully!')
      }

      // Then, save the note with file metadata
      const response = await fetch(API_ENDPOINTS.TEACHER.NOTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: noteForm.title.trim(),
          content: noteForm.content.trim(),
          subject: noteForm.subject.trim() || undefined,
          summary: noteForm.summary.trim() || undefined,
          fileUrl: uploadedFileUrl || undefined,
          originalFileName: uploadedOriginalFileName || undefined
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        handleSuccess('Note uploaded successfully!')
        setShowNoteForm(false)
        setNoteForm({ title: '', content: '', subject: '', summary: '' })
        setNoteFile(null)
        fetchMyNotes()
      } else {
        handleError(data.message || 'Failed to upload note')
      }
    } catch (error) {
      console.error('Error uploading note:', error)
      handleError(error.message || 'Network error. Please check your connection and try again.')
    } finally {
      setUploadingNote(false)
    }
  }

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { question: '', options: ['', '', '', ''], correctAnswer: '', questionType: 'MCQ' }]
    })
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quizForm.questions]
    newQuestions[index][field] = value
    setQuizForm({ ...quizForm, questions: newQuestions })
  }

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...quizForm.questions]
    newQuestions[qIndex].options[oIndex] = value
    setQuizForm({ ...quizForm, questions: newQuestions })
  }

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-screen">
          <Navbar />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-[#0B2C59] mb-6">Teacher Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Quizzes</p>
                    <p className="text-2xl font-bold text-[#207dff]">{stats.totalQuizzes}</p>
                  </div>
                  <BookOpen className="text-[#207dff]" size={32} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Notes</p>
                    <p className="text-2xl font-bold text-[#0fc6b4]">{stats.totalNotes}</p>
                  </div>
                  <Plus className="text-[#0fc6b4]" size={32} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Attempts</p>
                    <p className="text-2xl font-bold text-[#ad31af]">{stats.totalAttempts}</p>
                  </div>
                  <Users className="text-[#ad31af]" size={32} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowQuizForm(!showQuizForm)}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="inline mr-2" size={20} />
                Create Quiz
              </button>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="bg-gradient-to-r from-[#0fc6b4] to-[#207dff] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="inline mr-2" size={20} />
                Upload Note
              </button>
            </div>

            {/* Quiz Form */}
            {showQuizForm && (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border">
                <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Create New Quiz</h2>
                <form onSubmit={handleCreateQuiz}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={quizForm.title}
                        onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        value={quizForm.subject}
                        onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={quizForm.description}
                      onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty</label>
                      <select
                        value={quizForm.difficulty}
                        onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                      <input
                        type="number"
                        value={quizForm.timeLimit}
                        onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })}
                        className="w-full p-2 border rounded-lg"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Questions</label>
                      <button type="button" onClick={addQuestion} className="text-[#207dff] hover:underline">
                        + Add Question
                      </button>
                    </div>
                    {quizForm.questions.map((q, qIndex) => (
                      <div key={qIndex} className="border p-4 rounded-lg mb-4">
                        <input
                          type="text"
                          placeholder="Question"
                          value={q.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          className="w-full p-2 border rounded-lg mb-2"
                          required
                        />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {q.options.map((opt, oIndex) => (
                            <input
                              key={oIndex}
                              type="text"
                              placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                              value={opt}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              className="p-2 border rounded-lg"
                              required
                            />
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Correct Answer (e.g., A, B, C, D)"
                          value={q.correctAnswer}
                          onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold"
                    >
                      Create Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQuizForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Note Form */}
            {showNoteForm && (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border">
                <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Upload Note</h2>
                <form onSubmit={handleUploadNote}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        value={noteForm.title}
                        onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                        required
                        placeholder="Enter note title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        value={noteForm.subject}
                        onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                        placeholder="e.g., Mathematics, Physics"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload File (PDF/PPT) *</label>
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                      disabled={extractingText}
                    />
                    {noteFile && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {noteFile.name} ({Math.round(noteFile.size / 1024)} KB)
                      </p>
                    )}
                    {extractingText && (
                      <p className="text-xs text-blue-600 mt-1">Extracting text from file...</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Content (Auto-extracted or Manual) *</label>
                    <textarea
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                      rows="8"
                      required
                      placeholder="Content will be auto-extracted from uploaded file, or enter manually..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{noteForm.content.length} characters</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Summary (optional)</label>
                      <button
                        type="button"
                        onClick={handleGenerateSummary}
                        disabled={!noteForm.content || generatingSummary}
                        className="text-xs bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-3 py-1 rounded hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingSummary ? 'Generating...' : '🤖 AI Generate Summary'}
                      </button>
                    </div>
                    <textarea
                      value={noteForm.summary}
                      onChange={(e) => setNoteForm({ ...noteForm, summary: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                      rows="3"
                      placeholder="Enter summary or use AI to generate one..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{noteForm.summary.length} characters</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={uploadingNote || !noteForm.title || !noteForm.content}
                      className={`bg-gradient-to-r from-[#0fc6b4] to-[#207dff] text-white px-6 py-2 rounded-lg font-semibold transition-all ${
                        uploadingNote || !noteForm.title || !noteForm.content
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:shadow-lg'
                      }`}
                    >
                      {uploadingNote ? 'Uploading...' : 'Upload Note'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNoteForm(false)
                        setNoteForm({ title: '', content: '', subject: '', summary: '' })
                        setNoteFile(null)
                      }}
                      disabled={uploadingNote || extractingText}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Quizzes List */}
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] mb-6 border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">My Quizzes</h2>
              <div className="space-y-4">
                {quizzes.length === 0 ? (
                  <p className="text-gray-500">No quizzes created yet</p>
                ) : (
                  quizzes.map((quiz) => (
                    <div key={quiz._id} className="border p-4 rounded-lg hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-[#207dff]">{quiz.title}</h3>
                          <p className="text-gray-600 text-sm">{quiz.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Subject: {quiz.subject || 'N/A'}</span>
                            <span>Difficulty: {quiz.difficulty}</span>
                            <span>Questions: {quiz.questions.length}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigate(`/quiz-performance/${quiz._id}`)
                          }}
                          className="text-[#207dff] hover:underline text-sm px-3 py-1 border border-[#207dff] rounded hover:bg-[#207dff] hover:text-white transition-all"
                        >
                          View Performance
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notes List */}
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">My Notes</h2>
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500">No notes uploaded yet</p>
                ) : (
                  notes.map((note) => (
                    <div key={note._id} className="border p-4 rounded-lg hover:shadow-md transition-all">
                      <h3 className="text-lg font-semibold text-[#0fc6b4]">{note.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{note.summary || note.content.substring(0, 100)}...</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>Subject: {note.subject || 'N/A'}</span>
                        <span>Uploaded: {new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

