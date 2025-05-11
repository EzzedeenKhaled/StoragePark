import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useUserStore } from '../stores/useUserStore';
import { WishlistItem } from "../../components/WishlistItem";
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { useNavigate } from 'react-router-dom';
function Wishlist() {
  const { user, wishlist, loading, getWishlist } = useUserStore();
  const [checkingRole, setCheckingRole] = React.useState(true);
  const navigate = useNavigate();
  React.useEffect(() => {
    setCheckingRole(true);
    if (user?.role === "admin" || user?.role === "partner" || !user) {
      navigate('/');
    }
    setCheckingRole(false);
  }, [user, navigate]);
  if (checkingRole) return <LoadingSpinner />;
  React.useEffect(() => {
    if (user) { 
      getWishlist();
    }
  }, [user, getWishlist]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar userName={user?.name || 'Guest'} />
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