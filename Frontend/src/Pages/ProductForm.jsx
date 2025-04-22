import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUserStore } from "../stores/useUserStore";


const ProductForm = () => {
  const { productFormSubmit } = useUserStore();
  const [formData, setFormData] = useState({
    category: '',
    productName: '',
    weight: '',
    quantity: '',
    pricePerUnit: '',
    description: '',
    brand: '',
    // storageCondition: 'standard',
    packagingType: 'boxed',
    packageWidth: '',
    packageHeight: '',
    imageProduct: null,
  });
  const [fileName, setFileName] = useState({
    imageProduct: "Upload Image",
  });
  const categories = ['Electronics', 'Clothing', 'Furniture', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    productFormSubmit(formData);
    console.log('Form submitted:', formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validate that the file is an image
    if (file && !file.type.startsWith('image/')) {
      toast.error("Only image files are allowed.");
      return;
    }

    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        imageProduct: file,
      }));

      setFileName((prevState) => ({
        ...prevState,
        imageProduct: file.name,
      }));
    }
  };



  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-medium text-gray-700">Product Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2">Product Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Product Name:</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Weight:</label>
            <input
              type="text"
              name="weight"
              placeholder="Enter Weight of the Item (Only One Item)"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Quantity:</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
              {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() => handleQuantityChange('up')}
                  className="text-orange-500 hover:text-orange-600"
                >▲</button>
                <button
                  type="button"
                  onClick={() => handleQuantityChange('down')}
                  className="text-orange-500 hover:text-orange-600 border-none"
                >▼</button>
              </div> */}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Price Per Unit:</label>
            <div className="relative">
              <input
                type="number"
                name="pricePerUnit"
                min="0.01"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
              {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() => handlePriceChange('up')}
                  className="text-orange-500 hover:text-orange-600"
                >▲</button>
                <button
                  type="button"
                  onClick={() => handlePriceChange('down')}
                  className="text-orange-500 hover:text-orange-600"
                >▼</button>
              </div> */}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md h-32"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Brand (optional):</label>
            <input
              type="text"
              name="brand"
              placeholder="Enter brand name"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* <div>
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Stock and Product Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Preferred Storage Conditions:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="storageCondition"
                    value="standard"
                    checked={formData.storageCondition === 'standard'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Standard Storage</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="storageCondition"
                    value="fragile"
                    checked={formData.storageCondition === 'fragile'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Fragile</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="storageCondition"
                    value="temperature-controlled"
                    checked={formData.storageCondition === 'temperature-controlled'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Temperature-Controlled</span>
                </label>
              </div>
            </div>
          </div>
        </div> */}

        <div>
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Packaging Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Packaging Type: Boxed</label>
              {/* <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="packagingType"
                    value="boxed"
                    checked={formData.packagingType === 'boxed'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Boxed</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="packagingType"
                    value="loose"
                    checked={formData.packagingType === 'loose'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Loose</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="packagingType"
                    value="palletized"
                    checked={formData.packagingType === 'palletized'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Palletized</span>
                </label>
              </div> */}
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Width:</label>
              <input
                type="text"
                name="packageWidth"
                value={formData.packageWidth}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Height:</label>
              <input
                type="text"
                name="packageHeight"
                value={formData.packageHeight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Additional Information</h2>
          {/* <div>
            <label className="block text-gray-600 mb-2">Upload Item Photo:</label>
            <button
              type="button"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Upload
            </button>
          </div> */}
          <h3 className='mb-4'>Product Image</h3>
          <label htmlFor="image" className="fileInput">
            <input
              id="image"
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => handleFileChange(e)}
              style={{ display: 'none' }}
            />
            <span>{fileName.imageProduct}</span>
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;