import React, { useState, useEffect, useRef } from 'react';
import image1 from '../authentication_pages/login.png';
import image2 from '../assets/edulens_logo1.png';
import { User, MailIcon, Lock, UserCheckIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
    role: 'user'
  });

  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const startVerificationCheck = (email) => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `https://edu-lens-red.vercel.app/api/check-verification?email=${email}`
        );
        const data = await res.json();

        if (data.verified === true) {
          clearInterval(intervalRef.current);
          handleSuccess('Email verified! You can now log in.');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error checking verification status:', err);
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registerData.name || !registerData.email || !registerData.password) {
      handleError('Name, email, and password are required');
      return;
    }

    const dataToSend = {
      ...registerData,
      role:
        registerData.adminCode === 'A1B2C3987654321'
          ? 'admin'
          : 'user'
    };

    try {
      const response = await fetch('https://edu-lens-red.vercel.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        startVerificationCheck(registerData.email);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className='flex flex-col lg:flex-row justify-center lg:justify-start min-h-screen'>

      <div className='hidden md:flex flex-col md:w-1/2 lg:w-1/2 h-full'>
        <img 
          src={image1} 
          alt="Login Graphic" 
          className='object-cover w-[50vw] h-screen hidden lg:block' 
        />
      </div>

      <div className='flex flex-col justify-center items-center w-full lg:w-1/2 min-h-screen lg:min-h-0 p-4'>

        <h1 className='text-3xl font-bold mb-8 lg:block md:hidden sm:hidden text-[#207dff] text-shadow-[5px_5px_5px_rgba(0,191,255,1)]'>
          Register
        </h1>

        <img 
          src={image2} 
          alt="Edulens Logo" 
          className='object-contain md:h-40 md:w-70 lg:hidden sm:h-40 sm:w-70' 
        />

        <form className='flex flex-col w-full max-w-sm md:max-w-md' onSubmit={handleSubmit}>

          {/* NAME */}
          <label className='border-b p-3 mb-4 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors shadow-[5px_5px_10px_rgba(0,191,255,1)]'>
            <User className='mr-3 text-[#207dff]' size={20} />
            <input 
              type="text"
              name="name"
              value={registerData.name}
              onChange={handleChange}
              placeholder='Username'
              className='outline-none w-full text-base placeholder-gray-400'
              required
            />
          </label>

          {/* EMAIL */}
          <label className='border-b p-3 mb-4 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors shadow-[5px_5px_10px_rgba(0,191,255,1)]'>
            <MailIcon className='mr-3 text-[#207dff]' size={20} />
            <input 
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              placeholder='Email'
              className='outline-none w-full text-base placeholder-gray-400'
              required
            />
          </label>

          {/* PASSWORD */}
          <label className='shadow-[5px_5px_10px_rgba(0,191,255,1)] border-b p-3 mb-6 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors'>
            <Lock className='mr-3 text-[#207dff]' size={20} />
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              placeholder='Password'
              className='outline-none w-full text-base placeholder-gray-400'
              required
            />
          </label>

          {/* ADMIN CODE */}
          <label className='shadow-[5px_5px_10px_rgba(0,191,255,1)] border-b p-3 mb-6 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors'>
            <UserCheckIcon className='mr-3 text-[#207dff]' size={20} />
            <input 
              type="text"
              name="adminCode"
              value={registerData.adminCode}
              onChange={handleChange}
              placeholder='Admin Code (Optional)'
              className='outline-none w-full text-base placeholder-gray-400'
            />
          </label>

          <button 
            type="submit" 
            className='cursor-pointer bg-[#207dff] text-white rounded-md p-3 font-semibold hover:bg-blue-600 transition-colors mt-2'
          >
            Register
          </button>

          <h2 className='font-tasa-orbiter pt-2 text-shadow-[5px_5px_5px_rgba(0,191,255,1)]'>
            Already Have An Account?{" "}
            <Link to="/login" className='text-blue-500'>Login</Link>
          </h2>

        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
