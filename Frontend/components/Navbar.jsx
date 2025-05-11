import '../src/assets/Styles/Navbar.css';
import { Link, NavLink } from 'react-router-dom';
import { useUserStore } from '../src/stores/useUserStore';

const Navbar = () => {
  const { user } = useUserStore();

  return (
    <div className='navbar'>
      <div className='left'>
        <Link to='/'><img src='/logo_landing.png' alt='logo' /></Link>
      </div>

      <div className='right'>
        {!user && (
          <>
            <NavLink to='/register-partner-1'>
              <button>signup</button>
            </NavLink>
            <NavLink to='/ecommerce'>
              <button>return to store</button>
            </NavLink>
          </>
        )}

        {user?.role === 'customer' && (
          <NavLink to='/ecommerce'>
            <button>return to store</button>
          </NavLink>
        )}

        {user?.role === 'admin' && (
          <NavLink to='/admin'>
            <button>return to admin</button>
          </NavLink>
        )}
        {user?.role === 'partner' && (
          <NavLink to='/partner-dashboard'>
            <button>return to partner</button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
