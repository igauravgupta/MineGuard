import Review from "../models/review.model.js";
import asyncHandler from "../middlewares/asynchandler.middleware.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";

// Create a new review
const createReview = asyncHandler(async (req, res) => {
  const { review, rating } = req.body;
  const userId = req.user._id;

  if (!review || !rating) {
    throw new APIError("Review and rating are required!", 400);
  }

  const newReview = await Review.create({ userId, review, rating });

  return res.status(200).json(new APIResponse(200, "Review created successfully!", newReview));
});

// Get all reviews
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate("userId", "name");
  res.status(200).json(reviews);
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new APIError("Review not found!", 404);
  }
  await review.deleteOne();
  return res.status(200).json(new APIResponse(200, "Review deleted successfully!", review));
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { review, rating } = req.body;

  const existingReview = await Review.findById(id);

  if (!existingReview) {
    throw new APIError("Review not found!", 404);
  }

  if (existingReview.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Unauthorized to update this review!");
  }

  existingReview.review = review || existingReview.review;
  existingReview.rating = rating || existingReview.rating;
  
  const updatedReview = await existingReview.save();

  return res.status(200).json(new APIResponse(200, "Review updated successfully!", updatedReview));
});


export { createReview, getAllReviews, deleteReview, updateReview };