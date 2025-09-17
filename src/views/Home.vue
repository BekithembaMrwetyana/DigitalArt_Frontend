<template>
  <div class="home">
   
    <div class="hero-section">
      <div class="hero-text">
        <h1>Explore Our Art Gallery</h1>
        <p>Discover unique contemporary artworks from around the world.</p>
        <router-link to="/shop" class="explore-btn">Explore Art Gallery</router-link>
      </div>

      <div class="hero-slider">
        <HeroSlider :slides="slidesData" />
      </div>
    </div>

   
    
    <div class="latest-collection">
      <h3>OUR PICKS</h3>
      <p class="collection-subtitle">Recommended by us</p>

      <div class="collection-grid">
        <div v-for="product in firstThreeProducts" :key="product.productID" class="collection-item">
          <div class="product-card" @click="viewProductDetails(product)">
            <div class="image-container">
              <img :src="getImageUrl(product)" :alt="product.title" />
              <div class="top-pick-badge">
                <div class="stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <span class="pick-text">TOP PICK</span>
              </div>
              <div class="product-overlay">
                <div class="overlay-actions">
                  <button 
                    class="action-btn wishlist-btn" 
                    @click.stop="toggleWishlist(product)"
                    :class="{ active: isInWishlist(product.productID) }"
                    title="Add to Wishlist"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <button 
                    class="action-btn cart-btn" 
                    @click.stop="addToCart(product)"
                    title="Add to Cart"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M7 4V1C7 0.45 7.45 0 8 0H16C16.55 0 17 0.45 17 1V4H22C22.55 4 23 4.45 23 5C23 5.55 22.55 6 22 6H21L19.8 17.4C19.71 18.28 18.95 19 18.06 19H5.94C5.05 19 4.29 18.28 4.2 17.4L3 6H2C1.45 6 1 5.55 1 5C1 4.45 1.45 4 2 4H7ZM9 2V4H15V2H9ZM5.21 6L6.27 17H17.73L18.79 6H5.21Z"/>
                      <circle cx="7" cy="21.5" r="1.5"/>
                      <circle cx="17" cy="21.5" r="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="product-info">
              <h4>{{ product.title ? product.title.toUpperCase() : 'UNTITLED' }}</h4>
              <p class="product-description">{{ product.description || 'No description available' }}</p>
              <div class="product-price">R{{ product.price || 0 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeroSlider from '@/components/hero/HeroSlider.vue'
import productService from '@/services/productService'

export default {
  name: 'Home',
  components: { HeroSlider },
  data() {
    return {
      slidesData: [
        { image: 'http://localhost:8080/digital_artDB/images/art18.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art19.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art21.jpeg' },
        { image: 'http://localhost:8080/digital_artDB/images/art23.jpeg' }
      ],
      products: [], 
      wishlist: [], 
      cart: [] // 
    }
  },
  computed: {
    firstThreeProducts() {
      return this.products.slice(0, 3)
    }
  },
  async mounted() {
    await this.fetchProducts()
    this.loadWishlistFromStorage()
    this.setupEventListeners()
  },

  beforeDestroy() {
   
    this.$bus?.$off('wishlist-updated')
    window.removeEventListener('wishlist-updated', this.handleWishlistUpdate)
  },
  methods: {
    async fetchProducts() {
      try {
    
        const data = await productService.getAllProducts()
        
       
        this.products = data.map(product => ({
          productID: product.productID,
          title: product.title,
          description: product.description,
          price: product.price,
          categoryId: product.category ? product.category.categoryId : null,
          categoryName: product.category ? product.category.name : 'No Category',
          imageUrl: product.imageUrl,
          image: product.image,
          orderItems: product.orderItems || []
        }))
        
        console.log('Fetched products for home:', this.products)
      } catch (error) {
        console.error('Error fetching products:', error)
        
        try {
          const response = await fetch('http://localhost:8080/digital_artDB/api/products')
          if (response.ok) {
            this.products = await response.json()
          } else {
            console.error('Failed to fetch products via direct API')
          }
        } catch (fallbackError) {
          console.error('Fallback API call also failed:', fallbackError)
        }
      }
    },
    
    getImageUrl(product) {
     
      if (product.imageUrl) {
       
        if (product.imageUrl.startsWith('http://localhost:8080/digital_artDB')) {
          return product.imageUrl
        }
       
        return `http://localhost:8080/digital_artDB${product.imageUrl}`
      } else if (product.image) {
       
        return `data:image/jpeg;base64,${product.image}`
      } else {
       
        return '/placeholder-art.jpg'
      }
    },

    viewProductDetails(product) {
      
      this.$router.push(`/product/${product.productID}`)
    },

    addToCart(product) {
     
      try {
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingItem = cart.find(item => item.productID === product.productID)
        
        if (existingItem) {
          existingItem.quantity += 1
        } else {
          cart.push({ ...product, quantity: 1 })
        }
        
        localStorage.setItem('cart', JSON.stringify(cart))
        this.cart = cart
        
       
        alert(`${product.title} added to cart!`)
        
        
      } catch (error) {
        console.error('Error adding to cart:', error)
        alert('Error adding item to cart')
      }
    },

    toggleWishlist(product) {
      try {
       
        if (this.$store && this.$store.getters['wishlist/items'] !== undefined) {
         
          const isInWishlist = this.$store.getters['wishlist/items'].some(item => item.id === product.productID)
          
          if (isInWishlist) {
            this.$store.dispatch('wishlist/removeItem', product.productID)
            alert(`${product.title} removed from wishlist`)
          } else {
          
            const wishlistItem = {
              id: product.productID,
              title: product.title,
              price: product.price,
              image: this.getImageUrl(product),
              description: product.description
            }
            this.$store.dispatch('wishlist/addItem', wishlistItem)
            alert(`${product.title} added to wishlist!`)
          }
        } else {
          
          this.toggleWishlistLocalStorage(product)
        }
      } catch (error) {
        console.error('Error updating wishlist:', error)
        
        this.toggleWishlistLocalStorage(product)
      }
    },

    toggleWishlistLocalStorage(product) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      const existingIndex = wishlist.findIndex(item => item.productID === product.productID)
      
      if (existingIndex > -1) {
        
        wishlist.splice(existingIndex, 1)
        alert(`${product.title} removed from wishlist`)
      } else {
      
        wishlist.push(product)
        alert(`${product.title} added to wishlist!`)
      }
      
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
      this.wishlist = wishlist
      
    
      window.dispatchEvent(new CustomEvent('wishlist-updated', { 
        detail: { 
          wishlist: wishlist, 
          count: wishlist.length,
          action: existingIndex > -1 ? 'removed' : 'added',
          product: product
        } 
      }))
    },

    addToCart(product) {
      try {

        this.addToCartLocalStorage(product)
      } catch (error) {
        console.error('Error adding to cart:', error)
        alert('Error adding item to cart')
      }
    },

    addToCartLocalStorage(product) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find(item => item.productID === product.productID)
      
      if (existingItem) {
        existingItem.quantity += 1
        alert(`${product.title} quantity updated in cart!`)
      } else {
        cart.push({ ...product, quantity: 1 })
        alert(`${product.title} added to cart!`)
      }
      
      localStorage.setItem('cart', JSON.stringify(cart))
      this.cart = cart
      
    
      window.dispatchEvent(new CustomEvent('cart-updated', { 
        detail: { 
          cart: cart, 
          count: cart.reduce((total, item) => total + item.quantity, 0),
          action: 'added',
          product: product
        } 
      }))
    },

    isInWishlist(productId) {
      
      if (this.$store && this.$store.getters['wishlist/items']) {
        return this.$store.getters['wishlist/items'].some(item => item.id === productId)
      }
    
      return this.wishlist.some(item => item.productID === productId)
    },

    loadWishlistFromStorage() {
      try {
       
        if (this.$store && this.$store.dispatch) {
         
          const storeItems = this.$store.getters['wishlist/items'] || []
          if (storeItems.length > 0) {
          
            this.wishlist = storeItems.map(item => ({
              productID: item.id,
              title: item.title,
              price: item.price,
              imageUrl: item.image
            }))
          } else {
          
            const localItems = JSON.parse(localStorage.getItem('wishlist') || '[]')
            this.wishlist = localItems
            
           
            localItems.forEach(item => {
              const storeItem = {
                id: item.productID || item.id,
                title: item.title,
                price: item.price,
                image: item.imageUrl || item.image,
                description: item.description
              }
              this.$store.dispatch('wishlist/addItem', storeItem)
            })
          }
        } else {
         
          this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        }
        console.log('Loaded wishlist:', this.wishlist.length, 'items')
      } catch (error) {
        console.error('Error loading wishlist:', error)
        this.wishlist = []
      }
    },

    
    setupEventListeners() {
     
      window.addEventListener('wishlist-updated', (event) => {
        if (event.detail && event.detail.wishlist) {
          this.wishlist = event.detail.wishlist
        }
      })
      
  
      window.addEventListener('cart-updated', (event) => {
        if (event.detail && event.detail.cart) {
          this.cart = event.detail.cart
        }
      })
    }
  }
}
</script>

