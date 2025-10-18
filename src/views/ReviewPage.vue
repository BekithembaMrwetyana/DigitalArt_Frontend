<template>
  <div class="review-page">
    <div class="container">
      <h1>What Our Customers think About Us!</h1>

      
      <div v-if="message" :class="['message', messageType, 'top-message']">
        {{ message }}
      </div>

      
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'write' }" 
          @click="activeTab = 'write'"
        >
          My Purchases
        </button>
        <button 
          :class="{ active: activeTab === 'view' }" 
          @click="activeTab = 'view'"
        >
          All Reviews
        </button>
      </div>

      
      <div v-if="activeTab === 'write'" class="write-review-section">
        <h2>Write a Review</h2>

        <div v-if="completedProducts.length === 0" class="no-products">
          <p>You don't have any completed orders yet.</p>
          <p class="info-text">Orders must be marked as "COMPLETED" by admin before you can review them.</p>
        </div>


        <div v-else class="products-list">
          <div 
            v-for="item in completedProducts" 
            :key="`${item.orderId}-${item.product.productID}`" 
            class="product-item"
          >
            <div class="product-info">
              <h3>{{ item.product.title }}</h3>
              <p class="order-info">Order #{{ item.orderId }} - {{ formatDate(item.orderDate) }}</p>
              <p class="price">R{{ item.product.price }}</p>
            </div>


            <div v-if="selectedProductId !== item.product.productID" class="action-section">
              <button @click="startReview(item)" class="btn-review">
                ⭐ Write Review
              </button>
            </div>


            <div v-else class="review-form-inline">
              <div class="form-group">
                <label>Your Rating</label>
                <div class="star-rating">
                  <span 
                    v-for="star in 5" 
                    :key="star"
                    @click="reviewData.rating = star"
                    :class="{ filled: star <= reviewData.rating }"
                    class="star"
                  >
                    ★
                  </span>
                </div>
                <p class="rating-text">{{ getRatingText(reviewData.rating) }}</p>
              </div>

              <div class="form-group">
                <label>Your Review</label>
                <textarea 
                  v-model="reviewData.comment" 
                  class="form-control"
                  rows="4"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>

              <div class="button-group">
                <button @click="submitReview" class="btn btn-primary" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Submitting...' : '✓ Submit Review' }}
                </button>
                <button @click="cancelReview" class="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div v-if="activeTab === 'view'" class="view-reviews-section">
        <h2>All Reviews</h2>


        <div v-if="reviews.length > 0" class="reviews-list">
          <div v-for="review in reviews" :key="review.reviewId" class="review-card">
            <div class="review-header">
              <div class="review-product">
                <strong>{{ getProductName(review) }}</strong>
              </div>
              <div class="review-rating">
                <span v-for="star in 5" :key="star" :class="{ filled: star <= review.rating }">
                  ★
                </span>
              </div>
            </div>
            <div class="review-body">
              <p>{{ review.comment }}</p>
            </div>
            <div class="review-footer">
              <span class="review-author">By: {{ getUserName(review) }}</span>
              <span class="review-date">{{ formatDate(review.reviewDate) }}</span>
            </div>
          </div>
        </div>

        <div v-else class="no-reviews">
          <p>No reviews available yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewService from '@/services/ReviewService';
