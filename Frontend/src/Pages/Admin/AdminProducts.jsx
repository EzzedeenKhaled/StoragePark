import { useState, useEffect } from "react";
import axios from "../../../lib/axios";
import { usePartnerStore } from "../../stores/usePartnerStore";
import Header from "../../../components/Admin/Header";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toggleProductStatus } = usePartnerStore();

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

  const handleToggleProductStatus = async (productId) => {
    try {
      await toggleProductStatus(productId);
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

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.partner?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header />
      </div>
      <div className="min-h-screen flex flex-col mt-16">
        {/* Title Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by product name, brand, or partner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
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
                        <tr key={product._id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="py-4 px-6">{product.productName}</td>
                          <td className="py-4 px-6">{product.brand}</td>
                          <td className="py-4 px-6">{product.quantity}</td>
                          <td className="py-4 px-6">${product.pricePerUnit.toFixed(2)}</td>
                          <td className="py-4 px-6">
                            {product.partner
                              ? (product.partner.companyName
                                  ? `${product.partner.companyName} (${product.partner.firstName} ${product.partner.lastName})`
                                  : `${product.partner.firstName} ${product.partner.lastName}`)
                              : "No Partner"}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleProductStatus(product._id)}
                              disabled={product.quantity === 0}
                              className={`w-12 h-6 rounded-full ${
                                product.quantity === 0 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : product.isActive 
                                    ? 'bg-orange-500' 
                                    : 'bg-gray-200'
                              } relative transition-colors duration-300 ${product.quantity === 0 ? '' : 'cursor-pointer'}`}
                              title={product.quantity === 0 
                                ? "Cannot toggle: Product is out of stock" 
                                : product.isActive 
                                  ? "Click to deactivate" 
                                  : "Click to activate"}
                            >
                              <div
                                className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all duration-300 shadow-sm ${
                                  product.isActive ? 'left-6' : 'left-0.5'
                                }`}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminProducts;