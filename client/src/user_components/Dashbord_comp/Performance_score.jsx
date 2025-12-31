import React, { useState, useEffect } from 'react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { API_ENDPOINTS } from '../../config'

const Performance_score = () => {
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [averageScore, setAverageScore] = useState(0)

  useEffect(() => {
    fetchPerformance()
  }, [])

  const fetchPerformance = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.STUDENT.PERFORMANCE, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        // Process recent attempts for chart
        if (data.recentAttempts && data.recentAttempts.length > 0) {
          const chartData = data.recentAttempts.slice(0, 10).reverse().map((attempt, idx) => ({
            name: `Q${idx + 1}`,
            score: attempt.percentage
          }))
          setPerformanceData(chartData)
          
          // Calculate average
          const avg = data.recentAttempts.reduce((sum, a) => sum + a.percentage, 0) / data.recentAttempts.length
          setAverageScore(avg)
        } else {
          // Use performance data if available
          if (data.performances && data.performances.length > 0) {
            const avg = data.performances.reduce((sum, p) => sum + p.averageScore, 0) / data.performances.length
            setAverageScore(avg)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching performance:', error)
    } finally {
      setLoading(false)
    }
  }

  const data = performanceData.length > 0 ? performanceData : [
    { name: 'Q1', score: 0 },
    { name: 'Q2', score: 0 },
    { name: 'Q3', score: 0 }
  ]

  return (
    <div className='mb-2 border rounded-lg w-80 h-60 flex flex-col bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)]'>
      <div className='p-2 border-b'>
        <h1 className='text-xl font-semibold text-[#207dff]'>Performance Score</h1>
        {!loading && averageScore > 0 && (
          <p className='text-sm text-gray-600'>Average: {averageScore.toFixed(1)}%</p>
        )}
      </div>
      <div className="w-full h-full mt-2 ml-4 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ResponsiveContainer width="90%" height="100%" className="outline-none">
            <LineChart data={data}>
              <XAxis dataKey="name" tickLine={false} fontSize={10} />
              <YAxis domain={[0, 100]} fontSize={10} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#207dff"
                strokeWidth={2}
                dot={{ r: 4, fill: '#207dff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default Performance_score