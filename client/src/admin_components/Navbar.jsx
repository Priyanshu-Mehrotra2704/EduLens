import React from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      })
      localStorage.removeItem('name')
      localStorage.removeItem('role')
      navigate('/login')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <div className='p-2 items-center flex justify-between '>
        <h1 className='drop-shadow- font-tasa-orbiter ml-2 font-semibold text-[20px] text-shadow-2xl'>{localStorage.getItem('name') ? `Welcome, ${localStorage.getItem('name')}` : 'Welcome'}</h1>
        <h2 
          className='font-monteserrat mr-5 text-[#0B2C59] hover:text-red-700 text-[18px] font-bold cursor-pointer'
          onClick={handleLogout}
        >
          Logout
        </h2>
    </div>
  )
}

export default Navbar