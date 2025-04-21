import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup_Done: async ({ certificateFile, businessLicenseFile, taxComplianceFile }) => {
		const formData = new FormData();

		formData.append("certificateFile", certificateFile);
		formData.append("businessLicenseFile", businessLicenseFile);
		formData.append("taxComplianceFile", taxComplianceFile);

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
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error("Error uploading files:", error);
			toast.error("Failed to upload files. Please try again.");
		} finally {
			set({ loading: false });
		}
	},

	updateUserCustomer: async (formData) => {
		const { firstName, email, lastName, phone: phoneNumber } = formData;
		set({ loading: true });

		try {
			const res = await axios.post("/customers/update", { firstName, lastName, email, phoneNumber });
			set({ user: res.data.data, loading: false });
			return res.status;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	signup_Next: async (formData) => {
		const { firstName, lastName, companyName, email, phone, address, website, googleProfile, role } = formData;
		set({ loading: true });

		try {
			const res = await axios.post("/partners/signup-partner", { firstName, lastName, companyName, email, phone, address, website, googleProfile, role });
			set({ loading: false });
			return res.data
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	signup: async (formData) => {
		const { firstName, lastName, email, phone, password, role } = formData;
		set({ loading: true });
		let res = null;
		try {
			res = await axios.post("/auth/signup", { firstName, lastName, phone, email, password, role });
			set({ user: res.data.data, loading: false });
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
			if (res.status !== 200) {
				toast.error("Invalid credentials");
			}
			console.log("login: ",res.data)
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "An error occurred during login");
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
		formData.append('storageCondition', data.storageCondition);
		formData.append('packagingType', data.packagingType);
		formData.append('packageWidth', data.packageWidth);
		formData.append('packageHeight', data.packageHeight);
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
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error("Failed to create product. Please try again.");
		} finally {
			set({ loading: false });
		}
	},
	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			console.log("checkAuth: ",response.data)
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
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