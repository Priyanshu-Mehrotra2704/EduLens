import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../user_components/Navbar'
import Sidebar from '../user_components/Sidebar.jsx'
import { API_ENDPOINTS, FILE_BASE_URL } from '../config'
import { handleError } from '../utils'
import { ToastContainer } from 'react-toastify'
import { FileText, BookOpen, User, Search, Filter, Eye, Calendar, Download } from 'lucide-react'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [selectedNote, setSelectedNote] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    filterNotes()
  }, [searchTerm, filterSubject, notes])

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENT.NOTES, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setNotes(data.notes || [])
        setFilteredNotes(data.notes || [])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
      handleError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  const filterNotes = () => {
    let filtered = [...notes]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Subject filter
    if (filterSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === filterSubject)
    }

    setFilteredNotes(filtered)
  }

  const subjects = [...new Set(notes.map(n => n.subject).filter(Boolean))]

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

  if (selectedNote) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="w-screen">
          <Navbar />
          <div className="p-6">
            <button
              onClick={() => setSelectedNote(null)}
              className="mb-4 text-[#207dff] hover:underline font-semibold"
            >
              ← Back to Notes
            </button>
            <div className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
              <div className="mb-4 pb-4 border-b">
                <h1 className="text-3xl font-bold text-[#0B2C59] mb-2">{selectedNote.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {selectedNote.subject && (
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} />
                      {selectedNote.subject}
                    </span>
                  )}
                  {selectedNote.uploadedBy && (
                    <span className="flex items-center gap-1">
                      <User size={16} />
                      By {selectedNote.uploadedBy.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(selectedNote.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
                  {selectedNote.fileUrl && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#0B2C59] mb-1">Original File Available</p>
                          <p className="text-xs text-gray-600">
                            {selectedNote.originalFileName || selectedNote.fileUrl.split('/').pop()}
                          </p>
                        </div>
                        <a
                          href={`${FILE_BASE_URL}${selectedNote.fileUrl}`}
                          download={selectedNote.originalFileName || selectedNote.fileUrl.split('/').pop()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Download size={18} />
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedNote.summary && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h2 className="font-semibold text-[#0B2C59] mb-2">Summary</h2>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedNote.summary}</p>
                    </div>
                  )}

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-[#0B2C59] mb-4">Content</h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedNote.content}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#0B2C59] mb-6">Study Notes</h1>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] mb-6 border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207dff]"
                />
              </div>
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
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border text-center">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No notes found</p>
              <p className="text-sm text-gray-400 mt-2">
                {notes.length === 0
                  ? "No notes available at the moment. Teachers will upload notes for you to study."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-6 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-[#0B2C59] flex-1">{note.title}</h3>
                    <Eye className="text-gray-400" size={20} />
                  </div>

                  {note.summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.summary}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {note.subject && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen size={16} />
                        <span>{note.subject}</span>
                      </div>
                    )}
                    {note.uploadedBy && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={16} />
                        <span>By {note.uploadedBy.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    {note.fileUrl && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileText size={16} />
                        <span>File Available</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedNote(note)
                      }}
                      className="flex-1 bg-gradient-to-r from-[#207dff] to-[#0fc6b4] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      View
                    </button>
                    {note.fileUrl && (
                      <a
                        href={`${FILE_BASE_URL}${note.fileUrl}`}
                        download={note.originalFileName || note.fileUrl.split('/').pop()}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-[5px_5px_10px_rgba(0,0,0,0.6)] border">
            <p className="text-sm text-gray-600">
              Showing {filteredNotes.length} of {notes.length} notes
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Notes

