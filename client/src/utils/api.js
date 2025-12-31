import { API_ENDPOINTS } from '../config';

// Helper function for API calls with error handling
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default apiCall;

