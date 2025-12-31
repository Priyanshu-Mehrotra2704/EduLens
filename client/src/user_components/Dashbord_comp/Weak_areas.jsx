import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { API_ENDPOINTS } from '../../config'

const Weak_areas = () => {
  const [weakAreas, setWeakAreas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeakAreas()
  }, [])

  const fetchWeakAreas = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENT.RECOMMENDATIONS, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success && data.recommendations.weakAreas) {
        setWeakAreas(data.recommendations.weakAreas)
      }
    } catch (error) {
      console.error('Error fetching weak areas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mb-2 border rounded-lg w-80 h-60 flex flex-col bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)] overflow-y-auto'>
      <div className='p-4 border-b'>
        <h1 className='text-xl font-semibold text-[#207dff] flex items-center gap-2'>
          <AlertCircle size={20} />
          Weak Areas
        </h1>
      </div>
      <div className='p-4 flex-1 overflow-y-auto'>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : weakAreas.length > 0 ? (
          <div className='space-y-3'>
            {weakAreas.map((area, idx) => (
              <div key={idx} className='border-l-4 border-red-500 pl-3'>
                <p className='font-semibold text-gray-800'>{area.subject}</p>
                <p className='text-sm text-gray-600'>Average Score: {area.averageScore.toFixed(1)}%</p>
                <div className='mt-2 w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-red-500 h-2 rounded-full'
                    style={{ width: `${area.averageScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-500 text-sm'>No weak areas identified yet. Keep up the great work! 🎉</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Weak_areas