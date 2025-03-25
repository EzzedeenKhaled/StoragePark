import '../src/assets/Styles/Navbar.css';
import { NavLink } from 'react-router-dom';
const Navbar = () => {

    return (
        <div className='navbar'> 
            <div className='left'>
                <img src='/logo_landing.png' alt='logo'></img>
            </div>
            <div className="right">
                <NavLink to={'/register-partner-1'}><button >signup</button></NavLink>
                <NavLink to={'/Store'}><button >return to store</button></NavLink>
            </div>
        </div>
    );
}

export default Navbar;