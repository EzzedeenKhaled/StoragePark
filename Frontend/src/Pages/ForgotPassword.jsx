import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword } = useUserStore();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await forgotPassword(email);
        if (res === 200) {
            navigate('/verify-email', { state: { email, from: "forgot-password" } });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ff9800] to-white p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9b87f5]/10 mb-4">
                        <Mail className="w-8 h-8 text-[#ff9800]" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Your Password?</h1>
                    <p className="text-gray-600">No problem. Provide your email, and we'll send you a code to reset it securely.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff9800] focus:border-transparent transition-all"
                            placeholder="Enter your email"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#ff9800] text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
                    >
                        Reset Password
                    </button>
                </form>


                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-[#ff9800] font-medium transition-colors"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;



