<template>
  <div class="product-card" @click="$emit('view', product)">
    <div class="product-image">
      <img :src="product.image || '/placeholder-art.jpg'" :alt="product.title" />

      <button
        class="wishlist-btn"
        @click.stop="toggleWishlist"
        :class="{ active: isInWishlist }"
        v-if="!isWishlistPage"
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
      <button
        class="wishlist-remove-btn"
        @click.stop="removeFromWishlist"
        v-else
      >
        ❌
      </button>
    </div>

    <div class="product-info">
      <h3>{{ product.title }}</h3>
      <p class="price">R{{ product.price }}</p>
      <p class="category">{{ product.category }}</p>
    </div>

  <!-- <button
    @click="$store.dispatch('Cart/addToCart', {
      productId: product.id,
      quantity: 1,
      userId: $store.state.auth.user.id
    })"class="add-to-cart-btn">
    Add to Cart
  </button> -->

  <div class="add-to-cart-wrapper">
    <AddToCartButton :product="product" @added="onAdded" />
  </div>


  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import AddToCartButton from '../cart/AddToCartButton.vue'; // path to your component

export default {
  name: 'ProductCard',
  components: { AddToCartButton },
  props: {
    product: Object,
    emitAddToCart: { type: Boolean, default: false },
    isWishlistPage: { type: Boolean, default: false }
  },
  emits: ['click', 'add-to-cart', 'view'],
  setup(props, { emit }) {
    const store = useStore()

    const isInWishlist = computed(() => {
      const wishlist = store.getters['wishlist/items'] || []
      return wishlist.some(item => item.id === props.product.id)
    })

    const isInCart = computed(() => {
      const cart = store.getters['Cart/cartItems'] || []
      return cart.some(item => item.id === props.product.id)
    })

    const toggleWishlist = async () => {
      try {
        if (isInWishlist.value) {
          await store.dispatch('wishlist/removeItem', props.product.id)
        } else {
          await store.dispatch('wishlist/addItem', props.product.id)
        }
      } catch (error) {
        console.error('Error toggling wishlist:', error)
        // You could show a user-friendly error message here
      }
    }

    const toggleCart = () => {
      if (isInCart.value) {
        store.dispatch('Cart/removeItem', props.product.id)
      } else {
        store.dispatch('Cart/addItem', props.product)
      }
    }

    const removeFromWishlist = async () => {
      try {
        await store.dispatch('wishlist/removeItem', props.product.id)
      } catch (error) {
        console.error('Error removing from wishlist:', error)
      }
    }

    const onAdded = (product) => {
      if (props.emitAddToCart) {
        emit('add-to-cart', product)
      }
    }

    return {
      isInWishlist,
      isInCart,
      toggleWishlist,
      toggleCart,
      removeFromWishlist,
      onAdded
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

.add-to-cart-wrapper {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 10;
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

.wishlist-remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  transition: color 0.3s ease;
}

.wishlist-remove-btn:hover {
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

.add-to-cart-btn {
  background-color: #2563eb; /* blue */
  color: white;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: background 0.2s ease-in-out, transform 0.1s;
}

.add-to-cart-btn:hover {
  background-color: #1e40af; /* darker blue */
  transform: scale(1.05);
}

.cart-btn:active {
  transform: scale(0.9);
}

.cart-btn.active {
  color: #2c5aa0;
  background: #e3f2fd;
}
</style>
