import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include', // IMPORTANT for cookies
      });
      localStorage.removeItem('name');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className='p-2 items-center flex justify-between sticky top-0 bg-white'>
        <h1 className='drop-shadow- font-tasa-orbiter ml-2 font-semibold text-[20px] text-shadow-2xl'>
          {localStorage.getItem('name') ? `Welcome Back, ${localStorage.getItem('name')}` : 'LOGIN'}
        </h1>
        <h2
          className='font-monteserrat mr-5 text-[#0B2C59] hover:text-red-700 text-[18px] font-bold cursor-pointer'
          onClick={handleLogout}
        >
          Logout
        </h2>
    </div>
  );
};

export default Navbar;
