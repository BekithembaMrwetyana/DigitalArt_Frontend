<template>
  <div class="wishlist-page">
    <div class="wishlist-header">
      <h1>Your Wishlist</h1>
      <p>Review your favourite items</p>
    </div>

    <div class="wishlist-container" v-if="items.length">
      <div class="wishlist-grid">
        <ProductCard
          v-for="product in items"
          :key="product.id"
          :product="product"
          :emit-add-to-cart="true"
          :is-wishlist-page="true"
          @view="viewProduct"
          @add-to-cart="addToCartAndRemoveFromWishlist"
        />
      </div>
    </div>

    <div class="wishlist-empty" v-else>
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <h3>Your wishlist is empty</h3>
      <p>Save items you love to your wishlist so you can easily find them later</p>
      <router-link to="/gallery" class="browse-btn">Browse Gallery</router-link>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '../components/product/ProductCard.vue'

export default {
  name: 'Wishlist',
  components: {
    ProductCard
  },
  setup() {
    const store = useStore()

    const items = computed(() => store.getters['wishlist/items'] || [])

    onMounted(() => {
      store.dispatch('products/fetchProducts')
      store.dispatch('wishlist/fetchWishlist')
    })

    const viewProduct = (product) => {
      if (product && product.id) {
        // Using router push if available
        if (typeof window !== 'undefined' && window.$router) {
          window.$router.push({ name: 'ProductDetail', params: { id: product.id } })
        } else {
          console.log('View product:', product)
        }
      }
    }

    const addToCartAndRemoveFromWishlist = async (product) => {
      try {
        // Add to cart first
        await store.dispatch('cart/addItem', product)
        // Then remove from wishlist
        await store.dispatch('wishlist/removeItem', product.id)
      } catch (error) {
        console.error('Error adding to cart and removing from wishlist:', error)
      }
    }

    return {
      items,
      viewProduct,
      addToCartAndRemoveFromWishlist
    }
  }
}
</script>

<style scoped>
.wishlist-page {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
}

.wishlist-header {
  text-align: center;
  margin-bottom: 2rem;
}
.wishlist-header h1 {
  font-size: 2rem;
  font-weight: bold;
}
.wishlist-header p {
  color: #666;
}

.wishlist-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 270px);
  gap: 2rem;
  flex: 1;
}

.wishlist-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #555;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.wishlist-empty .icon {
  font-size: 4rem;
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

@media (max-width: 768px) {
  .wishlist-page {
    padding: 1rem;
  }

  .wishlist-container {
    flex-direction: column;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
