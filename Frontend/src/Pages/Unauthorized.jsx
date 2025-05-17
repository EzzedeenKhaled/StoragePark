import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LockIcon from '../../components/LockIcon';

const Unauthorized = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    if (countdown === 0) {
      navigate('/');
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <LockIcon color="#ff9800" />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#ff9800' }}>Access Denied</h1>
        <div className="w-24 h-1 mx-auto my-4" style={{ backgroundColor: '#ff9800' }}></div>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="text-sm text-gray-500 mb-6">
          Redirecting to home in <span className="font-medium" style={{ color: '#ff9800' }}>{countdown}</span> seconds...
        </div>
        <button
          onClick={handleGoBack}
          className="w-full py-3 rounded-md font-medium text-white transition-all duration-300 hover:shadow-lg cursor-pointer"
          style={{ backgroundColor: '#ff9800' }}
        >
          Return to Home
        </button>
      </div>
      <div className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} StoragePark. All rights reserved.
      </div>
    </div>
  );
};

export default Unauthorized;