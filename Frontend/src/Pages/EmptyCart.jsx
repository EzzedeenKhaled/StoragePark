import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/ecommerce"
          className="inline-block px-8 py-3 text-lg font-medium text-white bg-[#ff9800] rounded-lg transition-transform duration-200 ease-in-out hover:-translate-y-1"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;