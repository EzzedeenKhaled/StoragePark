import { useEffect, useRef } from 'react'

const order = {
  id: '3354654654526',
  date: 'July 2, 2023',
  estimatedDelivery: 'July 16, 2023',
  status: [
    { label: 'Order Confirmed', date: 'Wed, 2 July', active: true },
    { label: 'Shipped', date: 'Wed, 2 July', active: true },
    { label: 'Out For Delivery', date: 'Wed, 4 July', active: false },
    { label: 'Delivered', date: 'Expected by, Mon 16th', active: false },
  ],
  products: [
    {
      name: 'The Chronos',
      color: 'Green',
      category: 'Electronic',
      price: 199.99,
      qty: 1,
      image: 'https://i.imgur.com/0y8Ftya.png',
    },
    {
      name: 'Power Bank',
      color: 'White',
      category: 'Electronic',
      price: 39.99,
      qty: 1,
      image: 'https://i.imgur.com/1Q9Z1Zm.png',
    },
    {
      name: 'Denim Drawstring Pants',
      color: 'Light blue',
      category: 'Clothes',
      price: 29.99,
      qty: 1,
      image: 'https://i.imgur.com/2y8Ftya.png',
    },
  ],
  payment: {
    method: '**** 1956',
    type: 'visa',
  },
  delivery: {
    address: 'Hamra St.',
    city: 'Lebanon, Beirut',
  },
  summary: {
    price: 269.97,
    discount: 53.99,
    delivery: 0,
    tax: 0,
    total: 215.97,
  },
}

function GoogleMap() {
  const ref = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    script.async = true

    script.onload = () => {
      setTimeout(() => {
        const map = new window.google.maps.Map(ref.current, {
          center: { lat: 33.8886, lng: 35.4955 },
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#181818' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#181818' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#232323' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#222831' }] },
          ],
        })

        const routeCoords = [
          { lat: 33.8938, lng: 35.5018 }, // Start (Beirut)
          { lat: 33.8886, lng: 35.4955 }, // Mid (Hamra)
          { lat: 33.8792, lng: 35.4846 }, // End (Basta)
        ]

        new window.google.maps.Polyline({
          path: routeCoords,
          geodesic: true,
          strokeColor: '#ff7849',
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map,
        })

        // Start Marker
        new window.google.maps.Marker({
          position: routeCoords[0],
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#ff7849',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#fff',
          },
        })

        // End Marker
        new window.google.maps.Marker({
          position: routeCoords[2],
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#ff7849',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#fff',
          },
        })
      }, 100) // delay ensures map renders correctly
    }

    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  return <div ref={ref} className="w-full h-80 rounded-b-2xl" />
}

export default function OrderStatus() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full h-80 relative">
        <GoogleMap />
        <div className="absolute bottom-0 left-0 w-full bg-white/95 rounded-t-2xl shadow-lg flex flex-col items-center py-6">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-800">Order ID: {order.id}</div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-1">
              <span>Order date: {order.date}</span>
              <span className="flex items-center gap-1 text-orange-500 font-medium">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#fb923c" strokeWidth="2" d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9" stroke="#fb923c" strokeWidth="2"/></svg>
                Estimated delivery: {order.estimatedDelivery}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-between text-sm text-gray-400 font-medium">
            {order.status.map((s, i) => (
              <div key={s.label} className="flex-1 flex flex-col items-center">
                <span className={s.active ? 'text-orange-500' : ''}>{s.label}</span>
                <span className={s.active ? 'text-gray-500 mt-1' : 'mt-1'}>{s.date}</span>
                {i < order.status.length - 1 && (
                  <div className="w-full h-0.5 bg-gray-100 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            {order.products.map((p, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{p.color} | {p.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">${p.price.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Qty: {p.qty}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-400">Payment</div>
                <div className="flex items-center gap-2 mt-1">
                  <svg width="28" height="18" viewBox="0 0 28 18" fill="none"><rect width="28" height="18" rx="4" fill="#2563eb"/><text x="7" y="13" fontSize="8" fill="#fff">VISA</text></svg>
                  <span className="text-gray-700 font-medium">via {order.payment.method}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Delivery</div>
                <div className="mt-1 text-gray-700 font-medium">{order.delivery.address}</div>
                <div className="text-xs text-gray-400">{order.delivery.city}</div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <div className="text-sm font-semibold text-gray-700 mb-4">Order Summary</div>
              <div className="flex justify-between text-sm mb-2">
                <span>Price</span>
                <span>${order.summary.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Discount (20%)</span>
                <span className="text-green-500">-${order.summary.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Delivery</span>
                <span>${order.summary.delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tax</span>
                <span>${order.summary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold mt-4">
                <span>Total</span>
                <span>${order.summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
