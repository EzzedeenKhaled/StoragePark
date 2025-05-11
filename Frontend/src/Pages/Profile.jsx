import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { ProfileForm } from '../../components/ProfileForm';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
function Profile() {
  const { user, getWishlist } = useUserStore();
  const [checkingRole, setCheckingRole] = React.useState(true);
  const navigate = useNavigate();
  React.useEffect(() => {
    setCheckingRole(true);
    if (user) {
      getWishlist();
    } else if (user?.role === "admin" || user?.role === "partner" || !user) {
      navigate('/');
    }
    setCheckingRole(false);

  }, [user, getWishlist]);
  if(checkingRole) return <LoadingSpinner />;
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