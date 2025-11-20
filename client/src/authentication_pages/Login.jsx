import React from 'react';
import image1 from '../authentication_pages/login.png';
import image2 from '../assets/edulens_logo1.png';
import {MailIcon, Lock} from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
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

        <h1 className='text-3xl font-bold mb-8 lg:block md:hidden sm:hidden text-[#207dff] text-shadow-[5px_5px_5px_rgba(0,191,255,1)]'>Login</h1>
        <img 
          src={image2} 
          alt="Edulens Logo" 
          className='object-contain md:h-40 md:w-70 lg:hidden sm:h-40 sm:w-70' 
        />
        
        <form className='flex flex-col w-full max-w-sm md:max-w-md' method='POST'>

          <label 
            htmlFor="email" 
            className='border-b p-3 mb-4 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors shadow-[5px_5px_10px_rgba(0,191,255,1)]' required
          >
            <MailIcon className='mr-3 text-[#207dff]' size={20} />
            <input 
              type="email" 
              id="email"
              placeholder='Email' 
              className='outline-none w-full text-base placeholder-gray-400' required
            />
          </label>

          <label 
            htmlFor="password" 
            className='shadow-[5px_5px_10px_rgba(0,191,255,1)] border-b p-3 mb-6 flex items-center border-[#207dff] focus-within:border-blue-700 transition-colors'
          >
            <Lock className='mr-3 text-[#207dff]' size={20} />
            <input 
              type="password" 
              id="password"
              placeholder='Password' 
              className='outline-none w-full text-base placeholder-gray-400' 
            />
          </label>

          <button 
            type="submit" 
            className='cursor-pointer bg-[#207dff] text-white rounded-md p-3 font-semibold hover:bg-blue-600 transition-colors mt-2'
          >
            LogIn
          </button>
          <h2 className='font-tasa-orbiter pt-2 text-shadow-[5px_5px_5px_rgba(0,191,255,1)]'>Don't have an account? <Link to='/register' className='text-blue-500 cursor-pointer'>Register</Link></h2>
        </form>
      </div>
    </div>
  );
};

export default Login;