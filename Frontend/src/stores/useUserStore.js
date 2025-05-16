import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";


export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: false,
	activeItems: [],
	category: [],
	wishlist: [],
 	setUser: (newUser) => set({ user: newUser }),
	addToWishlist: async (itemId) => {
		try {
			const res = await axios.post("/wishlist/add-to-wishlist", { itemId });
			set({ wishlist: res.data.wishlist });
			toast.success("Item added to wishlist");
		} catch (error) {
			console.error("Error adding to wishlist:", error);
			toast.error("Failed to add item to wishlist");
		}
	},
	makeOrder: async (orderData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/orders/make-order", orderData);
			set({ loading: false });
			toast.success("Order placed successfully!");

			return res;
		} catch (error) {
			console.error("Error placing order:", error);
			toast.error("Failed to place order");
			set({ loading: false });
		}
	},
	removeFromWishlist: async (itemId) => {
		set({ loading: true });
		try {
			//   // Optimistically update the UI
			//   set(state => ({
			// 	wishlist: state.wishlist.filter(item => item._id !== itemId),
			// 	loading: false
			//   }));

			// Then make the API call
			const res = await axios.delete("/wishlist/remove-from-wishlist", {
				data: { productId: itemId }
			});

			// Final update with server response
			set({ wishlist: res.data.wishlist, loading: false });
			toast.success("Removed from wishlist");
			return res.data.wishlist;
		} catch (error) {
			// Revert if error occurs
			set(state => ({
				wishlist: state.wishlist, // Keep current state
				loading: false
			}));
			console.error("Error removing from wishlist:", error);
			toast.error("Failed to remove from wishlist");
			throw error;
		}
	},

	getWishlist: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/wishlist/get-wishlist");
			set({ wishlist: res.data.wishlist, loading: false });
			return res;
		} catch (error) {
			console.error("Error fetching wishlist:", error);
			// toast.error("Failed to fetch wishlist");
			set({ loading: false });
		}
	},
	signup_Done: async (formdata, email) => {
		const { certificateFile, businessLicenseFile, taxComplianceFile } = formdata;
		const formData = new FormData();

		formData.append("certificateFile", certificateFile);
		formData.append("businessLicenseFile", businessLicenseFile);
		formData.append("taxComplianceFile", taxComplianceFile);
		formData.append("email", email);

		set({ loading: true });

		try {
			const response = await axios.post("/partners/upload-documents", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data.message) {
				toast.success("Files uploaded successfully!");
			} else {
				toast.error("Error uploading files");
			}
			set({ loading: false });
			return response;
		} catch (error) {
			console.error("Error uploading files:", error);
			toast.error("Failed to upload files. Please try again.");
		} finally {
			set({ loading: false });
		}
	},

	updateUserCustomer: async (formData) => {
		set({ loading: true });

		try {
			const data = new FormData();
			data.append("firstName", formData.firstName);
			data.append("lastName", formData.lastName);
			data.append("email", formData.email);
			data.append("phoneNumber", formData.phone);

			if (formData.image) {
				data.append("profileImage", formData.image); // key should match your backend expectation
			}

			const res = await axios.post("/customers/update", data, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			set({ user: res.data.data, loading: false });
			return res.status;
		} catch (error) {
			set({ loading: false });
			// toast.error("An error occurred in updating user customer");
		}
	},

	signup_Next: async (formData) => {
		const { firstName, lastName, companyName, email, phone: phoneNumber, address, website, googleProfile, role } = formData;
		set({ loading: true });
		try {
			const res = await axios.post("/partners/signup-partner", { firstName, lastName, companyName, email, phoneNumber, address, website, googleProfile, role });
			set({ loading: false });
			return res.data
		} catch (error) {
			set({ loading: false });
			toast.error("An error occurred in signUp next");
		}
	},
	signup: async (formData) => {
		const { firstName, lastName, email, phone, password, role } = formData;
		set({ loading: true });
		let res = null;
		try {
			res = await axios.post("/auth/signup", { firstName, lastName, phone, email, password, role });
			set({ loading: false });
			return res;
		} catch (error) {
			set({ loading: false });
			console.error("An error occurred");
			return error.status;
		}
	},
	login: async (email, password) => {
		set({ loading: true });
	  
		try {
		  const res = await axios.post("/auth/login", { email, password });
		  set({ user: res.data, loading: false });
		  return res.status;
		} catch (error) {
		  set({ loading: false });
		  console.error("Login error:", error);
		  return error.response?.status;
		}
	  },
	resetPassword: async (password, confirmPassword, email) => {
		set({ loading: true });
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			set({ loading: false });
			return;
		}
		try {
			const res = await axios.post("/auth/reset-password", { email, password });
			toast.success("Password reset successfully");
			set({ loading: false });
			return res.status;
		} catch (error) {
			set({ loading: false });
			toast.error("An error occurred during password reset");
		}
	},
	productFormSubmit: async (data) => {
		const formData = new FormData();
		formData.append("imageProduct", data.imageProduct);
		formData.append('category', data.category);
		formData.append('productName', data.productName);
		formData.append('weight', data.weight);
		formData.append('quantity', data.quantity);
		formData.append('pricePerUnit', data.pricePerUnit);
		formData.append('description', data.description);
		formData.append('brand', data.brand);
		// formData.append('storageCondition', data.storageCondition);
		formData.append('packagingType', data.packagingType);
		formData.append('packageWidth', data.packageWidth);
		formData.append('packageHeight', data.packageHeight);
		if (data.location) {
			formData.append('aisleNumber', data.location.aisleNumber);
			formData.append('rowNumber', data.location.rowNumber);
			formData.append('side', data.location.side);
		}
		if (data.reservedRowId) {
			formData.append('reservedRowId', data.reservedRowId);
		}
		// Get partnerId from localStorage
		const user = get().user;
		const partnerId = localStorage.getItem('partnerId') || user?._id;
		console.log("Product data:", data);
		if (partnerId) {
			formData.append('partner', partnerId);
		}
		set({ loading: true });
		try {
			const response = await axios.post("/products/create", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (response.data.message) {
				toast.success("Product created successfully!");
			} else {
				toast.error("Error submitting form");
			}
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error("Failed to create product. Please try again.", error);
		} finally {
			set({ loading: false });
		}
	},
	fetchActiveItems: async () => {
		set({ loading: true });
		try {
			const res = await axios.get('/products/active-items');
			set({ activeItems: res.data, loading: false });
		} catch (err) {
			console.error("Error fetching active items:", err);
			set({ loading: false });
		}
	},
	fetchItemsByCategory: async (category) => {
		set({ loading: true });
		try {
			const res = await axios.get(`/products/category/${category}`, {rel:0});
			set({ category: res.data, loading: false });
		} catch (err) {
			console.error("Error fetching items by category:", err);
			set({ loading: false });
		}
	},
	logout: async () => {
		try {
			await axios.post("/auth/logout");

			// const user = useUserStore.getState().user;	

			//   if (user) {
			// 	// Optional: you can also clear temporary in-memory wishlist if you have one
			// 	localStorage.removeItem(`wishlist_temp_${user._id}`);
			//   }

			set({ user: null });
		} catch (error) {
			console.log(error)
			// toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
		  const response = await axios.get("/auth/profile");
		  set({ user: response.data, checkingAuth: false});
		} catch (error) {
		  console.log("checkAuth error:", error.message);
		  set({ user: null, checkingAuth: false });
		}
	  },	  

	forgotPassword: async (email) => {
		try {
			const response = await axios.post("/auth/forgot-password", { email });
			return response.status;
		} catch (error) {
			toast.error("Email not found");
			console.log(error)
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);