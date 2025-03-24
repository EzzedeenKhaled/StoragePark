// src/Pages/Auth/RegisterPartner/index.jsx
import '../assets/Styles/RegisterP1.css';
import { Link } from "react-router-dom";
import { useState } from "react";

const RegisterPartner = () => {
    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [companyName, setCompanyName] = useState("");
    // const [email, setEmail] = useState("");
    // const [phone, setPhone] = useState("");
    // const [address, setAddress] = useState("");
    // const [website, setWebsite] = useState("");
    // const [googleProfile, setGoogleProfile] = useState("");
    const [errorMessage] = useState("");
    const [formData, setFormData] = useState({
		firstName: "",
        lastName: "",
        companyName:"",
        email:"",
        phone: "",
		address:"",
        website: "",
        googleProfile: "",
	});

    const submitForm = (e) => {
        e.preventDefault();
        console.log(formData);
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
                        <form className='registerForm' onSubmit={submitForm}>
                            <div className="name_fields">
                                <div className="text_field">
                                    <label>First Name*</label>
                                    <input 
                                        type="text" 
                                        required
                                        onChange={(e) => setFormData.firstName(e.target.value)}
                                        value={formData.firstName}
                                    />
                                </div>
                                <div className="text_field">
                                    <label>Last Name*</label>
                                    <input 
                                        type="text" 
                                        required
                                        onChange={(e) => setFormData.lastName(e.target.value)}
                                        value={formData.lastName}
                                    />
                                </div>
                            </div>
                            <div className="text_field">
                                <label>Company Name*</label>
                                <input 
                                    type="text" 
                                    required
                                    onChange={(e) => setFormData.companyName(e.target.value)}
                                    value={formData.companyName}
                                />
                            </div>
                            <div className="text_field">
                                <label>Company Email*</label>
                                <input 
                                    type="email" 
                                    required
                                    onChange={(e) => setFormData.email(e.target.value)}
                                    value={formData.email}
                                />
                            </div>
                            <div className="text_field">
                                <label>Phone Number*</label>
                                <input 
                                    type="tel" 
                                    required
                                    onChange={(e) => setFormData.phone(e.target.value)}
                                    value={formData.phone}
                                />
                            </div>
                            <div className="text_field">
                                <label>Address*</label>
                                <input 
                                    type="text" 
                                    required
                                    onChange={(e) => setFormData.address(e.target.value)}
                                    value={formData.address}
                                />
                            </div>
                            <div className="text_field">
                                <label>Website URL (If You Have):</label>
                                <input 
                                    type="url"
                                    onChange={(e) => setFormData.website(e.target.value)}
                                    value={formData.website}
                                />
                            </div>
                            <div className="text_field">
                                <label>Google Business Profile Access:</label>
                                <input 
                                    type="text"
                                    required
                                    onChange={(e) => setFormData.googleProfile(e.target.value)}
                                    value={formData.googleProfile}
                                />
                            </div>
                            <div className='error'>{errorMessage}</div>
                            <input type="submit" className="signupBtn" to="/RegisterPartner2" value="Next Step" />
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