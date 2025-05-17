import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "./useUserStore";

export const usePartnerStore = create((set, get) => ({
  partner: null,
  loading: false,
  partnerItems: [],
  setPartner: (partnerData) => set({ partner: partnerData }),
  getPartner: async (email) => {
    try {
      set({ loading: true });

      const response = await axios.get("/partners/profile", {
        params: { email: email } // or just { email } if variable name is the same
      });
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
      set({ partner: res.data.responseData,  loading: false });
      return res;
    } catch (error) {
      set({ loading: false });
      console.error('Error fetching partner data:', error);
      throw error;
    }
  },
getPartnerItems: async (partnerId) => {
  try {
    set({ loading: true });

    const response = await axios.get('/partners/items', 
      partnerId ? { params: { partnerId } } : undefined
    );

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
    const useR = useUserStore.getState().user;
    // Find the current product and its status
    const currentItems = get().partnerItems;
    const product = currentItems.find(item => item._id === productId);
    const wasActive = product?.isActive;
    await axios.put('/partners/toggle-active', { productId });

    // Update the local state to reflect the change
    const updatedItems = currentItems.map(item =>
      item._id === productId ? { ...item, isActive: !item.isActive } : item
    );

    set({ partnerItems: updatedItems, loading: false });
    toast.success("Product status updated successfully");

    // Log the toggle action

    await axios.post('/admins/logs', {
      action: wasActive ? "Toggle Off" : "Toggle On",
      user: useR?._id,
      role: useR?.role,
      details: `Product: ${product?.productName} is now ${wasActive ? "Inactive" : "Active"}`
    });

    // return response.data;
  } catch (error) {
    set({ loading: false });
    console.error("Error updating product status:", error);
    toast.error("Failed to update product status");
    throw error;
  }
}
}));
