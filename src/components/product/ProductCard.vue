<template>
  <div class="product-card" @click="$emit('view', product)">
    <div class="product-image">
      <img :src="product.image || '/placeholder-art.jpg'" :alt="product.title" />
      
      <!-- Wishlist heart -->
      <button
        class="wishlist-btn"
        @click.stop="toggleWishlist"
        :class="{ active: isInWishlist }"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 
               2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 
               3.41.81 4.5 2.09C13.09 3.81 
               14.76 3 16.5 3 19.58 3 22 
               5.42 22 8.5c0 3.78-3.4 6.86-8.55 
               11.54L12 21.35z"
          />
        </svg>
      </button>
    </div>

    <div class="product-info">
      <h3>{{ product.title }}</h3>
      <p class="price">R{{ product.price }}</p>
      <p class="category">{{ product.category }}</p>
    </div>

    <!-- Floating trolley button -->
    <button
      class="cart-btn"
      @click.stop="toggleCart"
      :class="{ active: isInCart }"
    >
      🛒
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  setup(props) {
    const store = useStore()

    const isInWishlist = computed(() => {
      const wishlist = store.getters['wishlist/items'] || []
      return wishlist.some(item => item.id === props.product.id)
    })

    const isInCart = computed(() => {
      const cart = store.getters['cart/cartItems'] || []
      return cart.some(item => item.id === props.product.id)
    })

    const toggleWishlist = () => {
      if (isInWishlist.value) {
        store.dispatch('wishlist/removeItem', props.product.id)
      } else {
        store.dispatch('wishlist/addItem', props.product)
      }
    }

    const toggleCart = () => {
      if (isInCart.value) {
        store.dispatch('cart/removeItem', props.product.id)
      } else {
        store.dispatch('cart/addItem', props.product)
      }
    }

    return {
      isInWishlist,
      isInCart,
      toggleWishlist,
      toggleCart
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.price {
  font-weight: bold;
  color: #2c5aa0;
  margin: 0 0 0.5rem 0;
}

.category {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
  text-transform: capitalize;
}


.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: black; 
  transition: color 0.3s ease;
}

.wishlist-btn.active {
  color: #e74c3c; 
}


.cart-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;
}

.cart-btn:active {
  transform: scale(0.9);
}

.cart-btn.active {
  color: #2c5aa0;
  background: #e3f2fd;
}
</style>
