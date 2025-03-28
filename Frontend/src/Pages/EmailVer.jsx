import { useRef, useState } from "react";
import "../assets/Styles/EmailVer.css";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // State for storing the code
  const inputRefs = useRef([]); // Refs for managing focus between input fields

  // Handle input changes
  const handleChange = (index, value) => {
    // Allow only numeric input
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split(""); // Take only the first 6 digits
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || ""; // Fill the array with pasted digits
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value; // Update the specific input field
      setCode(newCode);

      // Move focus to the next input field if a value is entered
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
    const token = code.join(""); // Combine the digits into a single string

    try {
      const response = await axios.post("/auth/verify-email", { token });
      toast.success(response.data.message); // Show success message
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error("Failed to verify email. Please try again.");
    }
  };

  return (
    <div className="email-verification-container">
      <div className="container">
        {/* Main Content */}
        <div className="header">
          <h2>Verify Your Email</h2>
          <p>Enter the 6-digit code sent to your email address.</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {/* Input Fields for the 6-Digit Code */}
          <div className="input-group">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)} // Assign refs dynamically
                type="text"
                maxLength="1" // Restrict to one character per input
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
            disabled={code.some((digit) => !digit)} // Disable button if any field is empty
            className="submit-button"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;