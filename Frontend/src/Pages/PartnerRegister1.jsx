// src/Pages/Auth/RegisterPartner/index.jsx
import '../Styles/RegisterP1.css';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/logo.png";

const RegisterPartner = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [website, setWebsite] = useState("");
    const [googleProfile, setGoogleProfile] = useState("");
    const [errorMessage] = useState("");

    const submitForm = (e) => {
        e.preventDefault();
        console.log("Register form submitted:", { 
            firstName, 
            lastName, 
            companyName, 
            email, 
            phone, 
            address, 
            website, 
            googleProfile 
        });
    };

    return (
        <div className='RegisterPage'>
            <div className='registerComponent'>
                <div className='leftSide'>
                    <Link to='/'><img src={logo} alt="Logo" /></Link>
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
                                        onChange={(e) => setFirstName(e.target.value)}
                                        value={firstName}
                                    />
                                </div>
                                <div className="text_field">
                                    <label>Last Name*</label>
                                    <input 
                                        type="text" 
                                        required
                                        onChange={(e) => setLastName(e.target.value)}
                                        value={lastName}
                                    />
                                </div>
                            </div>
                            <div className="text_field">
                                <label>Company Name*</label>
                                <input 
                                    type="text" 
                                    required
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    value={companyName}
                                />
                            </div>
                            <div className="text_field">
                                <label>Company Email*</label>
                                <input 
                                    type="email" 
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                            <div className="text_field">
                                <label>Phone Number*</label>
                                <input 
                                    type="tel" 
                                    required
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                />
                            </div>
                            <div className="text_field">
                                <label>Address*</label>
                                <input 
                                    type="text" 
                                    required
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={address}
                                />
                            </div>
                            <div className="text_field">
                                <label>Website URL (If You Have):</label>
                                <input 
                                    type="url"
                                    onChange={(e) => setWebsite(e.target.value)}
                                    value={website}
                                />
                            </div>
                            <div className="text_field">
                                <label>Google Business Profile Access:</label>
                                <input 
                                    type="text"
                                    required
                                    onChange={(e) => setGoogleProfile(e.target.value)}
                                    value={googleProfile}
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