import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
const PasswordConfirmForm = ({email}) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { resetPassword } = useUserStore();
    const handleSubmit =  async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            setError("Please fill in both password fields");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        const res = await resetPassword(password, confirmPassword, email);
        if (res === 200) {
            navigate("/login");
        }
        // Handle successful password confirmation
        console.log("Passwords match!");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header for Password Confirmation */}
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Password Confirmation</h2>
            </div>

            <div className="space-y-4">
                {/* Password Input */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2   focus:ring-orange-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                {/* Password match indication */}
                {confirmPassword.length > 0 && !error && (
                    <p className={`text-sm ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {password === confirmPassword
                            ? "Passwords match! ✓" : "Passwords do not match ✗"}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-[#ff9800] text-white py-2 rounded-md hover:bg-orange-600 transition-colors cursor-pointer"
            >
                Confirm Password
            </button>
        </form>
    );
};

export default PasswordConfirmForm;
