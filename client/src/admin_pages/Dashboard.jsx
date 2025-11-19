import React from 'react'
import Navbar from '../admin_components/Navbar'
import Sidebar from '../admin_components/Sidebar.jsx'

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