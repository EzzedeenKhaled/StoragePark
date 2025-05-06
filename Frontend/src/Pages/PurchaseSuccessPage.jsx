import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const { clearCart } = useCartStore();

	useEffect(() => {
		clearCart();
	}, []);

	return (
		<div className='h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#ff9800] to-white'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>

<div className='max-w-md w-full bg-[#1D2126] rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-[#FF8B13] w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-[#FF8B13] mb-2'>
						Purchase Successful!
					</h1>

					<p className='text-gray-300 text-center mb-2'>
						Thank you for your order. {"We're"} processing it now.
					</p>
					<p className='text-[#FF8B13] text-center text-sm mb-6'>
						Check your email for order details and updates.
					</p>
					<div className='bg-[#1D2126] rounded-lg p-4 mb-6 border border-[#FF8B13]'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-400'>Order number</span>
							<span className='text-sm font-semibold text-[#FF8B13]'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-[#FF8B13]'>3 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
					<button className='w-full bg-[#FF8B13] hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to={"/ecommerce"}
							className='w-full bg-[#1D2126] hover:bg-gray-700 text-[#FF8B13] font-bold py-2 px-4 
        rounded-lg transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;
