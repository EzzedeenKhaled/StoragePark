import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";


export const usePartnerStore = create((set, get) => ({
  partner: null,
  loading: false,
  partnerItems: [],
  setPartner: (partnerData) => set({ partner: partnerData }),
  getPartner: async () => {
    try {
      set({ loading: true });

      const response = await axios.get("/partners/profile");
      set({ partner: response.data, loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      console.error('Error fetching partner data:', error);
      throw error;
    }
  },
  updateUserPartner: async (formData) => {
    try {

      const { email } = formData;
      const data = new FormData();
      data.append("email",email);
      if (formData.image) {
        data.append("profileImage", formData.image);
      }
      set({ loading: true });
			const res = await axios.post("/partners/update", data, {
				headers: { "Content-Type": "multipart/form-data" },
			});
      set({ partner: res.data,  loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Error fetching partner data:', error);
      throw error;
    }
  },
  getPartnerItems: async () => {
    try {
      set({ loading: true });
      const response = await axios.get('/partners/items');
      set({ partnerItems: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching partner items:", error);
      toast.error("Could not fetch items");
      throw error;
    }
  },
  toggleProductStatus: async (productId) => {
    try {
      set({ loading: true });
      // Find the current product status to toggle it
      const currentItems = get().partnerItems;
      await axios.put('/partners/toggle-active', {productId});
      
      // Update the local state to reflect the change
      const updatedItems = currentItems.map(item => 
        item._id === productId ? { ...item, isActive: !item.isActive } : item
      );
      
      set({ partnerItems: updatedItems, loading: false });
      toast.success("Product status updated successfully");
      
      // return response.data;
    } catch (error) {
      set({ loading: false });
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
      throw error;
    }
  },
}));
