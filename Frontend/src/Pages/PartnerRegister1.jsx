import '../assets/Styles/RegisterP1.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { toast } from 'react-hot-toast';

const RegisterPartner = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        googleProfile: "",
        role: "partner",
    });
    const { signup_Next, loading } = useUserStore();
    const navigate = useNavigate();

    const nextForm = async (e) => {
        e.preventDefault();
        try {
            // Validate inputs before submitting
            if (!validateInputs()) return;

            const response = await signup_Next(formData);
            if (response.status === 400) {
                toast.error("User already exists");
                return;
            }

            navigate("/register-partner-2");

        } catch (error) {
            console.error("Error checking signup:", error);
            // toast.error("Something went wrong. Please try again.");
        }
    };

    const validateInputs = () => {
        const { firstName, lastName, email, phone, companyName, website } = formData;

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

        // Validate company name (only letters and spaces)
        const companyNameTrimmed = companyName.trim().replace(/\s+/g, "").toLowerCase();
        if (!companyNameTrimmed) {
            toast.error("Company name is required.");
            return false;
        }

        // Ensure email contains the company domain
        const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${companyNameTrimmed}\\.com$`);

        if (!emailRegex.test(email.trim())) {
            toast.error(`Email must be in the format: example@${companyNameTrimmed}.com`);
            return false;
        }

        // Validate phone number (exactly 8 digits)
        const phoneRegex = /^[0-9]{8}$/;
        if (!phoneRegex.test(phone.trim())) {
            toast.error("Phone number must be exactly 8 digits.");
            return false;
        }

        // Validate website URL (must start with https:// and end with .com)
        const websiteRegex = /^https:\/\/[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|io|co|xyz|[a-zA-Z]{2,})$/;
        if (website && !websiteRegex.test(website.trim())) {
            toast.error("Website URL must start with https:// and end with a valid domain.");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Add real-time validation for specific fields
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
                        <form className='registerForm' onSubmit={nextForm}>
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
                                <label>Company Name*</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    required
                                    onChange={handleChange}
                                    value={formData.companyName}
                                />
                            </div>
                            <div className="text_field">
                                <label>Company Email*</label>
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
                                <label>Address*</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    onChange={handleChange}
                                    value={formData.address}
                                />
                            </div>
                            <div className="text_field">
                                <label>Website URL (If You Have):</label>
                                <input
                                    type="text"
                                    name="website"
                                    onChange={handleChange}
                                    value={formData.website}
                                />
                            </div>
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
                                        <ArrowRight className='mr-2 h-5 w-5' aria-hidden='true' />
                                        Next Step
                                    </>
                                )}
                            </button>
                            <div className="form_bottom">
                                Already have an account? <Link className='linkBtn' to="/Login">Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPartner;