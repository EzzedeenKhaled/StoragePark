import React from "react";
import Header from "../../components/Header";
import ProductGallery from "../../components/ProductGallery";
import ProductDetails from "../../components/ProductDetails";
import ProductReviews from "../../components/ProductReviews";
import RelatedProducts from "../../components/RelatedProducts";
import Footer from "../../components/Footer";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {LoadingSpinner} from "../../components/LoadingSpinner";
import axios from "../../lib/axios";
import NotFound from "./NotFound";
import { useUserStore } from "./../stores/useUserStore";

const ProductPage = () => {
const { productId } = useParams();
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const { user } = useUserStore();
React.useEffect(() => {
  console.log("Leave a review user: ", user)
}, [user]);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${productId}`);
      setProduct(res.data);
    } catch (err) {
      setError(true);
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [productId]);

if (loading) return <LoadingSpinner />;
if (error) return <NotFound />;
if (!product) return <div className="text-center py-10">Product not found.</div>;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <ProductGallery 
            mainImage={product.image} 
            productId={productId}
          />
          <ProductDetails product={product}/>
        </div>
        {user? (
            <ProductReviews />
          ) : (
            <div>
              <h1>Please login to leave a review</h1>
            </div>
          )}
        
        
        <RelatedProducts productRelated={product.category}/>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;