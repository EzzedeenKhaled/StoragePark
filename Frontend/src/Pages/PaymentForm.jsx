import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useUserStore } from '../stores/useUserStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
const PaymentForm = () => {
  const navigate = useNavigate();
  const { loading, makeOrder } = useUserStore();
  // Get the state passed from the Cart page
  const location = useLocation();
  const { cartItems = [], subtotal = 0, total = 0 } = location.state || {};
  const { user } = useUserStore();
  const [checkingRole, setCheckingRole] = useState(true);
  useEffect(() => {
    setCheckingRole(true);
    if (!cartItems || cartItems.length === 0)
      navigate('/ecommerce');
    setCheckingRole(false);
  }, [user, navigate]);
if (checkingRole) return <LoadingSpinner />;
// Calculate discount if needed
const discount = 0;
const finalTotal = parseFloat(total) - discount;

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let userLocation = {};
    if (navigator.geolocation) {
      userLocation = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
          (error) => reject(error)
        );
      });
    }

    const orderData = {
      items: cartItems.map(item => ({
        _id: item._id,
        name: item.name || item.productName,
        quantity: item.quantity,
        price: item.price || item.pricePerUnit,
      })),
      totalAmount: finalTotal,
      deliveryAddress: "", // Add delivery address if needed
      userLocation,
    };
    const res = await makeOrder(orderData);
    navigate('/purchase-success', { state: { orderId: res.data.orderId } });
  } catch (err) {
    console.error('Order submission error:', err);
    toast.error('Failed to process payment. Please try again.');
  }
};

return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <button
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Payment Form Section */}
          <div className="bg-orange-50 p-6 border-b border-orange-200">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Payment on Delivery</h2>
            <p className="text-center text-gray-600 mt-2">
              Your order will be delivered to your address and payment will be collected upon delivery
            </p>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Order summary</h2>
            <div className="space-y-4">
              {cartItems.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  {product.image ? (
                    <img src={product.image} alt={product.name || 'Product'} className="w-16 h-16 rounded object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name || 'Unnamed Product'}</h3>
                    <p className="text-sm text-gray-500">{product.category || 'No category'}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${(product.price || 0).toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <span>Qty: {product.quantity || 1}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Product total</span>
                  <span className="font-medium">${parseFloat(subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$3.00</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-500">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-orange-500">${(finalTotal || 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white 
							  focus:outline-none focus:ring-2 focus:ring-offset-2
							   transition duration-150 ease-in-out disabled:opacity-50 bg-[#1a1a1a] cursor-pointer hover:bg-[#333]'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                    Loading...
                  </>
                ) : (
                  <>

                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
);
};

export default PaymentForm;