<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>Your Cart</h1>
      <p>Review your items and proceed to checkout</p>
    </div>

    <div class="cart-container" v-if="!loading && cartItems.length">
      <div class="cart-list">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <CartItemRow v-for="item in cartItems" :key="item.cartItemID" :item="item" />
          </tbody>
        </table>
      </div>

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

    <div class="cart-empty" v-else-if="!loading && !cartItems.length">
      <div class="icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Browse the gallery and add some artworks.</p>
      <router-link to="/gallery" class="browse-btn">Browse Gallery</router-link>
    </div>

    <div class="cart-loading" v-else>
      Loading your cart...
    </div>
  </div>
</template>

<script>
import CartItemRow from "@/components/cart/CartItemRow.vue";

export default {
  components: { CartItemRow },
  computed: {
    cartItems() { return this.$store.getters["Cart/cartItems"]; },
    cartCount() { return this.$store.getters["Cart/cartCount"]; },
    cartSubtotal() { return this.$store.getters["Cart/cartSubtotal"]; },
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
.cart-header h1 {
  font-size: 2rem;
  font-weight: bold;
}
.cart-header p {
  color: #666;
}

.cart-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.cart-list {
  flex: 2;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.cart-table th, .cart-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}
.cart-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}
.cart-table tr:hover {
  background: #fafafa;
}

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

.cart-empty {
  text-align: center;
  padding: 3rem;
}
.cart-empty .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.browse-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}
.browse-btn:hover {
  background: #1d4ed8;
}

.cart-loading {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}
</style>
