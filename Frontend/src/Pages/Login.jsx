import '../Styles/Login.css';
import { Link } from 'react-router-dom'
import { useState } from "react";
// import axios from "axios"; // Commented out since we're not using backend
import logo from "../assets/logo.png";
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../../redux/user/userSlice';

const Login = () => {
    const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
    const [errorMessage] = useState("");

    // const navigate = useNavigate();
    // const dispatch = useDispatch();

    const submitForm = async (e) => {
        e.preventDefault();

        // Mock user data (replace this with real API response)
        // const mockUser = {
        //     first_name: "John",
        //     last_name: "Doe",
        //     user_type_id: 2,  // Change this to 1 for Admin, 3 for Partner, etc.
        //     token: "mock_token_123456"
        // };

        // Dispatch to Redux store
        // dispatch(setUser({
        //     user_name: `${mockUser.first_name} ${mockUser.last_name}`,
        //     token: mockUser.token,
        //     user_type: mockUser.user_type_id,
        // }));

        // Store in localStorage
        // localStorage.setItem("token", mockUser.token);
        // localStorage.setItem("user_name", `${mockUser.first_name} ${mockUser.last_name}`);
        // localStorage.setItem("user_type", mockUser.user_type_id);

        // Redirect based on user type
        // let user_type = mockUser.user_type_id;
        // if (user_type === 1) {
        //     navigate("/admin");
        //     localStorage.setItem("current_page", "dashboard");
        // } else if (user_type === 2) {
        //     navigate("/worker");
        //     localStorage.setItem("current_page", "dashboard");
        // } else if (user_type === 3) {
        //     navigate("/partner");
        //     localStorage.setItem("current_page", "dashboard");
        // }

        /* Uncomment this when backend is ready
        const postData = { email, password };
        await axios.post("http://127.0.0.1:8000/api/login", postData)
        .then(response => {
            dispatch(setUser({
                user_name: `${response.data.user.first_name} ${response.data.user.last_name}`,
                token: response.data.authorisation.token,
                user_type: response.data.user.user_type_id,
            }));
            localStorage.setItem("token", response.data.authorisation.token);
            localStorage.setItem("user_name", `${response.data.user.first_name} ${response.data.user.last_name}`);
            localStorage.setItem("user_type", response.data.user.user_type_id);
            let user_type = response.data.user.user_type_id;

            if (user_type === 1) {
                navigate("/admin");
                localStorage.setItem("current_page", "dashboard");
            } else if (user_type === 2) {
                navigate("/worker");
                localStorage.setItem("current_page", "dashboard");
            } else if (user_type === 3) {
                navigate("/partner");
                localStorage.setItem("current_page", "dashboard");
            }
        })
        .catch(error => {
            if (error.response) {
                const { data } = error.response;
                setErrorMessage(data.message || "An error occurred during login");
            } else {
                setErrorMessage("An error occurred during login");
            }
        });
        */
    };

    return (
        <div className='LoginPage'>
            <div className='loginComponent'>
                <div className='leftSide'>
                    <Link to='/'><img src={logo} alt="Logo" /></Link>
                </div>
                <div className='rightSide'>
                    <div className="form_header">
                        <div className='formtitle'>Welcome Back!</div>
                        <div className='formSubTitle'>We can’t wait for you to see what’s new. Happy shipping</div>
                    </div>
                    <div className="form_body">
                        <form className='loginForm'>
                            <div className="text_feild">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    required
                                    onChange={(e) => setFormData.email(e.target.value)}
                                    value={formData.email}
                                />
                            </div>
                            <div className="text_feild">
                                <label>Password</label>
                                <input 
                                    type="password"
                                    required
                                    onChange={(e) => setFormData.password(e.target.value)}
                                    value={formData.password}
                                />
                            </div>
                            <div className='error'>{errorMessage}</div>
                            <input type="submit" className="loginBtn" value="Login" onClick={submitForm} />
                            <div className="form_bottom">
                                Don&apos;t have an account?<Link className='linkBtn' to="/Register">Get Started</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
