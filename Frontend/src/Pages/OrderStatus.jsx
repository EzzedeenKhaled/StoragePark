import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  Marker,
} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const deliveryIcon = 'https://maps.google.com/mapfiles/kml/shapes/truck.png';

function OrderStatus() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [deliveryGuyLocation, setDeliveryGuyLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);
  const [driverPos, setDriverPos] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
  const [status, setStatus] = useState('Pending'); // Order status

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/orders/status/${orderId}`);
        console.log("dad: ",response)
        const order = response.data;
        setUserLocation(order.userLocation);
        setDeliveryGuyLocation(order.deliveryGuyLocation);
        setOrderDetails(order);
        console.log("da: ",response)
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Assign delivery route
  useEffect(() => {
    if (!userLocation || !deliveryGuyLocation) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: deliveryGuyLocation.latitude, lng: deliveryGuyLocation.longitude },
        destination: { lat: userLocation.latitude, lng: userLocation.longitude },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          const steps = result.routes[0].legs[0].steps.map((step) => step.end_location);
          setRouteSteps(steps);
          setDriverPos({
            lat: deliveryGuyLocation.latitude,
            lng: deliveryGuyLocation.longitude,
          });
          setStepIndex(0);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  }, [userLocation, deliveryGuyLocation]);

// Simulate delivery guy movement
useEffect(() => {
  if (routeSteps.length === 0 || status === 'Delivered') return;

  const interval = setInterval(async () => {
    setStepIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < routeSteps.length) {
        setDriverPos(routeSteps[nextIndex]);
        return nextIndex;
      } else {
        clearInterval(interval);
        setDriverPos(routeSteps[routeSteps.length - 1]);

        // Final step: mark delivered and show modal
        (async () => {
          try {
            await axios.put(`/orders/markDelivered/${orderId}`); // Call the new endpoint
            setStatus('Delivered');
            setShowModal(true);
          } catch (err) {
            console.error('Failed to mark order delivered:', err);
          }
        })();

        return prevIndex; // Don't increment past end
      }
    });
  }, 6000); // 6 seconds per step

  return () => clearInterval(interval);
}, [routeSteps, status, orderId]);

  // Handle marking the order as delivered
  // const handleMarkAsDelivered = async () => {
  //   try {
  //     await axios.delete(`/orders/delete/${orderId}`);
  //     alert('Order marked as delivered!');
  //     navigate('/'); // Redirect to the homepage or orders page
  //   } catch (error) {
  //     console.error('Error marking order as delivered:', error);
  //     alert('Failed to mark order as delivered.');
  //   }
  // };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Map Section */}
      <div className="w-full h-96">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: 0, lng: 0 }}
          zoom={14}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {userLocation && <Marker position={{ lat: userLocation.latitude, lng: userLocation.longitude }} label="User" />}
          {driverPos && <Marker position={driverPos} icon={deliveryIcon} />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* Order Details Section */}
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg -mt-16 relative z-10">
        <h2 className="text-2xl font-bold mb-4">Order ID: {orderDetails?.orderId}</h2>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <p>Order Date: {new Date(orderDetails?.orderDate).toLocaleDateString()}</p>
          <p className="font-medium text-gray-800">Total Amount: ${orderDetails?.totalAmount.toFixed(2)}</p>
        </div>

        {/* Status Timeline */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <p className="text-sm mt-2">Order Confirmed</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <p className="text-sm mt-2">Out for Delivery</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full ${status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <p className="text-sm mt-2">Delivered</p>
          </div>
        </div>

        {/* Items Section */}
        <h3 className="text-xl font-bold mb-4">Items</h3>
        <ul className="divide-y divide-gray-200">
          {orderDetails?.items.map((item, index) => (
            <li key={index} className="flex items-center py-4">
              <img
                src={item.item.imageProduct || '/placeholder.png'}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
              />
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-800">${item.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Order Delivered</h2>
              <p className="text-gray-600 mb-6">Your order has been successfully delivered!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {/* Mark as Delivered Button */}
        {/* {status === 'Delivered' && (
          <button
            onClick={handleMarkAsDelivered}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-6"
          >
            Mark as Delivered
          </button>
        )} */}
      </div>
    </div>
  );
}

export default OrderStatus;