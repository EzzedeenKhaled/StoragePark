import '../assets/Styles/RegisterP1.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore"; 

const RegisterPartner = () => {
    // const [errorMessage] = useState("");
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
            const response = await signup_Next(formData);
            // console.log(response.status)
            if (response.status === 400) {
                alert("User already exists");
                return;
            }

            navigate("/register-partner-2");
    
        } catch (error) {
            console.error("Error checking signup:", error);
            alert("Something went wrong. Please try again.");
        }
    };
                                 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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
                                    type="url"
                                    name="website"
                                    onChange={handleChange}
                                    value={formData.website}
                                />
                            </div>
                            <div className="text_field">
                                <label>Google Business Profile Access:</label>
                                <input 
                                    type="text"
                                    name="googleProfile"
                                    required
                                    onChange={handleChange}
                                    value={formData.googleProfile}
                                />
                            </div>
                            <button
                                type='submit'
                                className='w-full flex justify-center py-2 px-4 border border-transparent
                                    rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out disabled:opacity-50'
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
