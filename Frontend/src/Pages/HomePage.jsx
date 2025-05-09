import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
function HomePage() {
    const navigate = useNavigate();
    const {user} = useUserStore();
    if (user?.role === 'partner') 
      navigate('/partner-dashboard');
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          background: 'linear-gradient(to right, #FF8B13 60%, #FF8B13 0%, #1D2126 62%, #1D2126 100%)',
        }}
      >
        {/* Left Div */}
        <div
          style={{
            flex: 1.5,
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <h1 className='h1Home'>
            Partners in <br />
            Warehousing <br />
            and <br />
            E-Commerce
          </h1>
          <p style={{ fontWeight: 'bold', marginBottom: '50px' }}>
            Our warehouse supports e-commerce with seamless partner integration. Real-time data exchange ensures efficient inventory and order fulfillment. This collaboration enables fast, reliable deliveries. Together, we optimize the supply chain for a better customer experience.
          </p>
        </div>
  
        {/* Right Div */}
        <div
          style={{
            flex: 1,
            color: 'white',
            padding: '20px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h1 className='h1Home' style={{ marginBottom: '20px' }}>Get Started</h1>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <button className='btnHome'
              onClick={() => navigate('/partner')}
              style={{ margin: '10px', background: '#FF8B13', color: 'white', borderRadius: '15px' }}
            >
              Become a Partner
            </button>
            <button className='btnHome'
              onClick={() => navigate('/ecommerce')}
              style={{ margin: '10px', background: '#FF8B13', color: 'white', borderRadius: '15px' }}
            >
              Browse Products
            </button>
          </div>
          <div>
            <img width="100px" height="45.93px" src='/logow.png' alt="Logo" />
          </div>
        </div>
      </div>
    );
  }
export default HomePage;