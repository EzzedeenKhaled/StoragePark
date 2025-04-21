import React, { useState } from 'react';
import { useUserStore } from '../src/stores/useUserStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
export function ProfileForm({ initialData = {} }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    email: initialData.email || '',
    lastName: initialData.lastName || '',
    phone: initialData.phone || '',
  });
  const { user, updateUserCustomer } = useUserStore();
  useEffect(() => {
    if (user) {
      console.log('User updated:', user);
    }
  }, [user]);
  console.log('Usef:', user);
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    const res = await updateUserCustomer(formData);
    console.log('Response:', res);
    if (res === 200) {
      toast.success('Profile updated successfully!');
    }else {
      toast.error('Failed to update profile. Please try again.');
      return;
    }
    setFormData(formData);
    console.log('Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData(initialData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Profile Picture</h2>
      
      {/* Profile Picture Section */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl mb-4">
        <img
          src={user?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzcsHv578aOlNW5kDRZ5Lc5AZQowEd-fojyQ&s"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 cursor-not-allowed rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
