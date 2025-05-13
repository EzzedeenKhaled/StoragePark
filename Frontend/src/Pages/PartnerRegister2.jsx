import '../assets/Styles/RegisterP2.css';
import { useState } from "react";
import { Check, Loader } from "lucide-react";
import { useUserStore } from '../stores/useUserStore';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
const RegisterPartner2 = () => {

    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        certificateFile: null,
        businessLicenseFile: null,
        taxComplianceFile: null,
    });

    const [fileNames, setFileNames] = useState({
        certificateFile: "Upload Certificate",
        businessLicenseFile: "Upload License",
        taxComplianceFile: "Upload Certificate",
    });

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];

        // Validate that the file is an image
        if (file && !file.type.startsWith('image/')) {
            toast.error("Only image files are allowed.");
            return;
        }

        if (file) {
            setFormData((prevState) => ({
                ...prevState,
                [fileType]: file,
            }));

            setFileNames((prevState) => ({
                ...prevState,
                [fileType]: file.name,
            }));
        }
    };

    const { user, signup_Done, loading } = useUserStore();
        useEffect(() => {
            if (user) {
                if (user.role === "customer") {
                    navigate("/ecommerce");
                } else if (user.role === "admin") {
                    navigate("/admin");
                } else if (user.role === "partner") {
                    navigate("/partner");
                }
            }
        },[]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.certificateFile || !formData.businessLicenseFile || !formData.taxComplianceFile) {
            toast.error("Please upload all required documents.");
            return;
        }


        const res = await signup_Done(formData, email);
        console.log("res", res);
        navigate("/verify-email");
    };

    return (
        <div className='RegisterPage'>
            <div className='container'>
                <img src='/portraitLogo.png' alt="Logo" className="top-left-logo" />
                <form className='RegisterForm' onSubmit={handleSubmit}>
                    <h2>Legal Documents</h2>

                    <div className="documentSection">
                        <h3>Certificate of Incorporation</h3>
                        <label htmlFor="certificate" className="fileInput">
                            <input
                                id="certificate"
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={(e) => handleFileChange(e, "certificateFile")}
                                style={{ display: 'none' }}
                            />
                            <span>{fileNames.certificateFile}</span>
                        </label>
                    </div>

                    <div className="documentSection">
                        <h3>Business License</h3>
                        <label htmlFor="businessLicense" className="fileInput">
                            <input
                                id="businessLicense"
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={(e) => handleFileChange(e, "businessLicenseFile")}
                                style={{ display: 'none' }}
                            />
                            <span>{fileNames.businessLicenseFile}</span>
                        </label>
                    </div>

                    <div className="documentSection">
                        <h3>Tax Compliance Certificate</h3>
                        <label htmlFor="taxCompliance" className="fileInput">
                            <input
                                id="taxCompliance"
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={(e) => handleFileChange(e, "taxComplianceFile")}
                                style={{ display: 'none' }}
                            />
                            <span>{fileNames.taxComplianceFile}</span>
                        </label>
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
                                <Check className='mr-2 h-5 w-5' aria-hidden='true' />
                                Submit
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPartner2;