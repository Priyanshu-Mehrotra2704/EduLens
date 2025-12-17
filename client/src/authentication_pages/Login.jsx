import React from 'react';
import image1 from '../authentication_pages/login.png';
import image2 from '../assets/edulens_logo1.png';
import { MailIcon, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [login, setLogin] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLogin = { ...login };
    copyLogin[name] = value;
    setLogin(copyLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = login;
    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const url = `https://edu-lens-ten.vercel.app/api/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(login)
      });

      const data = await response.json();
      const { success, message} = data;

      if (success && data.role === 'admin') {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/admin_dashboard');
          localStorage.setItem('name', data.name);
        }, 1500);
      }
      else if (success) {
        handleSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
          localStorage.setItem('name', data.name);
        }, 1500);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error.message || 'Login failed');
    }
  };

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
          Login
        </h1>

        <img 
          src={image2} 
          alt="Edulens Logo" 
          className='object-contain md:h-40 md:w-70 lg:hidden sm:h-40 sm:w-70' 
        />

        <form
          className='flex flex-col w-full max-w-sm md:max-w-md'
          method='POST'
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}
          <label 
            htmlFor="email" 
            className='border-b p-3 mb-4 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors shadow-[5px_5px_10px_rgba(0,191,255,1)]'
          >
            <MailIcon className='mr-3 text-[#207dff]' size={20} />
            <input 
              type="email"
              id="email"
              name="email"
              value={login.email}
              onChange={handleChange}
              placeholder='Email'
              className='outline-none w-full text-base placeholder-gray-400'
              required
            />
          </label>

          {/* PASSWORD */}
          <label 
            htmlFor="password" 
            className='shadow-[5px_5px_10px_rgba(0,191,255,1)] border-b p-3 mb-6 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors'
          >
            <Lock className='mr-3 text-[#207dff]' size={20} />
            <input 
              type="password"
              id="password"
              name="password"
              value={login.password}
              onChange={handleChange}
              placeholder='Password'
              className='outline-none w-full text-base placeholder-gray-400'
              required
            />
          </label>

          <button 
            type="submit" 
            className='cursor-pointer bg-[#207dff] text-white rounded-md p-3 font-semibold hover:bg-blue-600 transition-colors mt-2'
          >
            LogIn
          </button>

          <h2 className='font-tasa-orbiter pt-2 text-shadow-[5px_5px_5px_rgba(0,191,255,1)]'>
            Don't have an account?{" "}
            <Link to='/register' className='text-blue-500 cursor-pointer'>
              Register
            </Link>
          </h2>

        </form>
      </div>

      <ToastContainer/>
    </div>
  );
};

export default Login;
