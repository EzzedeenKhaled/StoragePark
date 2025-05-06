import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import ProductCardCart from '../../components/ProductCardCart';
import { ArrowRight, Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
const Cart = () => {
  const { cart, total, subtotal, removeFromCart, updateQuantity, getCartItems,loading } = useCartStore();
  useEffect(() => {
    async function fetchCart() {
      await getCartItems();
    }

    fetchCart();
  }, [getCartItems]);
  console.log("cajiofjaipfa: ",cart)
  if (loading) return <LoadingSpinner />;
  // const item = cart?.[0];
  // console.log(item); // safely access it
  const saleItems = [
    {
      id: 3,
      title: 'Raycon Earbuds',
      price: '25.34',
      originalPrice: '35.25',
      discount: '28',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3'
    },
    {
      id: 4,
      title: 'Essentials 4 Pack: Men\'s Dry-Fit',
      price: '22.34',
      originalPrice: '32.99',
      discount: '32',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=2127&ixlib=rb-4.0.3'
    },
    {
      id: 5,
      title: 'Oral-B IO Deep Clean',
      price: '99.99',
      originalPrice: '139.42',
      discount: '28',
      image: 'https://images.unsplash.com/photo-1559591937-ffe1193d0a53?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3'
    },
    {
      id: 6,
      title: 'Espresso Machine With Auto Milk Frother',
      price: '399.95',
      originalPrice: '548.62',
      discount: '27',
      image: 'https://images.unsplash.com/photo-1517150140803-a7c235de31dd?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3'
    }
  ];
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="w-full px-4 py-8 flex-grow">
        <h1 className="text-orange-500 text-3xl font-bold mb-6">Your cart</h1>

        <div className="bg-orange-50 p-4 rounded-lg flex items-start gap-3 mb-6">
          <img src="handshake.png" alt="handshake" height={15} />
          <p className="text-sm">
            Storage Park Purchase Protection: Shop confidently on Storage Park knowing if something goes wrong with an order, we've got your back.
            <a href="#" className="text-orange-600 hover:underline ml-1">See program terms</a>
          </p>
        </div>

        {cart.length > 0 ? (
          <div className="space-y-6 mb-8">
            {cart.map(item => (
              <div key={item._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={item.imageProduct}
                  alt={item.productName}
                  className="w-full sm:w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.productName}</h3>
                  <p className="text-orange-500 font-bold">${item.pricePerUnit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <Minus className='text-gray-600' />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <Plus className='text-gray-600' />
                  </button>
                </div>
                <button
                  className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => removeFromCart(item._id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span>$3</span>
              </div>
              <div className="flex justify-between py-2 mt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold">${(parseFloat(subtotal) + 3).toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/payment-form"
              state={{
                cartItems: cart.map(item => ({
                  _id: item._id,
                  name: item.productName,
                  category: item.category, // Make sure your cart items have a category field
                  price: item.pricePerUnit,
                  quantity: item.quantity,
                  image: item.imageProduct
                })),
                subtotal: subtotal,
                total: (parseFloat(subtotal) + 3).toFixed(2)
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
            >
              <span>Proceed to checkout</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="mb-6 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/ecommerce"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">More On Sale Items To Add</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {saleItems.map(item => (
            <ProductCardCart key={item.id} product={item} onSale={true} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Cart;
