import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";


export const usePartnerStore = create((set, get) => ({
    partner: null,
    setPartner: (partnerData) => set({ partner: partnerData }),
    getPartner: async () => {
      try {
        const response = await axios.get("/partners/profile");
        set({ partner: response.data });
        return response;
      } catch (error) {
        console.error('Error fetching partner data:', error);
        throw error;
      }
    }
  }));
  