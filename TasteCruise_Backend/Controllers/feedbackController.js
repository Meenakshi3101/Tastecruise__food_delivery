import Feedback from "../models/feedbackModel.js"; // Correct ES module import

// Submit new feedback
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, feedback, rating } = req.body;

    if (!name || !email || !feedback || typeof rating !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newFeedback = await Feedback.create({
      name,
      email,
      feedback,
      rating,
    });

    res.json({
      success: true,
      data: newFeedback,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("Get Feedbacks Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch feedbacks" });
  }
};
