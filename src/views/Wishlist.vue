<template>
  <div class="wishlist-page">
    <h2>Your Wishlist</h2>
    <div v-if="items.length === 0" class="empty-message">
      Your wishlist is empty.
    </div>
    <div v-else class="wishlist-grid">
      <div v-for="item in items" :key="item.id" class="wishlist-item">
        <img :src="item.image || '/placeholder-art.jpg'" :alt="item.title" class="wishlist-image" />
        <div class="wishlist-info">
          <h3>{{ item.title }}</h3>
          <p class="price">R{{ item.price }}</p>
          <button @click="removeFromWishlist(item.id)" class="remove-btn">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Wishlist',
  setup() {
    const store = useStore()
    const items = computed(() => store.getters['wishlist/items'])

    const removeFromWishlist = (productId) => {
      store.dispatch('wishlist/removeItem', productId)
    }

    return {
      items,
      removeFromWishlist
    }
  }
}
</script>

<style scoped>
.wishlist-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.empty-message {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-top: 2rem;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.wishlist-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: default;
}

.wishlist-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.wishlist-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wishlist-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.price {
  font-weight: bold;
  color: #2c5aa0;
  margin: 0 0 1rem 0;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: #c0392b;
}
</style>
