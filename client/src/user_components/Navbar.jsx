import React from 'react'

const Navbar = () => {
  return (
    <div className='p-2 items-center flex justify-between sticky top-0 bg-white'>
        <h1 className='drop-shadow- font-tasa-orbiter ml-2 font-semibold text-[20px] text-shadow-2xl'>Welcome Back, Priyanshu</h1>
        <h2 className='font-monteserrat mr-5 text-[#0B2C59] hover:text-red-700 text-[18px] font-bold cursor-pointer'>Logout</h2>
    </div>
  )
}

export default Navbar