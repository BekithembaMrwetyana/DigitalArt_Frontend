<template>
  <div class="product-grid">
    <div class="grid-header" v-if="title">
      <h2 class="grid-title">{{ title }}</h2>
      <p class="grid-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
    
    <div 
      :class="[
        'grid-container', 
        `columns-${columns}`,
        { 'masonry': layout === 'masonry' }
      ]"
    >
      <div 
        v-for="artwork in displayedArtworks" 
        :key="artwork.id"
        class="grid-item"
        @click="selectArtwork(artwork)"
      >
        <div class="artwork-item">
          <div class="artwork-image-container">
            <img 
              :src="artwork.image" 
              :alt="artwork.title"
              class="artwork-image"
              @load="onImageLoad"
              @error="onImageError"
            />
            <div class="artwork-overlay">
              <div class="overlay-content">
                <h3 class="artwork-title">{{ artwork.title }}</h3>
                <p class="artwork-artist">{{ artwork.artist }}</p>
                <p class="artwork-price" v-if="showPrices">${{ artwork.price }}</p>
                <div class="artwork-actions">
                  <button @click.stop="viewDetails(artwork)" class="btn-view">
                    View Details
                  </button>
                  <button 
                    v-if="artwork.available" 
                    @click.stop="addToCart(artwork)" 
                    class="btn-cart"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="artwork-info" v-if="showInfo">
            <h3 class="info-title">{{ artwork.title }}</h3>
            <p class="info-artist">{{ artwork.artist }}</p>
            <p class="info-price" v-if="showPrices">${{ artwork.price }}</p>
            <div class="artwork-meta">
              <span class="meta-category">{{ artwork.category }}</span>
              <span class="meta-year">{{ artwork.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Load More Button -->
    <div class="load-more-container" v-if="hasMore">
      <button 
        @click="loadMore" 
        :disabled="loading"
        class="load-more-btn"
      >
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-if="!displayedArtworks.length && !loading" class="empty-state">
      <div class="empty-icon">🎨</div>
      <h3>No Products Found</h3>
      <p>Try adjusting your filters or search criteria.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductGrid',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    columns: {
      type: [Number, String],
      default: 3,
      validator: (value) => [1, 2, 3, 4, 5, 6].includes(Number(value))
    },
    layout: {
      type: String,
      default: 'grid', // 'grid' or 'masonry'
      validator: (value) => ['grid', 'masonry'].includes(value)
    },
    title: String,
    subtitle: String,
    showPrices: {
      type: Boolean,
      default: true
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    itemsPerPage: {
      type: Number,
      default: 12
    },
    infinite: {
      type: Boolean,
      default: false
    }
  },
  emits: ['artwork-selected', 'load-more'],
  setup(props, { emit }) {
    const store = useStore()
    const currentPage = ref(1)
    const loading = ref(false)
    
    const displayedArtworks = computed(() => {
      if (props.infinite) {
        return props.products.slice(0, currentPage.value * props.itemsPerPage)
      }
      return props.products
    })

    const hasMore = computed(() => {
      return props.infinite &&
             displayedArtworks.value.length < props.products.length
    })
    
    const selectArtwork = (artwork) => {
      emit('artwork-selected', artwork)
    }
    
    const viewDetails = (artwork) => {
      store.dispatch('ui/openModal', {
        type: 'artwork-details',
        data: artwork
      })
    }
    
    const addToCart = (artwork) => {
      store.dispatch('cart/addItem', artwork)
      store.dispatch('ui/showNotification', {
        message: `${artwork.title} added to cart`,
        type: 'success'
      })
    }
    
    const loadMore = () => {
      if (!loading.value && hasMore.value) {
        loading.value = true
        currentPage.value += 1
        
        // Simulate loading delay
        setTimeout(() => {
          loading.value = false
          emit('load-more')
        }, 500)
      }
    }
    
    const onImageLoad = (event) => {
      event.target.classList.add('loaded')
    }
    
    const onImageError = (event) => {
      event.target.src = '/images/placeholder-artwork.jpg'
      event.target.classList.add('error')
    }
    
    // Reset pagination when products change
    watch(() => props.products, () => {
      currentPage.value = 1
    })
    
    return {
      displayedArtworks,
      hasMore,
      loading,
      selectArtwork,
      viewDetails,
      addToCart,
      loadMore,
      onImageLoad,
      onImageError
    }
  }
}
</script>

<style scoped>
.product-grid {
  width: 100%;
}

.grid-header {
  text-align: center;
  margin-bottom: 2rem;
}

.grid-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.grid-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.grid-container {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
}

.columns-1 { grid-template-columns: 1fr; }
.columns-2 { grid-template-columns: repeat(2, 1fr); }
.columns-3 { grid-template-columns: repeat(3, 1fr); }
.columns-4 { grid-template-columns: repeat(4, 1fr); }
.columns-5 { grid-template-columns: repeat(5, 1fr); }
.columns-6 { grid-template-columns: repeat(6, 1fr); }

.grid-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.artwork-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.artwork-item:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.artwork-image-container {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.artwork-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.artwork-image.loaded {
  opacity: 1;
}

.artwork-image.error {
  opacity: 0.5;
}

.artwork-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artwork-item:hover .artwork-overlay {
  opacity: 1;
}

.artwork-item:hover .artwork-image {
  transform: scale(1.05);
}

.overlay-content {
  padding: 1.5rem;
  color: white;
  width: 100%;
}

.artwork-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.artwork-artist {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.artwork-price {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.artwork-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-cart {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-view:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-cart {
  background: #007bff;
  color: white;
}

.btn-cart:hover {
  background: #0056b3;
}

.artwork-info {
  padding: 1.5rem;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.info-artist {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.info-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #007bff;
  margin-bottom: 1rem;
}

.artwork-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #888;
}

.load-more-container {
  text-align: center;
  margin-top: 3rem;
}

.load-more-btn {
  padding: 1rem 2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: #0056b3;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .columns-5 { grid-template-columns: repeat(4, 1fr); }
  .columns-6 { grid-template-columns: repeat(4, 1fr); }
}

@media (max-width: 992px) {
  .columns-4,
  .columns-5,
  .columns-6 { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .grid-container {
    gap: 1rem;
  }
  
  .columns-3,
  .columns-4,
  .columns-5,
  .columns-6 { grid-template-columns: repeat(2, 1fr); }
  
  .grid-title {
    font-size: 2rem;
  }
  
  .overlay-content {
    padding: 1rem;
  }
  
  .artwork-info {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .columns-2,
  .columns-3,
  .columns-4,
  .columns-5,
  .columns-6 { grid-template-columns: 1fr; }
}
</style>