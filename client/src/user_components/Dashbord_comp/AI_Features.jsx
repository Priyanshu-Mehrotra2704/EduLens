import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MessageCircle, BookOpen, FileText, Calendar, Lightbulb } from 'lucide-react'

const AI_Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Study Buddy',
      description: 'Chat with AI to get instant help with your studies',
      path: '/ai-buddy',
      color: 'from-[#207dff] to-[#0fc6b4]'
    },
    {
      icon: BookOpen,
      title: 'AI Tools',
      description: 'Flashcards, explanations, study plans, and more',
      path: '/ai-tools',
      color: 'from-[#0fc6b4] to-[#ad31af]'
    },
    {
      icon: FileText,
      title: 'Smart Summarization',
      description: 'Convert long notes into concise summaries',
      path: '/summerize',
      color: 'from-[#ad31af] to-[#207dff]'
    },
    {
      icon: Lightbulb,
      title: 'AI Quiz Generator',
      description: 'Generate quizzes automatically from your notes',
      path: '/notesquiz',
      color: 'from-[#207dff] to-[#0fc6b4]'
    }
  ]

  return (
    <div className='border rounded-lg w-full bg-white shadow-[5px_5px_10px_rgba(0,0,0,0.6)]'>
      <div className='p-4 border-b'>
        <h1 className='text-2xl font-semibold text-[#207dff] flex items-center gap-2'>
          <Sparkles size={24} />
          AI-Powered Features
        </h1>
      </div>
      <div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <Link
              key={idx}
              to={feature.path}
              className='p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r hover:scale-105'
            >
              <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-full w-fit mb-3`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className='font-semibold text-[#0B2C59] mb-2'>{feature.title}</h3>
              <p className='text-sm text-gray-600'>{feature.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default AI_Features

