import React from 'react'
import Navbar from '../user_components/Navbar'
import Sidebar from '../user_components/Sidebar.jsx'
import Performance_score from '../user_components/Dashbord_comp/Performance_score.jsx'
import Weak_areas from '../user_components/Dashbord_comp/Weak_areas.jsx'
import AI_suggestions from '../user_components/Dashbord_comp/AI_suggestions.jsx'
import Subjects_marks from '../user_components/Dashbord_comp/Subjects_marks.jsx'
import AvailableQuizzes from '../user_components/Dashbord_comp/AvailableQuizzes.jsx'
import AI_Features from '../user_components/Dashbord_comp/AI_Features.jsx'

const Dashboard = () => {
  return (
    <div>
        <div className="flex">
            <div className=""><Sidebar/></div>
            <div className="w-screen">
                <Navbar />
                <div className='p-4 mt-4 flex flex-row justify-around flex-wrap'>
                  {/* Main content for user dashboard goes here */}
                    <div><Performance_score /></div>
                    <div><Weak_areas /></div>
                    <div><AI_suggestions /></div>
                </div>
                <div className='m-3'><AI_Features /></div>
                <div className='m-3'><Subjects_marks /></div>
                <div className='m-3'><AvailableQuizzes /></div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard