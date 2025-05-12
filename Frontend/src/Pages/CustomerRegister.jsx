import '../assets/Styles/RegisterC.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserPlus, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
const Register = () => {
    const [errorMessage] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        role: "customer",
    });

    const navigate = useNavigate();
    const { user, signup, loading } = useUserStore();
    useEffect(() => {
        if (user && user.isVerified) {
            if (user.role === "customer") {
                navigate("/ecommerce");
            } else if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "partner") {
                navigate("/partner-dashboard");
            }
        }
    },[]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate inputs before submitting
            if (!validateInputs()) return;

            const res = await signup(formData);
            console.log("res", res);
            if(res === 400){
                toast.error("User already exists");
                return;
            }
            navigate("/verify-email", { 
                state: { 
                  email: formData.email, 
                  from: "customer-register" 
                } 
              });
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const validateInputs = () => {
        const { firstName, lastName, email, phone, password } = formData;

        // Validate first name and last name (only letters)
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(firstName.trim())) {
            toast.error("First name should only contain letters.");
            return false;
        }
        if (!nameRegex.test(lastName.trim())) {
            toast.error("Last name should only contain letters.");
            return false;
        }

        // Validate email (only Gmail or Yahoo domains)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
        if (!emailRegex.test(email.trim())) {
            toast.error("Email must be from Gmail or Yahoo domains.");
            return false;
        }

        // Validate phone number (exactly 8 digits)
        const phoneRegex = /^[0-9]{8}$/;
        if (!phoneRegex.test(phone.trim())) {
            toast.error("Phone number must be exactly 8 digits.");
            return false;
        }

        // Validate password (minimum 8 characters, at least one letter, one number, and one special character)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password.trim())) {
            toast.error("Password must be at least 8 characters long, include letters, numbers, and one special character.");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Real-time validation for specific fields
        if (name === "firstName" || name === "lastName") {
            // Only allow letters for first name and last name
            if (/^[A-Za-z]*$/.test(value) || value === "") {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        } else if (name === "phone") {
            // Only allow numbers for phone number and limit to 8 digits
            if (/^[0-9]*$/.test(value) && value.length <= 8) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    return (
        <div className='RegisterPage'>
            <div className='registerComponent'>
                <div className='leftSide'>
                    <Link to='/'><img src='/logo.png' alt="Logo" /></Link>
                </div>
                <div className='rightSide'>
                    <div className="form_header">
                        <div className='formtitle'>Sign Up</div>
                        <div className='formSubTitle'>Join Storage Park and start managing your space today!</div>
                    </div>
                    <div className="form_body">
                        <form className='registerForm' onSubmit={handleSubmit}>
                            <div className="name_fields">
                                <div className="text_field">
                                    <label>First Name*</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        onChange={handleChange}
                                        value={formData.firstName}
                                    />
                                </div>
                                <div className="text_field">
                                    <label>Last Name*</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        onChange={handleChange}
                                        value={formData.lastName}
                                    />
                                </div>
                            </div>
                            <div className="text_field">
                                <label>Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    onChange={handleChange}
                                    value={formData.email}
                                />
                            </div>
                            <div className="text_field">
                                <label>Phone Number*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    onChange={handleChange}
                                    value={formData.phone}
                                    maxLength={8} // Enforce max length in HTML as well
                                />
                            </div>
                            <div className="text_field">
                                <label>Password*</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    onChange={handleChange}
                                    value={formData.password}
                                />
                            </div>
                            <div className='error'>{errorMessage}</div>
                            <button
                                type='submit'
                                className='w-full flex justify-center py-2 px-4 border border-transparent
                                    rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out disabled:opacity-50 bg-[#1a1a1a] cursor-pointer hover:bg-[#333]'
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                                        Sign up
                                    </>
                                )}
                            </button>
                            <div className="form_bottom">
                                Already have an account? <Link className='linkBtn' to="/login">Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;