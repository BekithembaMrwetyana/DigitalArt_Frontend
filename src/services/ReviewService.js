import axios from "axios";

const BASE_URL = "http://localhost:8080/digital_artDB/api/review";

export default {
  /**
   * Create a new review
   * @param {number} userId - ID of the user creating the review
   * @param {object} reviewData - Review data containing product, rating, comment
   * @returns {Promise} - Created review data
   */
  createReview(userId, reviewData) {
    return axios
      .post(`${BASE_URL}/create/${userId}`, reviewData)
      .then(res => res.data)
      .catch(err => {
        console.error("Error creating review:", err);
        throw err;
      });
  },

  /**
   * Get all reviews
   * @returns {Promise} - Array of all reviews
   */
  getAllReviews() {
    return axios
      .get(`${BASE_URL}/getAll`)
      .then(res => res.data)
      .catch(err => {
        console.error("Error fetching all reviews:", err);
        throw err;
      });
  },

  /**
   * Get reviews for a specific product
   * @param {number} productId - ID of the product
   * @returns {Promise} - Array of reviews for the product
   */
  getReviewsByProduct(productId) {
    return axios
      .get(`${BASE_URL}/product/${productId}`)
      .then(res => res.data)
      .catch(err => {
        console.error("Error fetching product reviews:", err);
        throw err;
      });
  },

  /**
   * Get reviews by a specific user
   * @param {number} userId - ID of the user
   * @returns {Promise} - Array of reviews created by the user
   */
  getReviewsByUser(userId) {
    return axios
      .get(`${BASE_URL}/user/${userId}`)
      .then(res => res.data)
      .catch(err => {
        console.error("Error fetching user reviews:", err);
        throw err;
      });
  },

  /**
   * Get a single review by ID
   * @param {number} reviewId - ID of the review
   * @returns {Promise} - Review data
   */
  getReviewById(reviewId) {
    return axios
      .get(`${BASE_URL}/read/${reviewId}`)
      .then(res => res.data)
      .catch(err => {
        console.error("Error fetching review:", err);
        throw err;
      });
  },

  /**
   * Update an existing review
   * @param {object} reviewData - Updated review data
   * @returns {Promise} - Updated review data
   */
  updateReview(reviewData) {
    return axios
      .put(`${BASE_URL}/update`, reviewData)
      .then(res => res.data)
      .catch(err => {
        console.error("Error updating review:", err);
        throw err;
      });
  },

  /**
   * Delete a review
   * @param {number} reviewId - ID of the review to delete
   * @returns {Promise}
   */
  deleteReview(reviewId) {
    return axios
      .delete(`${BASE_URL}/delete/${reviewId}`)
      .then(res => res.data)
      .catch(err => {
        console.error("Error deleting review:", err);
        throw err;
      });
  }
};

