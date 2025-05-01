
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import FilterSidebar from '../../components/Category/FilterSidebar';
import ProductGrid from '../../components/Category/ProductGrid';
import Pagination from '../../components/Category/Pagination';
import Reviews from '../../components/Category/Reviews';
import Footer from '../../components/Footer';
import '../assets/Styles/Category.css';
import {useUserStore} from "../stores/useUserStore";
import { useReviewStore } from '../stores/useReviewStore';
const Category = () => {
  const { categoryName } = useParams();
  const { fetchItemsByCategory, category } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const { fetchReviewsByCategory, reviews  } = useReviewStore();

  const totalPages = 8;
  useEffect(() => {
    const fetchData = async () => {
      await fetchItemsByCategory(categoryName);
      await fetchReviewsByCategory(categoryName);
    };
    fetchData();
  }, [categoryName, fetchItemsByCategory, fetchReviewsByCategory]);
  
  // Dummy product data based on the images
  // const products = [
  //   {
  //     id: 1,
  //     name: 'Cotton Fleece Half-Zip Sweatshirt',
  //     price: 16.99,
  //     originalPrice: 24.99,
  //     // onSale: true,
  //     discount: 32,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 2,
  //     name: 'Crew Neck Cotton Shirt',
  //     price: 12.99,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 3,
  //     name: 'Regular Cotton Jeans',
  //     price: 17.99,
  //     originalPrice: 22.99,
  //     // onSale: true,
  //     discount: 22,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 4,
  //     name: 'Wide-Leg Jeans',
  //     price: 16.99,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 5,
  //     name: 'Product Name',
  //     price: 23.99,
  //     originalPrice: 29.99,
  //     // onSale: true,
  //     discount: 20,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 6,
  //     name: 'New York Yankees Varsity Jacket',
  //     price: 21.99,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 7,
  //     name: 'Leather Blouson Jacket',
  //     price: 22.99,
  //     originalPrice: 34.99,
  //     // onSale: true,
  //     discount: 34,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 8,
  //     name: 'OshkoshB\'Gosh Long Sleeve',
  //     price: 15.99,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 9,
  //     name: 'Straight Jeans',
  //     price: 18.99,
  //     originalPrice: 25.99,
  //     // onSale: true,
  //     discount: 27,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 10,
  //     name: 'Polar Default Hoodie',
  //     price: 99.99,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 11,
  //     name: 'Pullover Hoodie',
  //     price: 19.99,
  //     originalPrice: 29.99,
  //     // onSale: true,
  //     discount: 33,
  //     image: 'https://via.placeholder.com/300x400'
  //   },
  //   {
  //     id: 12,
  //     name: 'Loose-Fit Denim',
  //     price: 17.99,
  //     image: 'https://via.placeholder.com/300x400'
  //   }
  // ];
  
  // Dummy review data based on the images
  // const reviews = [
  //   {
  //     reviewer: 'Julie',
  //     rating: 5,
  //     comment: 'Each item is perfect for my cottage core aesthetic! I can\'t wait to wear everything!! Seller was very attentive and asked question.',
  //     image: 'https://via.placeholder.com/40x40',
  //     category: 'Women\'s Clothing & Accessories'
  //   },
  //   {
  //     reviewer: 'Madonna',
  //     rating: 5,
  //     comment: 'The quality is fabulous! Super thick substantial material and fleece lined. The stitching is well done and it\'s a piece of art.',
  //     image: 'https://via.placeholder.com/40x40',
  //     category: 'Women\'s Clothing, Fall Style, Winter Dress, Sweater Dress, Cotton Dress'
  //   },
  //   {
  //     reviewer: 'Mariam',
  //     rating: 5,
  //     comment: 'Love all of her clothing and items so comfy and fun!',
  //     image: 'https://via.placeholder.com/40x40',
  //     category: 'Upcycled Butter Soft Oversized Tunic Top, Plus Size Tunic Top Too'
  //   },
  //   {
  //     reviewer: 'Lamia',
  //     rating: 5,
  //     comment: 'I am updating my review. Although shipping and service was not the best, This blouse is amazing.',
  //     image: 'https://via.placeholder.com/40x40',
  //     category: 'Linen wrap top reversible crop top for women Tie front or back blouse Open'
  //   }
  // ];
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleOpenFilters = () => setShowFilterPopover(true);
  const handleCloseFilters = () => setShowFilterPopover(false);

  return (
    <div className="app">
  <Header />

  <main className="main-content">
    <div className="container1">
    <h1 className="page-title">{categoryName}</h1>
      {/* <h1 className="page-title">Clothes</h1> */}

      <div className="content-wrapper">
        <div className="content" style={{ position: "relative" }}>
          <div className="content-header">
            <button className="filter-button" onClick={handleOpenFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              All filters
            </button>
            <div className="results-info">
            <span>{category.length} item{category.length === 1 ? '' : 's'}</span>
              {/* <span>1,000+ items</span> */}
            </div>
            <div className="sort-dropdown">
              <label htmlFor="sort">Sort by: </label>
              <select id="sort" className="sort-select">
                <option value="relevancy">Relevancy</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <FilterSidebar open={showFilterPopover} onClose={handleCloseFilters} />

          <ProductGrid products={category} />

          <div className="more-items">
            <p>There&apos;s so much more for you to discover</p>
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <Reviews reviews={reviews} />
        </div>
      </div>
    </div>
  </main>

  <Footer />
</div>
  );
};

export default Category;