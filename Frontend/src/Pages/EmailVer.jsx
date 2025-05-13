import { useRef, useState, useEffect } from "react";
import "../assets/Styles/EmailVer.css";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PasswordConfirmForm from "./PasswordConfirmForm"; 
import { useUserStore } from "../stores/useUserStore";

const EmailVerification = () => {
  const { setUser } = useUserStore();
  const location = useLocation();
  const email = location.state?.email || null;
  const from = location.state?.from || null;
  console.log("Email:", from);
  const navigate = useNavigate();
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);
  console.log("em: ",from)
  const [code, setCode] = useState(["", "", "", "", "", ""]); // State for storing the code
  const inputRefs = useRef([]); // Refs for managing focus between input fields
  const [isVerified, setIsVerified] = useState(false); // State to track verification status
  const [showModal, setShowModal] = useState(false);
 // Hook for navigation

  // Handle input changes
  const handleChange = (index, value) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split(""); // Take only the first 6 characters
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || ""; // Fill the array with pasted characters
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((char) => char !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace key to move focus backward
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move focus to the previous input field
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = code.join("").toUpperCase();
    try {
      let response = null;
      if (email && from === "customer-register") {
        response = await axios.post("/auth/verify-email", { token });
        toast.success(response.data.message);
      } else if (email && (from === "forgot-password" || from === "login")) {
        response = await axios.post("/auth/verify-code", { token, email });
        toast.success(response.data.message);
      }
      console.log("Response:", response);
      if (response?.data?.data.role === "customer" && from === "customer-register" || from === "login") {
        navigate("/ecommerce");
      } else if (response?.data?.data.role === "partner") {
        setShowModal(true);
      }

      setIsVerified(true);
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error("Failed to verify email. Please try again.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="email-verification-container">
      {showModal && (
        <div className="fixed inset-0 bg-[#f4f4f4] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl border border-orange-200">
            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Registration Submitted</h3>
            <p className="text-gray-600 mb-6">
              Thank you for placing your trust in us. We will review your registration and send you your acceptance via email.
            </p>
            <button
              onClick={handleModalClose}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="container4">
        {/* Main Content */}
        {!isVerified &&
          <div className="header">
            <h2>{email ? "Verify the Code Sent to Your Email" : "Verify Your Email"}</h2>
            <p>Enter the 6-digit code {email ? `sent to ${email}` : "sent to your email address"}.</p>
          </div>
        }
        {!isVerified ? (
          <form className="form" onSubmit={handleSubmit}>
            {/* Input Fields for the 6-Digit Code */}
            <div className="input-group">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)} // Assign refs dynamically
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="input-field"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={code.some((digit) => !digit)}
              className="submit-button"
            >
              {email ? "Verify Code" : "Verify Email"}
            </button>
          </form>
        ) : (
          from === "forgot-password" && <PasswordConfirmForm email={email} />
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
