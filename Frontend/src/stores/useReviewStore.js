import { create } from "zustand";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";

export const useReviewStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/reviews/getItemRev/${itemId}`);
      set({ reviews: response.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
      toast.error("Failed to fetch reviews");
    }
  },

  addReview: async (reviewData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/reviews/addReviews', reviewData);
      set((state) => ({
        reviews: [...state.reviews, response.data],
        loading: false,
      }));
      toast.success("Review added successfully");
    } catch (error) {
      set({ loading: false, error: error.message });
      toast.error("Failed to add review");
    }
  },
  fetchReviewsByCategory: async (categoryName) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/reviews/getCategoryRev/${categoryName}`);
      console.log("Category reviews:", response.data);
      set({ reviews: response.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
      toast.error("Failed to fetch category reviews");
    }
  }
}));
