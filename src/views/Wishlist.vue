<template>
  <div class="wishlist-page">
    <div class="wishlist-header">
      <h1>Your Wishlist</h1>
      <p>Review your favourite items</p>
    </div>

    <div class="wishlist-container" v-if="items.length">
      <div class="wishlist-grid">
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

    <div class="wishlist-empty" v-else>
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="none"/>
          <path fill="currentColor" d="M14 15.036c0 1.235 1.485 2.543 2.52 3.305c.435.32.652.48.98.48s.545-.16.98-.48c1.035-.762 2.52-2.07 2.52-3.305c0-2.008-1.925-2.757-3.5-1.206c-1.575-1.551-3.5-.802-3.5 1.206"/>
          <path fill="currentColor" fill-rule="evenodd" d="M2.25 6A.75.75 0 0 1 3 5.25h18a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 6m0 4A.75.75 0 0 1 3 9.25h18a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m0 4a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m0 4a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/>
        </svg>
      </div>
      <h3>Your wishlist is empty</h3>
     
      <router-link to="/gallery" class="browse-btn">Browse Gallery</router-link>
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

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.wishlist-empty {
  text-align: center;
  padding: 3rem;
}
.wishlist-empty .icon {
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
</style>
