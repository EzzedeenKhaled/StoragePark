import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUserStore } from "../../../stores/useUserStore";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProductForm = () => {
  const { productFormSubmit } = useUserStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    productName: '',
    weight: '',
    quantity: '',
    pricePerUnit: '',
    description: '',
    brand: '',
    packagingType: 'boxed',
    packageWidth: '',
    packageHeight: '',
    imageProduct: null,
    storageCondition: '',
  });
  const [fileName, setFileName] = useState({
    imageProduct: "Upload Image",
  });
  const categories = ['Electronics', 'Clothing', 'Furniture', 'Other'];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file' && !value.type.startsWith('image/')) {
      toast.error("Only image files are allowed.");
      return;
    }
    if (value) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'imageProduct') {
        setFileName((prevState) => ({
          ...prevState,
          imageProduct: value.name,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    productFormSubmit(formData);
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl shadow-sm">
      <button
        className="text-gray-600 hover:text-gray-800 cursor-pointer mb-6"
        onClick={() => navigate(-1)}
        type="button"
      >
        <ArrowLeft size={24} />
      </button>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
          <p className="text-gray-600 mt-2">Fill in the details below to add your product</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Product Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="text"
              name="weight"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Price Per Unit ($)</label>
            <input
              type="number"
              name="pricePerUnit"
              min="0.01"
              step="0.01"
              value={formData.pricePerUnit}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Brand (optional)</label>
            <input
              type="text"
              name="brand"
              placeholder="Enter brand name"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all h-32"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Package Width (cm)</label>
            <input
              type="text"
              name="packageWidth"
              value={formData.packageWidth}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Package Height (cm)</label>
            <input
              type="text"
              name="packageHeight"
              value={formData.packageHeight}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-0 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <label 
            htmlFor="image" 
            className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer focus:ring-0 focus:border-orange-500 focus:outline-none transition-all group"
          >
            <input
              id="image"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center text-center">
              <svg 
                className="w-10 h-10 mb-3 text-gray-400 group-hover:text-orange-500 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-orange-500 font-medium">{fileName.imageProduct}</span>
            </div>
          </label>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Stock and Product Details</h2>
          <div className="flex items-center gap-6">
            <span className="font-medium text-gray-700 mr-2">Preferred Storage Conditions:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="storageCondition"
                value="standard"
                checked={formData.storageCondition === 'standard'}
                onChange={handleInputChange}
                className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-orange-500 checked:bg-white checked:ring-2 checked:ring-orange-500 focus:outline-none transition-all"
              />
              <span className="text-gray-600">Standard Storage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="storageCondition"
                value="fragile"
                checked={formData.storageCondition === 'fragile'}
                onChange={handleInputChange}
                className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-orange-500 checked:bg-white checked:ring-2 checked:ring-orange-500 focus:outline-none transition-all"
              />
              <span className="text-gray-600">Fragile</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="storageCondition"
                value="temperature-controlled"
                checked={formData.storageCondition === 'temperature-controlled'}
                onChange={handleInputChange}
                className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-orange-500 checked:bg-white checked:ring-2 checked:ring-orange-500 focus:outline-none transition-all"
              />
              <span className="text-gray-600">Temperature-Controlled</span>
            </label>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all font-medium"
            onClick={() => navigate('/partner/products')}
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;