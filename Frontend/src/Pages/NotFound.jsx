import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return ( <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="text-center px-4 lg:px-0">
      <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
      <div className="w-16 h-1 mx-auto bg-[#ff9800] mb-8" />
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/"
        className="inline-block px-8 py-3 text-lg font-medium text-white bg-[#ff9800] rounded-lg transition-transform duration-200 ease-in-out hover:-translate-y-1"
      >
        Return Home
      </Link>
    </div>
    <div className="mt-8 text-gray-500">
      {location.pathname !== "/" && (
        <p>Attempted path: {location.pathname}</p>
      )}
    </div>
  </div>
);
};

export default NotFound;