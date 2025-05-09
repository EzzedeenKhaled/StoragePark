import { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar";
import axios from "../../../lib/axios";
import { usePartnerStore } from "../../stores/usePartnerStore";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toggleProductStatus } = usePartnerStore(); // Use the toggleProductStatus function

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/admins/allProducts");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle toggle product status
  const handleToggleProductStatus = async (productId) => {
    try {
      await toggleProductStatus(productId); // Call the toggle function
      // Update the product state locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: !product.isActive }
            : product
        )
      );
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.partner?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6 ml-[250px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-sm opacity-90">Detailed information about all products</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 text-gray-900 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-white/70"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-6 ml-[250px]">
          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Product Name</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Brand</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Partner</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b last:border-b-0">
                    <td className="py-4 px-6">{product.productName}</td>
                    <td className="py-4 px-6">{product.brand}</td>
                    <td className="py-4 px-6">{product.quantity}</td>
                    <td className="py-4 px-6">${product.pricePerUnit.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      {product.partner
                        ? `${product.partner.companyName} (${product.partner.firstName} ${product.partner.lastName})`
                        : "No Partner"}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleProductStatus(product._id)}
                        className={`w-12 h-6 rounded-full ${product.isActive ? 'bg-orange-500' : 'bg-gray-200'} relative transition-colors duration-300 cursor-pointer`}
                        title={product.isActive ? "Click to deactivate" : "Click to activate"}
                      >
                        <div
                          className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all duration-300 shadow-sm ${product.isActive ? 'left-6' : 'left-0.5'}`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;