<style scoped>
.home {
  background: white;
  padding: 4rem 2rem;
}


.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-text h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.hero-text p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.explore-btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #f9c846;
  color: black;
  font-weight: bold;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s ease;
}

.explore-btn:hover {
  background-color: #e0b43a;
}

.hero-slider {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0);
  width: 100%;
  height: 450px; 
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9; 
}

.hero-slider img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; 
  display: block;
}


.guest-orders {
  margin: 2rem 0 7rem 0;
  text-align: center;
}

.guest-orders a {
  background-color: #667eea;
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
}

.guest-orders a:hover {
  background-color: #764ba2;
}


.latest-collection {
  background: white;
  padding: 4rem 2rem;
  text-align: center;
  border-top: 2px solid #f0f0f0;
}

.latest-collection h3 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.collection-subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.collection-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
}

.collection-item {
  text-align: center;
}

.product-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(249, 200, 70, 0.1), rgba(79, 172, 254, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.product-card:hover::before {
  opacity: 1;
}

.image-container {
  position: relative;
  margin-bottom: 0;
}

.collection-item img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  border-radius: 0;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(2px);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 20px;
  transform: translateY(20px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .overlay-actions {
  transform: translateY(0);
}

.action-btn {
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.action-btn svg {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.wishlist-btn {
  background: rgba(255, 255, 255, 0.95);
}

.wishlist-btn:hover {
  background: linear-gradient(135deg, #ff6b9d, #ff4757);
  color: white;
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
  transform: translateY(-3px) scale(1.1);
}

.wishlist-btn.active {
  background: linear-gradient(135deg, #ff6b9d, #ff4757);
  color: white;
  box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
  animation: heartBeat 0.6s ease-in-out;
}

.wishlist-btn:hover svg,
.wishlist-btn.active svg {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.cart-btn {
  background: rgba(255, 255, 255, 0.95);
}

.cart-btn:hover {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
  transform: translateY(-3px) scale(1.1);
}

.cart-btn:hover svg {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.cart-btn:active {
  animation: cartShake 0.5s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1.05); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1.1); }
}

@keyframes cartShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) rotate(-2deg); }
  75% { transform: translateX(2px) rotate(2deg); }
}

.product-info {
  padding: 1.5rem;
}

.top-pick-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #f9c846, #e0b43a);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 80px;
  z-index: 10;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: #fff;
  font-size: 0.7rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.pick-text {
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.collection-item h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-description {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
  text-align: center;
  max-width: 90%;
  margin: 0 auto 1rem auto;
}

.product-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #f9c846;
  margin-top: 0.5rem;
}

/* Featured Products */
.database-products {
  padding: 4rem 2rem;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.product-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.product-price {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  .collection-grid {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>