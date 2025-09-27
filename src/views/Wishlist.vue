<template>
  <div class="wishlist-page">
    <div class="wishlist-header">
      <h1>Your Wishlist</h1>
      <p>Review your favourite items</p>
    </div>

    <div class="wishlist-container" v-if="items.length">
      <div class="wishlist-grid">
        <div v-for="item in items" :key="item.id" class="wishlist-item">
          <div class="wishlist-image-container">
            <img :src="item.image || '/placeholder-art.jpg'" :alt="item.title" class="wishlist-image" />
            <div class="image-overlay">
              <button @click="viewProduct(item)" class="view-btn" title="View Details">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="wishlist-info">
            <h3>{{ item.title }}</h3>
            <p class="item-description">{{ item.description || 'Beautiful artwork' }}</p>
            <p class="price">R{{ item.price }}</p>
            
            <div class="wishlist-actions">
              <button 
                @click="addToCart(item)"  
                class="add-to-cart-btn"
                :disabled="isInCart(item.id)"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M7 4V1C7 0.45 7.45 0 8 0H16C16.55 0 17 0.45 17 1V4H22C22.55 4 23 4.45 23 5C23 5.55 22.55 6 22 6H21L19.8 17.4C19.71 18.28 18.95 19 18.06 19H5.94C5.05 19 4.29 18.28 4.2 17.4L3 6H2C1.45 6 1 5.55 1 5C1 4.45 1.45 4 2 4H7ZM9 2V4H15V2H9ZM5.21 6L6.27 17H17.73L18.79 6H5.21Z"/>
                  <circle cx="7" cy="21.5" r="1.5"/>
                  <circle cx="17" cy="21.5" r="1.5"/>
                </svg>
                {{ isInCart(item.id) ? 'In Cart' : 'Add to Cart' }}
              </button>
              
              <button @click="removeFromWishlist(item.id)" class="remove-btn" title="Remove from Wishlist">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bulk Actions -->
      <div class="bulk-actions">
        <button @click="addAllToCart" class="bulk-btn add-all-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7 4V1C7 0.45 7.45 0 8 0H16C16.55 0 17 0.45 17 1V4H22C22.55 4 23 4.45 23 5C23 5.55 22.55 6 22 6H21L19.8 17.4C19.71 18.28 18.95 19 18.06 19H5.94C5.05 19 4.29 18.28 4.2 17.4L3 6H2C1.45 6 1 5.55 1 5C1 4.45 1.45 4 2 4H7ZM9 2V4H15V2H9ZM5.21 6L6.27 17H17.73L18.79 6H5.21Z"/>
            <circle cx="7" cy="21.5" r="1.5"/>
            <circle cx="17" cy="21.5" r="1.5"/>
          </svg>
          Add All to Cart
        </button>
        
        <button @click="clearWishlist" class="bulk-btn clear-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          Clear Wishlist
        </button>
      </div>
    </div>

    <div class="wishlist-empty" v-else>
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Wishlist',
  setup() {
    const store = useStore()
    const router = useRouter()
    const cartItems = ref([])

    const items = computed(() => store.getters['wishlist/items'] || [])

    // Load cart items to check what's already in cart
    onMounted(() => {
      loadCartItems()
    })

    const loadCartItems = () => {
      try {
        // Try Vuex store first
        if (store.getters['cart/items']) {
          cartItems.value = store.getters['cart/items']
        } else {
          // Fallback to localStorage
          cartItems.value = JSON.parse(localStorage.getItem('cart') || '[]')
        }
      } catch (error) {
        console.error('Error loading cart items:', error)
        cartItems.value = []
      }
    }

    const removeFromWishlist = (productId) => {
      try {
        store.dispatch('wishlist/removeItem', productId)
        // Show success message
        if (window.showToast) {
          window.showToast('Item removed from wishlist', 'success')
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error)
      }
    }

    const addToCart = (item) => {
      try {
        const cartItem = {
          id: item.id,
          productID: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          imageUrl: item.image,
          description: item.description,
          quantity: 1
        }

        // Try Vuex store first
        if (store.dispatch && store.getters['cart/items'] !== undefined) {
          store.dispatch('cart/addItem', cartItem)
        } else {
          // Fallback to localStorage
          let cart = JSON.parse(localStorage.getItem('cart') || '[]')
          const existingItem = cart.find(cartItem => cartItem.id === item.id)
          
          if (existingItem) {
            existingItem.quantity += 1
          } else {
            cart.push(cartItem)
          }
          
          localStorage.setItem('cart', JSON.stringify(cart))
          cartItems.value = cart

          // Emit event for other components
          window.dispatchEvent(new CustomEvent('cart-updated', { 
            detail: { cart: cart, count: cart.reduce((total, item) => total + item.quantity, 0) } 
          }))
        }

        loadCartItems() // Refresh cart items
        
        // Show success message
        if (window.showToast) {
          window.showToast(`${item.title} added to cart!`, 'success')
        } else {
          alert(`${item.title} added to cart!`)
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        alert('Error adding item to cart')
      }
    }

    const addAllToCart = () => {
      let addedCount = 0
      items.value.forEach(item => {
        if (!isInCart(item.id)) {
          addToCart(item)
          addedCount++
        }
      })
      
      if (addedCount > 0) {
        if (window.showToast) {
          window.showToast(`${addedCount} items added to cart!`, 'success')
        } else {
          alert(`${addedCount} items added to cart!`)
        }
      } else {
        if (window.showToast) {
          window.showToast('All items are already in your cart', 'info')
        } else {
          alert('All items are already in your cart')
        }
      }
    }

    const clearWishlist = () => {
      if (confirm('Are you sure you want to clear your entire wishlist?')) {
        try {
          // Clear all items from wishlist
          items.value.forEach(item => {
            store.dispatch('wishlist/removeItem', item.id)
          })
          
          if (window.showToast) {
            window.showToast('Wishlist cleared', 'success')
          } else {
            alert('Wishlist cleared')
          }
        } catch (error) {
          console.error('Error clearing wishlist:', error)
        }
      }
    }

    const isInCart = (itemId) => {
      return cartItems.value.some(cartItem => cartItem.id === itemId || cartItem.productID === itemId)
    }

    const viewProduct = (item) => {
      // Navigate to product details page
      router.push(`/product/${item.id}`)
    }

    return {
      items,
      removeFromWishlist,
      addToCart,
      addAllToCart,
      clearWishlist,
      isInCart,
      viewProduct
    }
  }
}
</script>

