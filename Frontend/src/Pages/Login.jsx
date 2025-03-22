import '../Styles/Login.css';
import { Link } from 'react-router-dom'
import { LogIn, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useState } from "react";
// import axios from "axios"; // Commented out since we're not using backend
import logo from "../assets/logo.png";
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../../redux/user/userSlice';

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
		login(email, password);
	};
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
                        <form onSubmit={handleSubmit} className='loginForm'>
                            <div className="text_feild">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                            <div className="text_feild">
                                <label>Password</label>
                                <input 
                                    type="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>
                            <div className='error'>{errorMessage}</div>
                            <button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
						</button>
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
