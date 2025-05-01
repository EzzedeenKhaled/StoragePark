import Header from '../../components/Header';
import ProductCarousel from '../../components/ProductCarousel';
import Footer from '../../components/Footer';
import { useUserStore } from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import TrackOrder from '../../components/TrackOrder';


const categories = [
  { name: 'Electronics', image: '/electronics.jpeg' },
  { name: 'Beauty', image: '/beauty.jpg' },
  { name: 'Toys', image: '/toys.jpg' },
  { name: 'Clothes', image: '/clothes.jpg' },
  { name: 'Health & Household', image: '/health-household.jpg' },
  { name: 'Sports', image: '/sports.avif' },
  { name: 'Books', image: '/books.jpg' },
  { name: 'Automotive', image: '/automotive.jpg' },
  { name: 'Computers', image: '/computers.jpg' },
  { name: 'Grocery', image: '/grocery.jpg' },
  { name: 'Home & Kitchen', image: '/home-kitchen.jpg' },
  { name: 'Pet Supplies', image: '/pet-supplies.jpg' }
];

function Ecommerce() {
  const { activeItems, fetchActiveItems, getWishlist, user, wishlist } = useUserStore();
  const [firstHalf, setFirstHalf] = useState([]);
  const [secondHalf, setSecondHalf] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchActiveItems(); // Added await in case it's asynchronous
      if (user) {
        await getWishlist();
      }
    };

    fetchData();
  }, [fetchActiveItems, getWishlist, user]);

  // Split activeItems into two arrays when it changes
  useEffect(() => {
    if (activeItems && activeItems.length > 0) {
      const middleIndex = Math.ceil(activeItems.length / 2);
      setFirstHalf(activeItems.slice(0, middleIndex));
      setSecondHalf(activeItems.slice(middleIndex));
    }
  }, [activeItems]);

  return (
    <>
      <Header />
      <TrackOrder />
      <ProductCarousel categories={categories} title="Shop by Category" />
      
      {/* Display first half of active items */}
      {firstHalf.length > 0 && (
        <ProductCarousel 
          products={firstHalf} 
          wishlist={user ? wishlist : []} 
          title="Featured Products" 
        />
      )}
      
      {/* Display second half of active items */}
      {secondHalf.length > 0 && (
        <ProductCarousel 
          products={secondHalf} 
          wishlist={user ? wishlist : []} 
          title="New Arrivals" 
        />
      )}
      <Footer />
    </>
  );
}

export default Ecommerce;