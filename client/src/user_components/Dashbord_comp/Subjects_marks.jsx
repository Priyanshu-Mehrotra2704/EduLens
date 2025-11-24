import React from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Subjects_marks = () => {
    const data = [
        { name: 'Jan', score: 75 },
        { name: 'Feb', score: 80 },
        { name: 'Mar', score: 78 },
        { name: 'Apr', score: 78 },
        { name: 'May', score: 70 },
        { name: 'Jun', score: 15 },
    ];

    return (
        <div className='mb-2 border rounded-lg w-full h-full flex flex-col items-center justify-center bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)]'>
            
            <h1 className='text-2xl font-semibold mb-4 text-[#d81316]'>
                Subject-Wise Analysis
            </h1>

            <div className="w-full h-[300px] mt-8 mr-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} />
                        <YAxis />
                        <Tooltip />
                        
                        <Bar 
                            dataKey="score" 
                            fill="#207dff" 
                            barSize={40} 
                            radius={[5, 5, 0, 0]} 
                            label={{ position: "right", fill: "#0B2C59", fontSize: 12 }} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default Subjects_marks;
