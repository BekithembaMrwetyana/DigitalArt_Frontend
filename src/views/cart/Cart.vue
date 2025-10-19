<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>Your Cart</h1>
      <p>Review your items and proceed to checkout</p>
    </div>

    <div class="cart-container" v-if="!loading && cartItems.length">
      <!-- Cart List -->
      <div class="cart-list">
        <CartItemRow
          v-for="item in cartItems"
          :key="item.cartItemID || item.id"
          :item="item"
        />
      </div>

      <!-- Cart Summary -->
      <aside class="cart-summary">
        <div class="summary-card">
          <h3>Cart Summary</h3>
          <div class="summary-row"><span>Items</span><span>{{ cartCount }}</span></div>
          <div class="summary-row"><span>Subtotal</span><span>R{{ cartSubtotal.toFixed(2) }}</span></div>
          <div class="summary-total"><span>Total</span><span>R{{ cartSubtotal.toFixed(2) }}</span></div>
          <button class="checkout-btn" @click="proceedToCheckout">Proceed to Checkout</button>
          <button class="continue-btn" @click="goToHome">Continue Shopping</button>
        </div>
      </aside>
    </div>

    <!-- Empty Cart -->
    <div class="cart-empty" v-else-if="!loading && !cartItems.length">
      <div class="icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Browse the gallery and add some artworks.</p>
      <router-link to="/gallery" class="browse-btn">Browse Gallery</router-link>
    </div>

    <!-- Loading -->
    <div class="cart-loading" v-else>
      Loading your cart...
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CartItemRow from "@/components/cart/CartItemRow.vue";
import OrderService from "@/services/OrderService";

export default {
  components: { CartItemRow },
  computed: {
    ...mapGetters("Cart", ["cartItems", "cartCount", "cartSubtotal"]),
    loading() { return this.$store.state.Cart.loading; },
  },
  mounted() {
    this.$store.dispatch("Cart/fetchUserCart");
  },
  

methods: {
  async proceedToCheckout() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to proceed to checkout.");
      return;
    }

    const orderDTO = {
      userId: user.userId,
      totalAmount: this.cartSubtotal,
      orderAmount: this.cartSubtotal,
      cartItems: this.cartItems.map(item => ({
        productId: item.product.productID,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const createdOrder = await OrderService.createOrder(orderDTO);
      console.log("Order created:", createdOrder);
      this.$router.push({ name: "MyOrders" }); // redirect to orders page
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to create order. Please try again.");
    }
  }
}
 ,

    goToHome() { this.$router.go(-1); 
  },
};
</script>

<style scoped>
.cart-page {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.cart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cart-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
}

.cart-header p {
  color: #555;
  font-size: 1rem;
}

/* Container */
.cart-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

/* Cart List */
.cart-list {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Cart Summary */
.cart-summary {
  flex: 1;
}

.summary-card {
  background: linear-gradient(135deg, #ffffff, #f9fafb);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.summary-card h3 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #1e3a8a;
}

.summary-row, .summary-total {
  display: flex;
  justify-content: space-between;
  margin: 0.6rem 0;
  font-size: 1rem;
}

.summary-total {
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
}

/* Buttons */
.checkout-btn {
  background: linear-gradient(90deg, #4f46e5, #2563eb);
  color: white;
  border: none;
  width: 100%;
  padding: 0.9rem;
  margin-top: 1rem;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  background: linear-gradient(90deg, #3730a3, #1d4ed8);
}

.continue-btn {
  background: #f1f5f9;
  color: #1e3a8a;
  border: none;
  width: 100%;
  padding: 0.9rem;
  margin-top: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  background: #e0e7ff;
}

/* Empty Cart */
.cart-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #555;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.cart-empty .icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  color: #2563eb;
  animation: bounce 1.2s infinite;
}

.cart-empty h3 {
  font-size: 1.7rem;
  margin: 0.5rem 0;
  font-weight: 600;
  color: #1e3a8a;
}

.cart-empty p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.cart-empty .browse-btn {
  background: linear-gradient(90deg, #4f46e5, #2563eb);
  color: #fff;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;
}

.cart-empty .browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  background: linear-gradient(90deg, #3730a3, #1d4ed8);
}

/* Bounce animation for empty cart icon */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-container {
    flex-direction: column;
  }
}
</style>
