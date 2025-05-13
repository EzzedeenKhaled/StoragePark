import '../assets/Styles/Login.css';
import { Link } from 'react-router-dom';
import { LogIn, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation();
    const product = location.state?.product;
    const from = location.state?.from; // Default to '/' if no 'from' is present
    const { login, loading, user } = useUserStore();
    const { addToCart } = useCartStore();
    useEffect(() => {
        if (user) {
            if (product) {
                addToCart(product);
                navigate(`/product-page/${product._id}`);
            } else if(user.role === "customer") {
                navigate('/ecommerce');
            } else if(user.role === "partner"){
                navigate('/partner');
            } else {
                navigate('/admin')
            }
        }
    }, [user, navigate, from, product]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if(res === 403) navigate("/verify-email", { state: { email, from: "login" } });
    };
    const [errorMessage] = useState("");

    return (
        <div className='LoginPage'>
            <div className='loginComponent'>
                <div className='leftSide'>
                    <Link to='/'><img src='/portraitLogo.png' alt="Logo" /></Link>
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
							rounded-md shadow-sm text-sm font-medium text-white 
							  focus:outline-none focus:ring-2 focus:ring-offset-2
							   transition duration-150 ease-in-out disabled:opacity-50 bg-[#1a1a1a] cursor-pointer hover:bg-[#333]'
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
                                Don&apos;t have an account?<Link className='linkBtn' to="/register-customer">Get Started</Link>
                            </div>
                            <div className="forgotPassword">
                                <Link className='linkBtn' to="/forgot-password">Forgot Password?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
