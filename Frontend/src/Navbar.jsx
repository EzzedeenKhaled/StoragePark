import './Navbar.css';
function Navbar() {
  return (
    <nav style={{
      display: 'flex', 
      alignItems: 'center',
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      backgroundColor: 'white',
      padding: '10px 20px',
      zIndex: 10,
      justifyContent: 'space-around',
    }}>
      <img width="100px" height="45.93px" src='/logo.png' alt="Logo" />
      <a href='#l1'>
        What We Do
      </a>
      <a href='#l2'>
        How We Do It
      </a>
      <a href='#l3'>
        Who We Are
      </a>
      <button>SignUp</button>
      <button>Return To Store</button>
    </nav>
  );
}

export default Navbar;
