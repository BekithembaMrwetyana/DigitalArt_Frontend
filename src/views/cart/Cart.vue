<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>Your Cart</h1>
      <p>Review your items and proceed to checkout</p>
    </div>

    <div class="cart-container" v-if="!loading && cartItems.length">
      <div class="cart-list">
        <CartItemRow
          v-for="it in cartItems"
          :key="it.cartItem_id"
          :item="it"
        />
      </div>

      <aside class="cart-summary">
        <div class="summary-card">
          <h3>Order Summary</h3>
          <div class="summary-row"><span>Items</span><span>{{ cartCount }}</span></div>
          <div class="summary-row"><span>Subtotal</span><span>R{{ cartSubtotal.toFixed(2) }}</span></div>
          <div class="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
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
