// RegisterPartner2.js
import '../assets/Styles/RegisterP2.css';
import { Link } from 'react-router-dom';
import { useState } from "react";

const RegisterPartner2 = () => {
    // const [certificateFile, setCertificateFile] = useState(null);
    // const [businessLicenseFile, setBusinessLicenseFile] = useState(null);
    // const [taxComplianceFile, setTaxComplianceFile] = useState(null);
    // const [termsAccepted, setTermsAccepted] = useState(false);
    // const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({
		certificateFile: null,
        businessLicenseFile: null,
        taxComplianceFile: null,
        termsAccepted: false,
        showMessage: false,
	});
    const handleCertificateChange = (e) => {
        setFormData.certificateFile(e.target.files[0]);
    };

    const handleBusinessLicenseChange = (e) => {
        setFormData.businessLicenseFile(e.target.files[0]);
    };

    const handleTaxComplianceChange = (e) => {
        setFormData.taxComplianceFile(e.target.files[0]);
    };
    const handleCloseMessage = () => {
        setFormData.showMessage(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!setFormData.termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }
        // Handle form submission with the uploaded files
        // console.log('Certificate:', certificateFile);
        // console.log('Business License:', businessLicenseFile);
        // console.log('Tax Compliance Certificate:', taxComplianceFile);

        setFormData.showMessage(true);
    };

    return (
        <div className='RegisterPage'>
            <div className='container'>
                <img src='/logo.png' alt="Logo" className="top-left-logo" />
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
                            checked={setFormData.termsAccepted}
                            onChange={() => setFormData.termsAccepted(!formData.termsAccepted)}
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
            {formData.showMessage && (
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