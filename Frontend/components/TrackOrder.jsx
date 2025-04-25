import React from 'react'

const TrackOrder = () => {
    return (
        <div className="relative mt-5">
            <img
                src="/hero-image.png"
                alt="Order Tracking Hero Image"
                className="w-full"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black/50">
                <h1 className="text-4xl font-bold mb-2">Order Tracking Made Simple</h1>
                <p className="text-xl mb-5">Real-Time Updates at Your Fingertips</p>
                <button
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded"
                >
                    Track Your Order
                </button>
            </div>
        </div>
    )
}

export default TrackOrder
