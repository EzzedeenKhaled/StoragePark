import { Link } from "react-router-dom";

// Component
function Eheader() {
  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        {/* Logo */}
        <div style={styles.logo}>
          <img src="/logo_b.png" alt="Storage Park Logo" style={styles.logoImage} />
        </div>

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <input type="text" placeholder="Search" style={styles.searchInput} />
          <button style={styles.searchButton}>🔍</button>
        </div>

        {/* Header Actions */}
        <div style={styles.headerActions}>
          <span style={styles.action}>
          <Link to="/partner">Become A Partner</Link>
            </span>
          <span style={styles.action}>
            <Link to="/login">Login</Link>
          </span>
          <span style={styles.action}>🛒</span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <img src="/hero-image.png" alt="Order Tracking Hero Image" style={styles.heroImage} />
        <div style={styles.overlay}>
          <h1 style={styles.title}>Order Tracking Made Simple</h1>
          <p style={styles.subtitle}>Real-Time Updates at Your Fingertips</p>
          <button style={styles.trackButton}>Track Your Order</button>
        </div>
      </section>
    </div>
  );
}

// Styles as an Object
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  logoImage: {
    width: '100px',
    marginRight: '10px',
  },
  logoText: {
    fontSize: '20px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ff9800',
    borderRadius: '20px',
    padding: '5px 10px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    width: '300px', // Adjust width as needed
  },
  searchButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  headerActions: {
    display: 'flex',
    gap: '20px',
  },
  action: {
    cursor: 'pointer',
  },
  heroSection: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: '20px',
  },
  heroImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  trackButton: {
    padding: '10px 20px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Eheader;