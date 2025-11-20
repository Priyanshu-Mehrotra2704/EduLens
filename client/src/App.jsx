import './App.css'
import Dashboard1 from './admin_pages/Dashboard'
import Dashboard2 from './user_pages/Dashboard'
import Login from './authentication_pages/Login'
import Register from './authentication_pages/Register'
import {Navigate, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to = "/login"/>} />
        <Route path="/dashboard" element={<Dashboard1 />} />
        <Route path="/admin_dashboard" element={<Dashboard2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
    </>
  )
}

export default App
