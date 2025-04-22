import { Heart } from "lucide-react";

const ProductGallery = ({ mainImage }) => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden">
      <button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
        <Heart size={20} />
      </button>
      <img src={mainImage} alt="Product" className="w-full object-cover" />
    </div>
  );
};

export default ProductGallery;