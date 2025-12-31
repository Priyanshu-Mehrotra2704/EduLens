import React, { useState } from 'react'
import Navbar from '../user_components/Navbar'
import Sidebar from '../user_components/Sidebar.jsx'
import { API_ENDPOINTS } from '../config'
import { handleError, handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Calendar, 
  Lightbulb, 
  Brain,
  Loader
} from 'lucide-react'

const AITools = () => {
  const [activeTool, setActiveTool] = useState('flashcards')
  const [loading, setLoading] = useState(false)
  
  // Flashcards
  const [flashcardText, setFlashcardText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  
  // Concept Explainer
  const [concept, setConcept] = useState('')
  const [conceptLevel, setConceptLevel] = useState('beginner')
  const [explanation, setExplanation] = useState('')
  
  // Study Plan
  const [studySubjects, setStudySubjects] = useState('')
  const [studyDays, setStudyDays] = useState(7)
  const [studyHours, setStudyHours] = useState(2)
  const [studyPlan, setStudyPlan] = useState('')
  
  // Generate Notes
  const [noteTopic, setNoteTopic] = useState('')
  const [noteDetailLevel, setNoteDetailLevel] = useState('medium')
  const [generatedNotes, setGeneratedNotes] = useState('')

  const handleGenerateFlashcards = async () => {
    if (!flashcardText.trim()) {
      handleError('Please enter text to generate flashcards')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.ML.FLASHCARDS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: flashcardText })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setFlashcards(data.flashcards || [])
      handleSuccess('Flashcards generated successfully!')
    } catch (error) {
      handleError(error.message || 'Failed to generate flashcards')
    } finally {
      setLoading(false)
    }
  }

  const handleExplainConcept = async () => {
    if (!concept.trim()) {
      handleError('Please enter a concept to explain')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.ML.EXPLAIN_CONCEPT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, level: conceptLevel })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setExplanation(data.explanation)
      handleSuccess('Concept explained!')
    } catch (error) {
      handleError(error.message || 'Failed to explain concept')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateStudyPlan = async () => {
    if (!studySubjects.trim()) {
      handleError('Please enter subjects')
      return
    }

    const subjects = studySubjects.split(',').map(s => s.trim()).filter(Boolean)
    if (subjects.length === 0) {
      handleError('Please enter at least one subject')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.ML.STUDY_PLAN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects,
          days: studyDays,
          hours_per_day: studyHours
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setStudyPlan(data.study_plan)
      handleSuccess('Study plan generated!')
    } catch (error) {
      handleError(error.message || 'Failed to generate study plan')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateNotes = async () => {
    if (!noteTopic.trim()) {
      handleError('Please enter a topic')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.ML.GENERATE_NOTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: noteTopic,
          detail_level: noteDetailLevel
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setGeneratedNotes(data.notes)
      handleSuccess('Notes generated successfully!')
    } catch (error) {
      handleError(error.message || 'Failed to generate notes')
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
              <h1 className="text-3xl font-bold text-[#0B2C59]">AI Study Tools</h1>
              <p className="text-gray-600">Powerful AI tools to enhance your learning</p>
            </div>
          </div>

          {/* Tool Tabs */}
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTool('flashcards')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTool === 'flashcards'
                  ? 'border-b-2 border-[#207dff] text-[#207dff]'
                  : 'text-gray-600'
              }`}
            >
              <BookOpen className="inline mr-2" size={18} />
              Flashcards
            </button>
            <button
              onClick={() => setActiveTool('explain')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTool === 'explain'
                  ? 'border-b-2 border-[#207dff] text-[#207dff]'
                  : 'text-gray-600'
              }`}
            >
              <Lightbulb className="inline mr-2" size={18} />
              Explain Concept
            </button>
            <button
              onClick={() => setActiveTool('studyplan')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTool === 'studyplan'
                  ? 'border-b-2 border-[#207dff] text-[#207dff]'
                  : 'text-gray-600'
              }`}
            >
              <Calendar className="inline mr-2" size={18} />
              Study Plan
            </button>
            <button
              onClick={() => setActiveTool('notes')}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTool === 'notes'
                  ? 'border-b-2 border-[#207dff] text-[#207dff]'
                  : 'text-gray-600'
              }`}
            >
              <FileText className="inline mr-2" size={18} />
              Generate Notes
            </button>
          </div>

          {/* Flashcards Tool */}
          {activeTool === 'flashcards' && (
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Generate Flashcards</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Enter text content</label>
                <textarea
                  value={flashcardText}
                  onChange={(e) => setFlashcardText(e.target.value)}
                  placeholder="Paste your study material here..."
                  className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                />
              </div>
              <button
                onClick={handleGenerateFlashcards}
                disabled={loading}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? <Loader className="inline animate-spin mr-2" size={18} /> : null}
                Generate Flashcards
              </button>

              {flashcards.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flashcards.map((card, idx) => (
                    <div key={idx} className="border p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-[#207dff]">FRONT</span>
                        <p className="font-semibold text-gray-800">{card.front}</p>
                      </div>
                      <div className="border-t pt-2">
                        <span className="text-xs font-semibold text-[#0fc6b4]">BACK</span>
                        <p className="text-gray-700">{card.back}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Concept Explainer */}
          {activeTool === 'explain' && (
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Explain Concept</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Concept/Topic</label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., Photosynthesis, Newton's Laws..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <select
                    value={conceptLevel}
                    onChange={(e) => setConceptLevel(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleExplainConcept}
                disabled={loading}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 mb-4"
              >
                {loading ? <Loader className="inline animate-spin mr-2" size={18} /> : null}
                Explain Concept
              </button>

              {explanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-[#0B2C59] mb-2">Explanation:</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{explanation}</div>
                </div>
              )}
            </div>
          )}

          {/* Study Plan */}
          {activeTool === 'studyplan' && (
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Generate Study Plan</h2>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subjects (comma-separated)</label>
                  <input
                    type="text"
                    value={studySubjects}
                    onChange={(e) => setStudySubjects(e.target.value)}
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Study Days</label>
                    <input
                      type="number"
                      value={studyDays}
                      onChange={(e) => setStudyDays(parseInt(e.target.value))}
                      min="1"
                      max="30"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hours per Day</label>
                    <input
                      type="number"
                      value={studyHours}
                      onChange={(e) => setStudyHours(parseInt(e.target.value))}
                      min="1"
                      max="12"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleGenerateStudyPlan}
                disabled={loading}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 mb-4"
              >
                {loading ? <Loader className="inline animate-spin mr-2" size={18} /> : null}
                Generate Study Plan
              </button>

              {studyPlan && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-[#0B2C59] mb-2">Your Study Plan:</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{studyPlan}</div>
                </div>
              )}
            </div>
          )}

          {/* Generate Notes */}
          {activeTool === 'notes' && (
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Generate Study Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <input
                    type="text"
                    value={noteTopic}
                    onChange={(e) => setNoteTopic(e.target.value)}
                    placeholder="e.g., Cell Biology, World War II..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Detail Level</label>
                  <select
                    value={noteDetailLevel}
                    onChange={(e) => setNoteDetailLevel(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                  >
                    <option value="basic">Basic</option>
                    <option value="medium">Medium</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerateNotes}
                disabled={loading}
                className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 mb-4"
              >
                {loading ? <Loader className="inline animate-spin mr-2" size={18} /> : null}
                Generate Notes
              </button>

              {generatedNotes && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-[#0B2C59] mb-2">Generated Notes:</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{generatedNotes}</div>
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

