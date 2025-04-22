import Eheader from "../../components/Eheader";
import ProductGallery from "../../components/ProductGallery";
import ProductDetails from "../../components/ProductDetails";
import RelatedProducts from "../../components/RelatedProducts";
import Footer from "../../components/Footer";

const ProductPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Eheader heroImage={false}/>
      
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductGallery 
            mainImage="https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8aG9vZGllfHx8fHx8MTcwOTQxNDAzMQ&ixlib=rb-4.0.3&q=80&w=1080" 
          />
          <ProductDetails />
        </div>
        
        <RelatedProducts />
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;