<style scoped>
.wishlist-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.wishlist-header {
  text-align: center;
  margin-bottom: 3rem;
}

.wishlist-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.wishlist-header p {
  color: #666;
  font-size: 1.1rem;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.wishlist-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.wishlist-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.wishlist-image-container {
  position: relative;
  overflow: hidden;
}

.wishlist-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.wishlist-item:hover .image-overlay {
  opacity: 1;
}

.wishlist-item:hover .wishlist-image {
  transform: scale(1.05);
}

.view-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: white;
  transform: scale(1.1);
}

.wishlist-info {
  padding: 1.5rem;
}

.wishlist-info h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #f9c846;
  margin-bottom: 1.5rem;
}

.wishlist-actions {
  display: flex;
  gap: 0.75rem;
}

.add-to-cart-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4093e0, #00d9e6);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.add-to-cart-btn:disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
  transform: none;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.remove-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.bulk-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
  border-top: 2px solid #f0f0f0;
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-all-btn {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.add-all-btn:hover {
  background: linear-gradient(135deg, #4093e0, #00d9e6);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.clear-btn {
  background: #ff6b6b;
  color: white;
}

.clear-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.wishlist-empty {
  text-align: center;
  padding: 4rem 2rem;
}

.wishlist-empty .icon {
  color: #ddd;
  margin-bottom: 2rem;
}

.wishlist-empty h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.wishlist-empty p {
  color: #666;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.browse-btn {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  background: linear-gradient(135deg, #5a6fd8, #6a4190);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .wishlist-page {
    padding: 1rem;
  }
  
  .wishlist-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .bulk-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .bulk-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>