import React from 'react'
import { LineChart, Line,  ResponsiveContainer, XAxis, YAxis } from 'recharts';

const Performance_score = () => {
    const data = [
    { name: 'Jan', score: 75 },
    { name: 'Feb', score: 80 },
    { name: 'Mar', score: 78 },
];
  return (
    <div className='mb-2 border rounded-lg w-80 h-60 flex flex-col items-center justify-center bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)]' >
        <h1 className='text-xl font-semibold mt-2 font-tasa-orbiter text-[#207dff]'>Performance Score</h1>
                    <div className="w-full h-full mt-8 ml-8">
                      <ResponsiveContainer width="80%" height="100%" className="outline-none">
                        <LineChart data={data}>
                          <XAxis dataKey="name" tickLine={false}/>
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="red"
                            strokeWidth={1.5}
                            dot={{ r: 3 }}
                            label={{ position: "bottom", fill: "#207dff", fontSize: 12 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
    </div>
  )
}

export default Performance_score