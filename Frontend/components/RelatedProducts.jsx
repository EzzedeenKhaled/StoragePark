import { Link } from "react-router-dom";
import axios from "../lib/axios";
import { useEffect, useState } from "react";


const RelatedProducts = ({productRelated, itemId}) => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.post(`/products/category`, {
          params: { category: productRelated, itemId: itemId }
          });
        setProducts(res.data.items);
      } catch (err) {
        console.error(err);
      }
    };
    if (productRelated) {
      fetchProduct();
    }
  }, [productRelated, itemId]);
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-6 text-orange-500">Related Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Link key={product._id} to={`/product-page/${product._id}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={product.imageProduct}
                alt={product.productName}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-orange-500">
                  {product.productName}
                </h3>
                <p className="text-gray-600">{product?.pricePerUnit?.toFixed(2)} $</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;