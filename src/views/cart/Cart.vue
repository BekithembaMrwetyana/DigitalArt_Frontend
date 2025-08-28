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
          @updateQty="onUpdateQty"
          @remove="removeItem"
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
import { getCartItemsByUserId, deleteCartItem, updateCartItem } from "@/services/CartItemService";
import CartItemRow from "@/components/cart/CartItemRow.vue";

export default {
  components: { CartItemRow },

  data() {
    return {
      cartItems: [],
      error: null,
      loading: false,
    };
  },

  mounted() {
    if (this.isLoggedIn()) {
      this.fetchCart();
    }
  },

  computed: {
    cartCount() {
      return this.cartItems.reduce((sum, it) => sum + (it.quantity || 0), 0);
    },
    cartSubtotal() {
      return this.cartItems.reduce((sum, it) => {
        const qty = it.quantity || 0;
        const price = it.price ?? it.product?.price ?? 0;
        return sum + qty * price;
      }, 0);
    },
  },

  methods: {
    isLoggedIn() {
      const user = localStorage.getItem("user");
      return user !== null;
    },

    async fetchCart() {
      try {
        this.loading = true;
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const cartData = await getCartItemsByUserId(user.userId);
          this.cartItems = cartData.map((item) => ({
            ...item,
            product: item.product || {},
            productName: item.product?.productName || "Unnamed Product",
          }));
        }
      } catch (error) {
        this.error = "Failed to load cart.";
      } finally {
        this.loading = false;
      }
    },

    async removeItem(id) {
      try {
        await deleteCartItem(id);
        this.cartItems = this.cartItems.filter((item) => item.cartItem_id !== id);
      } catch (error) {
        alert("Failed to remove item from cart.");
      }
    },

    async onUpdateQty({ id, quantity, price, product, user }) {
      try {
        const updatedItem = { cartItem_id: id, quantity, price, product, user };
        await updateCartItem(updatedItem);
        this.fetchCart();
      } catch (error) {
        alert("Failed to update quantity.");
      }
    },

    proceedToCheckout() {
      if (!this.isLoggedIn()) {
        alert("Please log in to proceed to checkout.");
        return;
      }
      this.$router.push({ name: "Checkout" });
    },

    goToHome() {
      this.$router.go(-1);
    },
  },
};
</script>
