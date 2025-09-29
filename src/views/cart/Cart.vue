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
    proceedToCheckout() {
      const user = localStorage.getItem("user");
      if (!user) { alert("Please log in to proceed to checkout."); return; }
      this.$router.push({ name: "Checkout" });
    },
    goToHome() { this.$router.go(-1); },
  },
};
</script>

<style scoped>
.cart-page {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
}

.cart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cart-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Cart List */
.cart-list {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Individual Cart Item is now handled by CartItemRow card style, so no need to duplicate */

/* Cart Summary */
.cart-summary {
  flex: 1;
}
.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.summary-card h3 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
}
.summary-row, .summary-total {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}
.summary-total {
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
}
.checkout-btn {
  background: #2563eb;
  color: white;
  border: none;
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.checkout-btn:hover {
  background: #1d4ed8;
}
.continue-btn {
  background: #f1f5f9;
  color: #333;
  border: none;
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
}
.continue-btn:hover {
  background: #e2e8f0;
}

/* Cart Empty */
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
  font-size: 4rem;
  margin-bottom: 1rem;
}

.cart-empty h3 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

.cart-empty p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.cart-empty .browse-btn {
  background: #2563eb;
  color: #fff;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.cart-empty .browse-btn:hover {
  background: #1d4ed8;
}
</style>
