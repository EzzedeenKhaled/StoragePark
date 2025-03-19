// RegisterPartner2.js
import '../Styles/RegisterP2.css';
import { Link } from 'react-router-dom';
import React, { useState } from "react";
import logo from '../assets/logo.png';

const RegisterPartner2 = () => {
    const [certificateFile, setCertificateFile] = useState(null);
    const [businessLicenseFile, setBusinessLicenseFile] = useState(null);
    const [taxComplianceFile, setTaxComplianceFile] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const handleCertificateChange = (e) => {
        setCertificateFile(e.target.files[0]);
    };

    const handleBusinessLicenseChange = (e) => {
        setBusinessLicenseFile(e.target.files[0]);
    };

    const handleTaxComplianceChange = (e) => {
        setTaxComplianceFile(e.target.files[0]);
    };
    const handleCloseMessage = () => {
        setShowMessage(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }
        // Handle form submission with the uploaded files
        console.log('Certificate:', certificateFile);
        console.log('Business License:', businessLicenseFile);
        console.log('Tax Compliance Certificate:', taxComplianceFile);

        setShowMessage(true);
    };

    return (
        <div className='RegisterPage'>
            <div className='container'>
                <img src={logo} alt="Logo" className="top-left-logo" />
                <form className='RegisterForm' onSubmit={handleSubmit}>
                    <h2>Legal Documentation</h2>

                    <div className="documentSection">
                        <h3>Certificate of Incorporation</h3>
                        <label htmlFor="certificate" className="fileInput">
                            <input 
                                id="certificate"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleCertificateChange}
                                style={{ display: 'none' }}
                            />
                            <span>Upload Certificate</span>
                        </label>
                    </div>

                    <div className="documentSection">
                        <h3>Business License</h3>
                        <label htmlFor="businessLicense" className="fileInput">
                            <input 
                                id="businessLicense"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleBusinessLicenseChange}
                                style={{ display: 'none' }}
                            />
                            <span>Upload License</span>
                        </label>
                    </div>

                    <div className="documentSection">
                        <h3>Tax Compliance Certificate</h3>
                        <label htmlFor="taxCompliance" className="fileInput">
                            <input 
                                id="taxCompliance"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleTaxComplianceChange}
                                style={{ display: 'none' }}
                            />
                            <span>Upload Certificate</span>
                        </label>
                    </div>

                    <div className="termsSection">
                        <input 
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                        />
                        <label>I agree to the <Link to="/terms">terms and conditions</Link> and the <Link to="/privacy">privacy policy</Link>.</label>
                    </div>

                    <button
                        type="submit"
                        className="SubmitBtn"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {showMessage && (
                <div className="submission-message-overlay">
                    <div className="submission-message">
                        <p>
                            Thank you for placing your trust in us. 
                            </p><p>We will review your registration and 
                            </p><p>send you your acceptance via email.
                        </p>
                        <p><p><br /></p></p>
                        <button onClick={handleCloseMessage}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegisterPartner2;