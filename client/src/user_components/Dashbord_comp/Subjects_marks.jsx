import React, { useState, useEffect } from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { API_ENDPOINTS } from '../../config'

const Subjects_marks = () => {
    const [subjectData, setSubjectData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSubjectWiseData()
    }, [])

    const fetchSubjectWiseData = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.STUDENT.PERFORMANCE, {
                credentials: 'include'
            })
            const data = await response.json()
            
            if (data.success) {
                // Use subject-wise data from backend if available
                if (data.subjectWiseData && data.subjectWiseData.length > 0) {
                    const chartData = data.subjectWiseData.map(item => ({
                        name: item.subject.length > 12 ? item.subject.substring(0, 12) + '...' : item.subject,
                        fullName: item.subject,
                        score: Math.round(item.averageScore),
                        count: item.totalQuizzes,
                        maxScore: item.maxScore,
                        minScore: item.minScore
                    }))
                    setSubjectData(chartData)
                } else {
                    // Fallback: Calculate from attempts if subjectWiseData not available
                    const subjectScores = {}
                    
                    // Process recent attempts
                    if (data.recentAttempts && data.recentAttempts.length > 0) {
                        data.recentAttempts.forEach(attempt => {
                            const subject = attempt.quizId?.subject || 'General'
                            if (!subjectScores[subject]) {
                                subjectScores[subject] = { total: 0, count: 0 }
                            }
                            subjectScores[subject].total += attempt.percentage
                            subjectScores[subject].count += 1
                        })
                    }

                    // Process performance records if available
                    if (data.performances && data.performances.length > 0) {
                        data.performances.forEach(perf => {
                            const subject = perf.subject || 'General'
                            if (!subjectScores[subject]) {
                                subjectScores[subject] = { total: 0, count: 0 }
                            }
                            subjectScores[subject].total += perf.averageScore || 0
                            subjectScores[subject].count += 1
                        })
                    }

                    // Convert to chart data format
                    const chartData = Object.keys(subjectScores).map(subject => ({
                        name: subject.length > 12 ? subject.substring(0, 12) + '...' : subject,
                        fullName: subject,
                        score: Math.round(subjectScores[subject].total / subjectScores[subject].count),
                        count: subjectScores[subject].count
                    })).sort((a, b) => b.score - a.score)

                    setSubjectData(chartData)
                }
            }
        } catch (error) {
            console.error('Error fetching subject-wise data:', error)
            // Set empty data on error
            setSubjectData([])
        } finally {
            setLoading(false)
        }
    }

    // Color function based on score
    const getColor = (score) => {
        if (score >= 80) return '#10b981' // green
        if (score >= 60) return '#f59e0b' // yellow
        return '#ef4444' // red
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold text-[#0B2C59]">{data.fullName}</p>
                    <p className="text-sm text-gray-600">Average Score: <span className="font-bold">{data.score}%</span></p>
                    <p className="text-xs text-gray-500">Quizzes Taken: {data.count}</p>
                    {data.maxScore !== undefined && data.minScore !== undefined && (
                        <>
                            <p className="text-xs text-green-600">Best: {data.maxScore}%</p>
                            <p className="text-xs text-red-600">Lowest: {data.minScore}%</p>
                        </>
                    )}
                </div>
            )
        }
        return null
    }

    // Default data if no data available
    const displayData = subjectData.length > 0 ? subjectData : [
        { name: 'No Data', score: 0, fullName: 'No quizzes taken yet', count: 0 }
    ]

    return (
        <div className='mb-2 border rounded-lg w-full h-full flex flex-col items-center justify-center bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)] p-4'>
            <h1 className='text-2xl font-semibold mb-4 text-[#d81316]'>
                Subject-Wise Analysis
            </h1>

            {loading ? (
                <div className="w-full flex items-center justify-center h-[350px]">
                    <div className="w-8 h-8 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : subjectData.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center h-[350px] text-gray-500">
                    <p className="text-lg mb-2">No subject data available</p>
                    <p className="text-sm">Take some quizzes to see your subject-wise performance</p>
                </div>
            ) : (
                <div className="w-full lg:h-[350px] h-[250px] mt-4">
                    <ResponsiveContainer width="100%" height="100%" className="outline-none">
                        <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="name" 
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis 
                                domain={[0, 100]} 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            
                            <Bar 
                                dataKey="score" 
                                barSize={40} 
                                radius={[5, 5, 0, 0]}
                            >
                                {displayData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}

export default Subjects_marks
