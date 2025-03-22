import '../Styles/RegisterC.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png"; 
import { useUserStore } from "../stores/useUserStore";

const Register = () => {
    const [errorMessage] = useState("");
	const [formData, setFormData] = useState({
		firstName: "",
        lastName: "",
        phone: "",
		email: "",
		password: "",
	});
	const { signup } = useUserStore();
	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
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
                        <form className='registerForm' onSubmit={handleSubmit}>
                            <div className="name_fields">
                                <div className="text_field">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        value={formData.firstName}
                                    />
                                </div>
                                <div className="text_field">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        value={formData.lastName}
                                    />
                                </div>
                            </div>
                            <div className="text_field">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    required
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    value={formData.email}
                                />
                            </div>
                            <div className="text_field">
                                <label>Phone Number</label>
                                <input 
                                    type="tel" 
                                    required
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    value={formData.phone}
                                />
                            </div>
                            <div className="text_field">
                                <label>Password</label>
                                <input 
                                    type="password"
                                    required
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    value={formData.password}
                                />
                            </div>
                            <div className='error'>{errorMessage}</div>
                            <input type="submit" className="signupBtn" value="Sign Up" />
                            <div className="form_bottom">
                                Already have an account? <Link className='linkBtn' to="/">Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;