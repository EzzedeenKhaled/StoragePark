import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { ProfileForm } from '../../components/ProfileForm';
import { useUserStore } from '../stores/useUserStore';

function Profile() {
  const { user, getWishlist } = useUserStore();
    React.useEffect(() => {
    if (user) { 
      getWishlist();
    }
  }, [user, getWishlist]);
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1">
        <ProfileForm 
          initialData={{
            firstName: user?.firstName,
            email: user?.email,
            lastName: user?.lastName,
            phone: user?.phoneNumber,
          }}
        />
      </main>
    </div>
  );
}

export default Profile;