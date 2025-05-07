import Review from "../models/review.model.js";
import Item from "../models/item.model.js";
import User from "../models/user.model.js";
export const addReview = async (req, res) => {
    try {
        const { itemId, rating, comment } = req.body;

        if (!itemId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userId = req.user._id;

        // Check if the user has bought this item in any of their orders
        const hasPurchased = await User.findOne({
            _id: userId,
            "orders.items.item": itemId
        });

        // Create review with verified flag based on purchase
        let review = await Review.create({
            item: itemId,
            rating,
            comment,
            user: userId,
            date: new Date(),
            verified: !!hasPurchased // will be true if found, otherwise false
        });

        review = await review.populate("user", "firstName");

        console.log("Review added successfully:", review);
        res.status(201).json(review);
    } catch (error) {
        console.error("Error adding review:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getPartnerRatingsSummary = async (req,res) => {
    try {
        const partnerId = req.query.partnerId || req.user._id;
        // Step 1: Get all items posted by this partner
        const partnerItems = await Item.find({ partner: partnerId }).select('_id');
        const itemIds = partnerItems.map(item => item._id);
        
        // Step 2: Get all reviews for these items
        const reviews = await Review.find({ item: { $in: itemIds } });
        
        // Step 3: Classify reviews
        let positive = 0;
        let negative = 0;
        let total = reviews.length;
        
        reviews.forEach(review => {
            if (review.rating >= 3) {
                positive++;
            } else {
                negative++;
            }
        });
        
        res.status(200).json({
            total,
            positive,
            negative
        });
    } catch (error) {
      console.error("Error fetching partner ratings:", error);
      throw error;
    }
  };

export const getReviewsByItemId = async (req, res) => {
    const { itemId } = req.params;

    try {
        const reviews = await Review.find({ item: itemId })
            .populate("user", "firstName") // only populate name fields
            .sort({ createdAt: -1 }); // optional: newest first

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

export const getReviewsByCategory = async (req, res) => {
    const { categoryName } = req.params;
    try {
        // Correct field name is "category", not "categoryName"
        const items = await Item.find({ category: categoryName }).select("_id");
        console.log("Items in category:", items);
        const itemIds = items.map(item => item._id);

        const reviews = await Review.find({ item: { $in: itemIds } })
            .populate("user", "firstName")
            .populate("item", "productName category")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews by category:", error.message);
        res.status(500).json({ message: "Failed to fetch reviews by category" });
    }
};
