import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import FilterSidebar from '../../components/Category/FilterSidebar';
import ProductGrid from '../../components/Category/ProductGrid';
import Pagination from '../../components/Category/Pagination';
import Reviews from '../../components/Category/Reviews';
import Footer from '../../components/Footer';
import '../assets/Styles/Category.css';
import { useUserStore } from "../stores/useUserStore";
import { useReviewStore } from '../stores/useReviewStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const Category = () => {
  const { categoryName } = useParams();
  const { fetchItemsByCategory, category, loading } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [sortOption, setSortOption] = useState("relevancy"); // Add sorting state
  const { fetchReviewsByCategory, reviews } = useReviewStore();
  const totalPages = 8;

  useEffect(() => {
    const fetchData = async () => {
      await fetchItemsByCategory(categoryName);
      await fetchReviewsByCategory(categoryName);
    };
    fetchData();
  }, [categoryName, fetchItemsByCategory, fetchReviewsByCategory]);

  if (loading) return <LoadingSpinner />;

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

          <div className="content-wrapper">
            <div className="content" style={{ position: "relative" }}>
              <div className="content-header">
                <button className="filter-button" onClick={handleOpenFilters}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  All filters
                </button>
                <div className="results-info">
                  <span>
                    {category.length} item{category.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="sort-dropdown">
                  <label htmlFor="sort">Sort by: </label>
                  <select
                    id="sort"
                    className="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)} // Update sorting state
                  >
                    <option value="relevancy">Relevancy</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="nameAZ">Name: A to Z</option>
                    <option value="nameZA">Name: Z to A</option>
                  </select>
                </div>
              </div>

              <FilterSidebar open={showFilterPopover} onClose={handleCloseFilters} />

              {/* Pass sortOption to ProductGrid */}
              <ProductGrid products={category} sortOption={sortOption} />

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