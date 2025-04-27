import { useRef, useState } from "react";
import "../assets/Styles/EmailVer.css";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PasswordConfirmForm from "./PasswordConfirmForm"; // Import PasswordConfirmForm

const EmailVerification = () => {
  const location = useLocation();
  const email = location.state?.email || null;
  const [code, setCode] = useState(["", "", "", "", "", ""]); // State for storing the code
  const inputRefs = useRef([]); // Refs for managing focus between input fields
  const [isVerified, setIsVerified] = useState(false); // State to track verification status
  const navigate = useNavigate(); // Hook for navigation

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
      if (email) {
        response = await axios.post("/auth/verify-code", { token, email });
        toast.success(response.data.message);
      } else {
        response = await axios.post("/auth/verify-email", { token });
        toast.success(response.data.message);
      }

      if (response.data.data.role === "customer") {
        navigate("/ecommerce");
      } else if (response.data.data.role === "partner") {
        navigate("/partner-dashboard");
      }

      setIsVerified(true); // Set the email as verified when successful
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error("Failed to verify email. Please try again.");
    }
  };

  return (
    <div className="email-verification-container">
      
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
          <PasswordConfirmForm email={email} /> // Render PasswordConfirmForm once the email is verified
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