import OrderService from '@/services/OrderService';
import axios from 'axios';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'ReviewPage',
  setup() {
    const store = useStore();
    const user = computed(() => store.getters['Auth/user']);
    return { user };
  },
  data() {
    return {
      activeTab: 'write',
      completedOrders: [],
      completedProducts: [],
      allProducts: [],
      reviews: [],
      selectedProductId: '',
      selectedOrderId: '',
      selectedOrderDate: '',
      reviewData: {
        rating: 0,
        comment: ''
      },
      message: '',
      messageType: '',
      isSubmitting: false
    };
  },
  computed: {
    userId() {
      return this.user?.userId || localStorage.getItem('userId') || 1;
    }
  },
  mounted() {
    this.loadCompletedProducts();
    this.loadAllProducts();
    this.loadReviews();
  },
  methods: {
    async loadCompletedProducts() {
      try {
        const orders = await OrderService.getOrdersByUserId(this.userId);
        this.completedOrders = orders.filter(
          order => order.paymentStatus?.toUpperCase() === 'COMPLETED'
        );
        this.completedProducts = [];
        this.completedOrders.forEach(order => {
          if (order.cartItems && order.cartItems.length > 0) {
            order.cartItems.forEach(item => {
              this.completedProducts.push({
                orderId: order.orderID,
                orderDate: order.orderDate,
                product: item.product
              });
            });
          }
        });
      } catch (error) {
        console.error('Error loading completed products:', error);
        this.showMessage('Failed to load your purchases', 'error');
      }
    },

    startReview(item) {
      this.selectedProductId = item.product.productID;
      this.selectedOrderId = item.orderId;
      this.selectedOrderDate = item.orderDate;
      this.reviewData = { rating: 0, comment: '' };
    },

    cancelReview() {
      this.selectedProductId = '';
      this.selectedOrderId = '';
      this.reviewData = { rating: 0, comment: '' };
    },

    async loadAllProducts() {
      try {
        const response = await axios.get('http://localhost:8080/digital_artDB/api/product/getall');
        this.allProducts = response.data;
      } catch (error) {
        console.error('Error loading products:', error);
      }
    },

    async loadReviews() {
      try {
        this.reviews = await ReviewService.getAllReviews();
      } catch (error) {
        console.error('Error loading reviews:', error);
        this.showMessage('Failed to load reviews', 'error');
      }
    },

    async submitReview() {
      if (!this.reviewData.rating) {
        this.showMessage('Please select a rating', 'error');
        return;
      }

      if (!this.reviewData.comment.trim()) {
        this.showMessage('Please write a review comment', 'error');
        return;
      }

      this.isSubmitting = true;

      try {
        const reviewPayload = {
          product: {
            productID: this.selectedProductId
          },
          rating: this.reviewData.rating,
          comment: this.reviewData.comment,
          reviewDate: new Date().toISOString().split('T')[0]
        };

        await ReviewService.createReview(this.userId, reviewPayload);
        this.showMessage('Review submitted successfully! Thank you for your feedback.', 'success');
        
        this.reviewData = { rating: 0, comment: '' };
        this.selectedProductId = '';
        this.selectedOrderId = '';
        this.loadReviews();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error submitting review:', error);
        this.showMessage('Failed to submit review. Please try again.', 'error');
      } finally {
        this.isSubmitting = false;
      }
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 5000);
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    getProductName(review) {
      if (review.productName) return review.productName;
      if (review.product?.title) return review.product.title;
      return 'Product';
    },

    getUserName(review) {
      if (review.userName) return review.userName;
      if (review.user?.firstName) {
        return review.user.lastName 
          ? `${review.user.firstName} ${review.user.lastName}` 
          : review.user.firstName;
      }
      return 'User';
    },

    getRatingText(rating) {
      const texts = {
        0: 'Select a rating',
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      };
      return texts[rating] || '';
    }
  }
};
</script>

<style scoped>
.review-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.container {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  padding: 12px 24px;
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tabs button:hover {
  color: #333;
}

.tabs button.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

/* Grid for My Purchases */
.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
  align-items: stretch;
}

/* Grid for All Reviews */
.reviews-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
  align-items: stretch;
}

/* Shared Card Styles */
.product-item,
.review-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.product-item:hover,
.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.review-body {
  flex: 1;
  margin: 12px 0;
}

.review-body p {
  margin: 0;
  line-height: 1.5;
}

.review-rating span {
  font-size: 20px;
  color: #ddd;
}

.review-rating span.filled {
  color: #ffc107;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #888;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: #888;
}

/* Stars */
.star {
  font-size: 24px;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}

.star.filled {
  color: #ffc107;
}

/* Buttons */
.btn-review {
  background-color: #007bff;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-review:hover {
  background-color: #0056b3;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-primary {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
}

.btn-secondary {
  background: #ccc;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
}

/* Message / Toast at Top */
.top-message {
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 5px;
  text-align: center;
}

.message.success {
  background: #d4edda;
  color: #155724;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
}


@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .tabs button {
    flex: 1;
  }
}
</style>
