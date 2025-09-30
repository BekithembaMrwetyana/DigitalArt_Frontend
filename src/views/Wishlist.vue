<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>Your Wishlist</h1>
      <p>Review your favourite items</p>
    </div>

    <div class="cart-container" v-if="items.length">
      <div class="cart-list">
        <div class="wishlist-grid">
          <div v-for="item in items" :key="item.id" class="wishlist-item">
            <div class="wishlist-image-container">
              <img :src="item.image || '/placeholder-art.jpg'" :alt="item.title" class="wishlist-image" />
            </div>

            <div class="wishlist-info">
              <h3>{{ item.title }}</h3>
              <p class="item-description">{{ item.description || 'Beautiful artwork' }}</p>
              <p class="price">R{{ item.price }}</p>

              <div class="wishlist-actions">
                <button @click="removeFromWishlist(item.id)" class="remove-btn" title="Remove from Wishlist">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                  Remove
                </button>
              </div>
            </div>

            <div class="add-to-cart-wrapper">
              <AddToCartButton :product="item" />
            </div>
          </div>
        </div>
      </div>

      <aside class="cart-summary">
        <div class="summary-card">
          <h3>Wishlist Summary</h3>
          <div class="summary-row"><span>Items</span><span>{{ wishlistCount }}</span></div>
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
      </aside>
    </div>

    <div class="cart-empty" v-else>
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
import { useStore } from 'vuex'
import AddToCartButton from '../components/cart/AddToCartButton.vue'

export default {
  name: 'Wishlist',
  components: {
    AddToCartButton
  },
  setup() {
    const store = useStore()
    const cartItems = ref([])

    const items = computed(() => store.getters['wishlist/items'] || [])
    const wishlistCount = computed(() => items.value.length)

    // Load cart items to check what's already in cart
    onMounted(() => {
      loadCartItems()
      // Fetch products to ensure wishlist has latest data
      store.dispatch('products/fetchProducts')
    })

    // Watch for changes in wishlist items and reload cart items if needed

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

    return {
      items,
      wishlistCount,
      removeFromWishlist,
      addToCart,
      addAllToCart,
      clearWishlist,
      isInCart
    }
  }
}
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

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.wishlist-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
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
  height: 200px;
  object-fit: cover;
}

.wishlist-info {
  padding: 1rem;
}

.wishlist-info h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.item-description {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c5aa0;
  margin-bottom: 0.5rem;
}

.wishlist-actions {
  display: flex;
  gap: 0.75rem;
}

.add-to-cart-wrapper {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 10;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
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
.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.bulk-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-content: center;
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

@media (max-width: 768px) {
  .cart-page {
    padding: 1rem;
  }
  
  .cart-container {
    flex-direction: column;
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
