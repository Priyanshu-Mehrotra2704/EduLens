import React from 'react'
import Navbar from '../user_components/Navbar'
import Sidebar from '../user_components/Sidebar.jsx'
const Dashboard = () => {
  return (
    <div>
        <div className="flex">
            <Sidebar />
            <div className="w-screen">
                <Navbar />
            </div>
        </div>
    </div>
  )
}

export default Dashboard