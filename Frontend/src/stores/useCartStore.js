import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	loading: false,
	addToCart: async (product) => {
		try {
			await axios.post("/cart/cart-add", { productId: product._id });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error("An error occurred in Add to Cart");
		}
	},
	clearCart: async () => {
		set({ cart: [], total: 0, subtotal: 0 });
	},
	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},
	updateQuantity: async (productId, quantity) => {
		try{
		console.log("Updating quantity for product:", productId, "to", quantity);
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		const res = await axios.put(`/cart/${productId}`, { quantity });
		console.log("ee: ",res)
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	} catch (err) {
		toast.error("Error Updating Quantity")
		console.log(err)
	}
	},
	calculateTotals: () => {
		const { cart } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

		let total = subtotal;

		set({ subtotal, total });
	},
	getCartItems: async () => {
		try {
			set({ loading: true });
			const res = await axios.get("/cart");
			set({ cart: res.data, loading: false });

			get().calculateTotals();
		} catch (error) {
			set({ cart: [], loading: false });
			toast.error("An error occurred in cart items");
		}
	},
}));