import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { handleSuccess, handleError } from '../utils';
import { API_ENDPOINTS } from '../config';
import { ToastContainer } from 'react-toastify';
import image2 from '../assets/edulens_logo1.png';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      handleError('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        handleSuccess('Email verified! You can now log in.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to verify email');
        handleError(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setStatus('error');
      setMessage('Network error. Please try again later.');
      handleError('Network error. Please check your connection.');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50'>
      <img 
        src={image2} 
        alt="Edulens Logo" 
        className='object-contain h-32 mb-8' 
      />

      <div className='bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200'>
        {status === 'verifying' && (
          <div className='text-center'>
            <Loader className='w-16 h-16 text-[#207dff] mx-auto mb-4 animate-spin' />
            <h2 className='text-2xl font-bold text-[#0B2C59] mb-2'>Verifying Email</h2>
            <p className='text-gray-600'>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className='text-center'>
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-[#0B2C59] mb-2'>Email Verified!</h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <p className='text-sm text-gray-500 mb-4'>Redirecting to login page...</p>
            <Link
              to='/login'
              className='inline-block bg-[#207dff] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors'
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className='text-center'>
            <XCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-[#0B2C59] mb-2'>Verification Failed</h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <div className='flex gap-4 justify-center'>
              <Link
                to='/register'
                className='bg-[#207dff] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors'
              >
                Register Again
              </Link>
              <Link
                to='/login'
                className='bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors'
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default VerifyEmail;

