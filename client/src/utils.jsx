import {toast} from 'react-toastify';

const handleSuccess = (message, data) => {
  toast.success(message,{
    position: "top-center"
  });
  console.log('Success data:', data);
};

const handleError = (message) => {
  toast.error(message,{
    position: "top-center"
  });
};

export { handleSuccess, handleError };