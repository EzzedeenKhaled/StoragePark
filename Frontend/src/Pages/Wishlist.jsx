import { useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useUserStore } from '../stores/useUserStore';
import { WishlistItem } from '../../components/WishlistItem';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const { user, wishlist, loading, getWishlist } = useUserStore();
  const navigate = useNavigate();

  // Redirect if not a customer
  useEffect(() => {
    if (!user || user.role === 'admin' || user.role === 'partner') {
      navigate('/');
    } else {
      getWishlist(); // Only get wishlist if user is valid
    }
  }, [user, navigate, getWishlist]);

  // Still loading user data or fetching wishlist
  if (!user || loading) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar userName={user.name || 'Guest'} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <WishlistItem key={wishlist.length} wishlist={wishlist} />
        )}
      </main>
    </div>
  );
}

export default Wishlist;
