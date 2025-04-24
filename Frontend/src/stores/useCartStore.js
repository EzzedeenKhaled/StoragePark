import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],

	addToCart: async (productId) => {
		try {
			await axios.post("/cart/cart-add", { productId });
			toast.success("Product added to cart");
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},

}));
