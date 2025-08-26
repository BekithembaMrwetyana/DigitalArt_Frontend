<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>Your Cart</h1>
      <p>Review your items and proceed to checkout</p>
    </div>

    <div class="cart-container" v-if="!loading && items.length">
      <div class="cart-list">
        <CartItemRow
          v-for="it in items"
          :key="it.id ?? it.cartItem_id"
          :item="it"
          @updateQty="onUpdateQty"
          @remove="onRemove"
        />
      </div>

      <aside class="cart-summary">
        <div class="summary-card">
          <h3>Order Summary</h3>
          <div class="summary-row"><span>Items</span><span>{{ count }}</span></div>
          <div class="summary-row"><span>Subtotal</span><span>R{{ subtotal.toFixed(2) }}</span></div>
          <div class="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
          <div class="summary-total"><span>Total</span><span>R{{ subtotal.toFixed(2) }}</span></div>
          <button class="checkout-btn" @click="goCheckout">Proceed to Checkout</button>
          <button class="continue-btn" @click="goBack">Continue Shopping</button>
        </div>
      </aside>
    </div>

    <div class="cart-empty" v-else-if="!loading && !items.length">
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
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import CartItemRow from '@/components/cart/CartItemRow.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Cart',
  components: { CartItemRow },
  setup() {
    const store = useStore()
    const router = useRouter()

    const items = computed(() => store.getters['cart/cartItems'])
    const count = computed(() => store.getters['cart/cartCount'])
    const subtotal = computed(() => store.getters['cart/cartSubtotal'])
    const loading = computed(() => store.state.cart.loading)

    onMounted(() => {
      // Require login to see cart
      const user = localStorage.getItem('user')
      if (!user) {
        alert('Please sign in to view your cart.')
        router.push({ name: 'Home' })
        return
      }
      store.dispatch('cart/fetchUserCart')
    })

    const onUpdateQty = ({ item, quantity }) => {
      store.dispatch('cart/updateItemQuantity', { item, quantity })
    }

    const onRemove = (id) => {
      store.dispatch('cart/removeItem', id)
    }

    const goCheckout = () => {
      alert('Checkout flow coming soon!')
      // router.push({ name: 'Checkout' })
    }

    const goBack = () => router.push({ name: 'Gallery' })

    return { items, count, subtotal, loading, onUpdateQty, onRemove, goCheckout, goBack }
  }
}
</script>

<style scoped>
.cart-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}
.cart-header { text-align: center; color: white; margin-bottom: 2rem; }
.cart-header h1 { font-size: 2.5rem; margin-bottom: .5rem; }
.cart-container {
  max-width: 1200px; margin: 0 auto; padding: 0 2rem;
  display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;
}
.cart-list {
  background: white; border-radius: 15px; padding: 1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
.cart-summary .summary-card {
  background: white; border-radius: 15px; padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
.summary-row, .summary-total { display: flex; justify-content: space-between; margin: .6rem 0; }
.summary-total { font-weight: 700; font-size: 1.1rem; }
.checkout-btn {
  width: 100%; padding: .9rem 1.2rem; margin-top: 1rem; border: none; border-radius: 8px;
  background: #2196F3; color: white; font-weight: 700; cursor: pointer;
}
.continue-btn {
  width: 100%; margin-top: .6rem; padding: .8rem 1.2rem; border-radius: 8px;
  background: #f1f5f9; border: 1px solid #e2e8f0; cursor: pointer;
}
.cart-empty, .cart-loading {
  background: white; max-width: 900px; margin: 0 auto; border-radius: 15px;
  padding: 2rem; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
.icon { font-size: 3rem; margin-bottom: .5rem; }
.browse-btn {
  display: inline-block; margin-top: 1rem; background: #2196F3; color: #fff; text-decoration: none;
  padding: .8rem 1.2rem; border-radius: 8px;
}
@media (max-width: 992px) { .cart-container { grid-template-columns: 1fr; } }
</style>
