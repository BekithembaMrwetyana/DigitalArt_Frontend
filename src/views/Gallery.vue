<template>
  <div class="gallery">
    <div class="gallery-header">
      <h1>Art Gallery</h1>
      <p>Explore our extensive collection of digital artworks</p>
    </div>
    
    <div class="gallery-container">
      <ProductFilter @filtersChanged="handleFiltersChanged" />
      
      <div class="gallery-content">
        <div class="gallery-controls">
          <select v-model="sortBy">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
          
          <div class="view-toggle">
            <button :class="{active: viewMode === 'grid'}" @click="viewMode = 'grid'">Grid</button>
            <button :class="{active: viewMode === 'list'}" @click="viewMode = 'list'">List</button>
          </div>
        </div>
        
        <div :class="['product-display', viewMode]">
          <ProductCard
            v-for="product in filteredAndSortedProducts"
            :key="product.id"
            :product="product"
            @view="viewProduct"
          />
        </div>
        
        <!-- No results message -->
        <div v-if="!filteredAndSortedProducts.length" class="no-results">
          <div class="no-results-icon">🎨</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search criteria.</p>
        </div>
      </div>
    </div>
    
    <Modal />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ProductFilter from '../components/product/ProductFilter.vue'
import ProductCard from '../components/product/ProductCard.vue'
import Modal from '../components/common/Modal.vue'

export default {
  name: 'Gallery',
  components: {
    ProductFilter,
    ProductCard,
    Modal
  },
  setup() {
    const store = useStore()
    const sortBy = ref('newest')
    const viewMode = ref('grid')
    const activeFilters = ref({})

    onMounted(() => {
      store.dispatch('products/fetchProducts')
    })
    
    const allProducts = computed(() => store.getters['products/allProducts'] || [])

    const filteredProducts = computed(() => {
      let filtered = [...allProducts.value]

      // Apply filters
      if (activeFilters.value.category) {
        filtered = filtered.filter(product => product.category === activeFilters.value.category)
      }

      if (activeFilters.value.artist) {
        filtered = filtered.filter(product => product.artistId === activeFilters.value.artist)
      }

      if (activeFilters.value.priceRange) {
        const [min, max] = activeFilters.value.priceRange.split('-').map(Number)
        if (max) {
          filtered = filtered.filter(product => product.price >= min && product.price <= max)
        } else {
          // Handle "2500+" case
          filtered = filtered.filter(product => product.price >= min)
        }
      }

      if (activeFilters.value.size) {
        filtered = filtered.filter(product => product.size === activeFilters.value.size)
      }

      if (activeFilters.value.availability) {
        filtered = filtered.filter(product =>
          activeFilters.value.availability === 'available' ? product.available : !product.available
        )
      }

      return filtered
    })

    const filteredAndSortedProducts = computed(() => {
      const products = [...filteredProducts.value]

      switch (sortBy.value) {
        case 'price-low':
          return products.sort((a, b) => (a.price || 0) - (b.price || 0))
        case 'price-high':
          return products.sort((a, b) => (b.price || 0) - (a.price || 0))
        case 'oldest':
          return products.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        case 'newest':
          return products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        case 'popular':
          return products.sort((a, b) => (b.views || 0) - (a.views || 0))
        default:
          return products
      }
    })
    
    const handleFiltersChanged = (filters) => {
      activeFilters.value = filters
    }
    
    const viewProduct = (product) => {
      store.dispatch('ui/selectProduct', product)
    }

    return {
      sortBy,
      viewMode,
      filteredAndSortedProducts,
      viewProduct,
      handleFiltersChanged
    }
  }
}
</script>

<style scoped>
.gallery {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding-bottom: 2rem;
}

.gallery-header {
  text-align: center;
  color: white;
  padding: 2rem 0;
}

.gallery-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.gallery-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;
}

.gallery-content {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  min-height: 500px;
}

.gallery-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.gallery-controls select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.gallery-controls select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: #e9ecef;
  padding: 0.25rem;
  border-radius: 8px;
}

.view-toggle button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-toggle button.active {
  background: #007bff;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.view-toggle button:hover:not(.active) {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.product-display {
  padding: 2rem;
  min-height: 400px;
}

.product-display.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.product-display.list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.no-results p {
  font-size: 1rem;
  opacity: 0.8;
}

@media (max-width: 1200px) {
  .gallery-container {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }

  .product-display.grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 992px) {
  .gallery-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .gallery-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .view-toggle {
    align-self: center;
  }
}

@media (max-width: 768px) {
  .gallery-container {
    padding: 0 1rem;
  }

  .gallery-header h1 {
    font-size: 2.5rem;
  }

  .product-display {
    padding: 1rem;
  }

  .product-display.grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .gallery-controls {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .product-display.grid {
    grid-template-columns: 1fr;
  }

  .gallery-header h1 {
    font-size: 2rem;
  }

  .view-toggle button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>