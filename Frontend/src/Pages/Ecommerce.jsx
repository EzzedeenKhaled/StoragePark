import Header from '../../components/Header';
import ProductCarousel from '../../components/ProductCarousel';
import Footer from '../../components/Footer';
import { useUserStore } from '../stores/useUserStore';
import { useEffect } from 'react';
import TrackOrder from '../../components/TrackOrder';
const products = [
  { id: 1, image: 'images/card122.jpg', name: 'Product 1', price: 20, discount: 0 },
  { id: 2, image: 'images/card2.jpg', name: 'Product 2', price: 20, discount: 50, originalPrice: 40 },
  { id: 3, image: 'images/card3.jpg', name: 'Product 3', price: 20, discount: 50, originalPrice: 40 },
  { id: 4, image: 'images/card4.jpg', name: 'Product 4', price: 20, discount: 50, originalPrice: 40 },
  { id: 5, image: 'images/card5.jpg', name: 'Product 5', price: 20, discount: 50, originalPrice: 40 },
  { id: 6, image: 'images/card6.jpg', name: 'Product 6', price: 20, discount: 50, originalPrice: 40 },
  { id: 7, image: 'images/card7.jpg', name: 'Product 7', price: 20, discount: 50, originalPrice: 40 },
  { id: 8, image: 'images/card8.jpg', name: 'Product 8', price: 20, discount: 50, originalPrice: 40 },
  { id: 9, image: 'images/card9.jpg', name: 'Product 9', price: 20, discount: 50, originalPrice: 40 },
  { id: 10, image: 'images/card10.jpg', name: 'Product 10', price: 20, discount: 50, originalPrice: 40 }
];

const categories = ['Clothes', 'Electronics', 'Health & Household', 'Beauty', 'Toys', 'Sports', 'Books', 'Automotive', 'Computers', 'Grocery', 'Home & Kitchen', 'Pet Supplies', 'Baby Products', 'Office Products', 'Video Games', 'Musical Instruments', 'Tools & Home Improvement', 'Garden & Outdoor', 'Arts, Crafts & Sewing', 'Industrial & Scientific'];

function Ecommerce() {
  const { activeItems, fetchActiveItems } = useUserStore();
  useEffect(() => {
    fetchActiveItems(); // Fetch active items from backend
  }, [fetchActiveItems]);
  // const mappedProducts = activeItems.map(item => ({
  //   _id: item._id,
  //   name: item.productName,
  //   discount: item.discount || 50,
  //   originalPrice: item.pricePerUnit,
  //   price: item.discount ? item.pricePerUnit - (item.pricePerUnit * (item.discount / 100)) : item.pricePerUnit,
  //   image: item.imageProduct
  // }));
// console.log("mappedProducts: ", mappedProducts)
  return (
    <>
      <Header />
      <TrackOrder />
      <ProductCarousel categories={categories} title="Shop by Category" />
      <ProductCarousel products={products} title="Black Friday" />
      <ProductCarousel products={products} title="Latest Products" />
      <ProductCarousel products={activeItems} title="Active Items" />
      <Footer />
    </>
  );
}

export default Ecommerce;