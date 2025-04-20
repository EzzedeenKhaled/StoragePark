import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useUserStore } from '../stores/useUserStore';
import { WishlistItem } from "../../components/WishlistItem";


function Wishlist() {
  const { user } = useUserStore();
  
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar userName={user?.name || 'Guest'} />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <WishlistItem />
      </main>
    </div>
  );
}

export default Wishlist;